const path = require('path');
const fs = require('fs');
const Mustache = require('mustache');
const Config = require('electron-config');

class PluginCore {
    constructor (options) {
        this.options = options || {};
        this.templates = {};
        this.config = new Config({ name : this.options.name });

        this.loadTemplate();
    }

    has (key) {
        return this.config.has(key);
    }

    get (key) {
        return this.config.get(key);
    }

    set (key, value) {
        this.config.set(key, value);
        console.log(key, value);
    }

    remove (key) {
        this.config.delete(key);
    }

    tpl (name, data) {
        return this.renderTemplate(name, data);
    }

    renderTemplate (name, data) {
        return Mustache.render(this.templates[name] || "", data || {});
    }

    addTemplate (name, templateString) {
        this.templates[name] = templateString;
    }

    getTemplateRoot () {
        return path.join(__dirname, "template");
    }

    loadTemplate () {
        const tpl_root = this.getTemplateRoot();

        const list = fs.readdirSync(tpl_root);

        const that = this;

        list.forEach(function(tpl) {
            let template_file = path.join(tpl_root, tpl);

            let content = fs.readFileSync(template_file) + "";

            Mustache.parse(content);

            that.addTemplate(tpl.replace(".html", ""), content);

        });


    }
}

module.exports = PluginCore;