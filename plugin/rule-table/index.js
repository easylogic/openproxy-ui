const path = require('path');
const fs = require('fs');
const PluginCore = require('../../lib/PluginCore');

class RuleTable extends PluginCore{
    constructor (options) {
        super(options);

        this.$el = $("<div class='rule-table' />");

        this.initElement();

        this.load();
    }

    load () {
        this.rule_table = this.get('rule_table') || [];
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
        this.$rule_items.empty();
        
        var index = this.$group_items.find(".group-item.selected").index();

        var groups = this.rule_table[index] || { rules : [] };

        this.$rule_items.html(this.tpl('rule-item', { rules : groups.rules } ));
    }
    
    addGroup () {
        let groups = [];
        
        groups.push({ selected : false, name : "New Group" });
        this.$group_items.append(this.tpl('group-item', { groups : groups }) );
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
        
        rules = [
            this.checkRuleType({ source : '', target : '', type : 'host' })
        ]

        let $item = $(this.tpl('rule-item', { rules :  rules } ));

        this.reloadPreview($item);

        this.$rule_items.append($item);

        this.reindexRuleItem();
    }

    reloadPreview ($rule_item) {
        $rule_item.find(".check-status").attr('title', $rule_item.find(".check-status").hasClass('icon-checkbox') ? 'Apply rule' : 'Don\'t apply rule');
        $rule_item.find(".preview-type").text($rule_item.find("input[type=radio]:checked").val());
        $rule_item.find(".preview-source").text($rule_item.find(".source input[type=text]").val());
        $rule_item.find(".preview-target").text($rule_item.find(".target input[type=text]").val());
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

    initEvent() {

        const that = this;
        
        this.find(".add-group").on('click', function () {
            that.addGroup();
        });
        this.find(".delete-group").on('click', function () {
            that.deleteGroup();
        });
        this.find(".reload-group").on('click', function () {
            that.reload();
        });


        this.$group_items.on('click', ".group-item", function () {

            if (!$(this).hasClass('selected')) {
                that.$group_items.find(".selected").removeClass('selected');
                $(this).addClass('selected');

                that.reloadRules();
            }
        });
        
        this.find(".add-rule").on('click', function () {
           that.addRule(); 
        });

        this.$rule_items.on("click", ".check-status", function (e) {
            e.preventDefault();
            if ($(this).hasClass('icon-checkbox')) {
                $(this).addClass('icon-checkbox2').removeClass('icon-checkbox');
            } else {
                $(this).addClass('icon-checkbox').removeClass('icon-checkbox2');
            }
            that.reloadPreview($(this).closest('.rule-item'));
        });
        this.$rule_items.on("click", ".icon-trashcan", function (e) {
            if (confirm("Delete a rule?")) {
                $(this).closest(".rule-item").remove();
            }
            e.preventDefault();
            return;
        })

        this.$rule_items.on('click', 'input[type=radio]', function (e) {
            that.reloadPreview($(this).closest('.rule-item'));
        })

        this.$rule_items.on('input', 'input[type=text]', function (e) {
            that.reloadPreview($(this).closest('.rule-item'));
        })

        this.$rule_items.on('click', '.up-rule', function () {
            that.upRule($(this).closest('.rule-item'));
        });
        this.$rule_items.on('click', '.down-rule', function () {
            that.downRule($(this).closest('.rule-item'));
        });
    }
}

module.exports =  RuleTable;