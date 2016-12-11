const path = require('path');
const fs = require('fs');
const RenderPlugin = require('../../lib/RenderPlugin');

class Settings extends RenderPlugin{
    constructor (options) {
        super(options);

        this.$el = $("<div class='settings property' />");
        this.initElement();
        this.load();
    }

    load () {
        this.settings = this.get('settings') || {};

        this.reload();
    }

    getTemplateRoot () {
        return path.join(__dirname, "template");
    }

    find (selector) {
        return this.$el.find(selector);
    }

    initElement () {

        this.$el.html(this.tpl('main'));

        this.settingsProperty = jui.create('ui.property', this.find('.settings-property'), {
           items : [
               { type : 'group', title : 'Default Settings' },
               { title : 'Proxy Port', key : 'port', value : '8888' },
               { title : 'Log Save Directory', key : 'logSaveDirectory', value : '', render : function ($dom, item) {

                   var $group = $("<div class='' />");

                   var $text = $("<input type='text' />").css({
                       width: '200px'
                   });
                   $text.val(item.value);

                   $text.on('input', function () {
                       var value = $(this).val();

                       item.value = value;
                   });

                   $group.append($text);

                   var $btn = $("<a class='btn small' />").html('<i class="icon-search"></i>');

                   $btn.on('click', function () {
                       app.showDirectory({}, function ( files ) {
                           $text.val(files.join(',')).trigger('input');
                       });
                   });

                   $group.append($btn);

                   return $([$group[0]]);
               }}
           ]
        });

        this.initEvent();
    }

    reload () {
        this.reloadSettings();
    }

    reloadSettings() {
        console.log(this.settings);
        this.settingsProperty.setValue(this.settings);
    }

    saveSettings () {
        this.set('settings', this.settingsProperty.getValue());

        console.log(this.get('settings'));
    }

    initEvent() {
        let that = this;
        this.$el.on('click', ".settings-save", function () {
            that.saveSettings();
        });

    }
}

module.exports =  Settings;