const path = require('path');
const fs = require('fs');
const RenderPlugin = require('../../lib/RenderPlugin');
const HttpStatus = require('./HttpStatus');

class RuleTable extends RenderPlugin{
    constructor (options) {
        super(options);

        this.$el = $("<div class='rule-table' />");
        this.initElement();
        this.load();
    }

    load () {
        this.rule_table = this.get('rule_table') || [];

        this.reload();
    }

    getTemplateRoot () {
        return path.join(__dirname, "template");
    }

    find (selector) {
        return this.$el.find(selector);
    }

    initElement () {

        this.$el.html(this.tpl("main"));

        this.$group_items = this.find(".group-items");
        this.$rule_items = this.find(".rule-items");

        this.initEvent();
    }

    reload () {
        // group 의 선택 여부를 데이타로 설정하면 나머지는 ui 를 새로 그린다.

        this.reloadGroups();

        this.reloadRules();
    }

    reloadGroups () {
        this.$group_items.empty();

        var groups = this.rule_table;

        this.$group_items.html(this.tpl('group-item', { groups : groups } ));
    }

    reloadRules () {
        // set group name
        this.find(".group-name").val(this.getSelectedGroupTitle());

        // set rules
        this.$rule_items.empty();
        
        var index = this.getSelectedGroupIndex();

        var groups = this.rule_table[index] || { rules : [] };

        for(var i = 0, len = groups.rules.length; i < len; i++) {
            groups.rules[i] = this.checkRuleType(groups.rules[i]);
        }

        this.$rule_items.html(this.tpl('rule-item', { rules : groups.rules } ));
    }

    selectGroup ($group_item) {

        if (!$group_item.hasClass('selected')) {
            this.$group_items.find(".selected").removeClass('selected');
            $group_item.addClass('selected');

            this.reloadRules();
        }
    }
    
    addGroup () {
        let groups = [];
        
        groups.push({ selected : false, name : "New Group" });

        let $group = $(this.tpl('group-item', { groups : groups }));

        this.$group_items.append( $group );

        this.selectGroup($group);
    }

    deleteGroup () {

        let index = this.$group_items.find(".selected").index();

        if (index == -1) {
            alert('Choose a group.');
            return;
        }

        if (!confirm("Delete a group really?")) {
            return;
        }

        let nextSelectedIndex = 0;
        this.$group_items.find(".selected").remove();

        if (this.$group_items.find(".group-item").eq(index)) {
            nextSelectedIndex = index;
        } else if (this.$group_items.find(".group-item").eq(index - 1)) {
            nextSelectedIndex = index - 1;
        }

        this.$group_items.find(".group-item").eq(nextSelectedIndex).addClass('selected');

        this.reloadRules();
    }

    checkRuleType (obj) {
        obj.type = obj.type || 'host';
        obj.isHost = obj.type == 'host';
        obj.isUrl = obj.type == 'url';
        obj.isPattern = obj.type == 'pattern';
        obj.typeGroupName = [Date.now() , Math.random()].join(":");

        return obj;
    }
    
    addRule () {

        let count = this.$group_items.find("> .selected").length;

        if (count == 0) {
            alert("Choose a group");
            return;
        }

        this.$rule_items.find('.rule-item.empty').remove();
        
        let rules = [];
        
        rules.push( this.checkRuleType({ checked : true, source : '', target : '', type : 'host' }));

        let $item = $(this.tpl('rule-item', { rules :  rules } ));

        this.reloadPreview($item);

        this.$rule_items.append($item);

        this.reindexRuleItem();
    }

    reloadPreview ($rule_item) {

        var obj = this.generateRuleItem($rule_item);

        $rule_item.find(".check-status").attr('title', obj.checked  ? 'Apply rule' : 'Don\'t apply rule');
        $rule_item.find(".preview-type").text(obj.type);
        $rule_item.find(".preview-source").text(obj.source);
        $rule_item.find(".preview-target").text(obj.target);

    }

    reindexRuleItem () {
        this.$rule_items.find(".rule-item").each(function(i) {
            $(this).attr('index', i);
        })
    }

    upRule ($rule_item) {
        var $prev = $rule_item.prev();

        if ($prev.length) {
            $prev.before($rule_item);
        }

        $rule_item[0].scrollIntoView();

    }

    downRule ($rule_item) {
        var $next = $rule_item.next();

        if ($next.length) {
            $next.after($rule_item);
        }

        $rule_item[0].scrollIntoView();

    }

    getSelectedGroupTitle () {
        return this.$group_items.find(".selected .title").text();
    }

    getSelectedGroupIndex () {
        return this.$group_items.find(".selected").index();
    }

    generateRuleItem ($rule_item) {
        let obj = {
            checked: $rule_item.find(".check-status").hasClass('icon-checkbox'),
            type: $rule_item.find("input[type=radio]:checked").val(),
            source: $rule_item.find(".source input[type=text]").val(),
            target: $rule_item.find(".target input[type=text]").val(),
            summary: $rule_item.find(".summary input[type=text]").val()
        }

        return obj;
    }

    generateRules () {
        let list = [];
        const that = this;
        this.$rule_items.find(".rule-item").each(function() {
            list.push(that.generateRuleItem($(this)));
        })

        return list;
    }

    saveConfig () {

        var index = this.getSelectedGroupIndex();

        this.rule_table[index] = Object.assign(
            this.rule_table[index] || {},
            { name : this.getSelectedGroupTitle(), rules : this.generateRules() }
        );

        this.set('rule_table', this.rule_table);
    }

    saveRules () {

        if (this.saveTimer) {
            clearTimeout(this.saveTimer);
        }

        let that = this;
        this.saveTimer = setTimeout(function () {
            that.saveConfig();
        }, 300);

    }

    saveGroupName () {
        let title = this.find(".group-name").val();
        this.$group_items.find(".selected .title").text(title);
    }

    createHttpStatusSelectWindow (opt) {
        opt = opt || {};
        let $div = $(this.tpl('modal', {
            width: '300px',
            height : '200px',
            title : 'Choose Http Status',
            body : this.tpl('http-status-modal', { status : HttpStatus.toList() })
        }));

        $div.on('click', '.close', function () {
            $div.remove();
        })

        $div.on('click', '.apply', function () {
            if (opt.apply) {
                opt.apply($div.find(".select-http-status").val());
            }

            $div.remove();
        })
        
        return $div; 
    }
    
    setHttpStatus(text, $rule_item) {

        if (text == 'more') {
            app.modal(this.createHttpStatusSelectWindow({
                apply : function (code) {
                    $rule_item.find(".target-input").val(HttpStatus.message(code)).focus().trigger('input');
                }
            }));
        } else {
            $rule_item.find(".target-input").val(HttpStatus.message(text)).focus().trigger('input');
        }

    }

    loadFilePath ($rule_item) {

        app.showFile({}, function ( files ) {
            $rule_item.find(".target-input").val("file://" + files.join(',')).trigger('input');
        });
    }

    loadDirectoryPath ($rule_item) {

        app.showDirectory({}, function ( files ) {
            $rule_item.find(".target-input").val("dir://" + files.join(',')).trigger('input');
        });
    }

    initEvent() {

        const that = this;
        
        this.$el.on('click', ".add-group" , function () {
            that.addGroup();
            that.saveRules();
        });
        this.$el.on('click', ".delete-group", function () {
            that.deleteGroup();
            that.saveRules();
        });
        this.$el.on('click', ".reload-group", function () {
            that.reload();
        });
        this.$el.on('click', ".save-rules", function () {
            that.saveRules();
        });


        this.$group_items.on('click', ".group-item", function () {

            that.selectGroup($(this));
        });
        
        this.$el.on('click', ".add-rule", function () {
           that.addRule();

           that.saveRules();
        });

        this.$el.on('input', ".group-name", function () {
            that.saveGroupName();

            that.saveRules();
        });

        this.$el.on('click', ".save-group-name", function () {
            that.saveGroupName();

            that.saveRules();
        })

        this.$rule_items.on("click", ".check-status", function (e) {
            e.preventDefault();
            if ($(this).hasClass('icon-checkbox')) {
                $(this).addClass('icon-checkbox2').removeClass('icon-checkbox');
            } else {
                $(this).addClass('icon-checkbox').removeClass('icon-checkbox2');
            }
            that.reloadPreview($(this).closest('.rule-item'));

            that.saveRules();
        });
        this.$rule_items.on("click", ".icon-trashcan", function (e) {
            if (confirm("Delete a rule?")) {
                $(this).closest(".rule-item").remove();

                that.saveRules();
            }
        })

        this.$rule_items.on('click', 'input[type=radio]', function (e) {
            that.reloadPreview($(this).closest('.rule-item'));

            that.saveRules();
        })

        this.$rule_items.on('input', 'input[type=text]', function (e) {
            that.reloadPreview($(this).closest('.rule-item'));

            that.saveRules();
        })

        this.$rule_items.on('click', '.up-rule', function () {
            that.upRule($(this).closest('.rule-item'));

            that.saveRules();

        });
        this.$rule_items.on('click', '.down-rule', function () {
            that.downRule($(this).closest('.rule-item'));

            that.saveRules();
        });

        this.$rule_items.on('change', '.http-status-select', function () {
            var text = $(this).val();

            that.setHttpStatus(text, $(this).closest('.rule-item'));
        });

        this.$rule_items.on('click', '.file-select', function () {
            that.loadFilePath($(this).closest('.rule-item'));
        })

        this.$rule_items.on('click', '.directory-select', function () {
            that.loadDirectoryPath($(this).closest('.rule-item'));
        })
    }
}

module.exports =  RuleTable;