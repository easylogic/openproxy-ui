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

    loadTemplate (dir) {
        const plugin_template_root = path.join(this.getTemplateRoot() , '\\');
        const tpl_root = dir || this.getTemplateRoot();

        const list = fs.readdirSync(tpl_root);

        const that = this;

        list.forEach(function(tpl) {
            let template_file = path.join(tpl_root, tpl);

            if (path.extname(template_file) == '.html') {
                let tpl_name = template_file.replace(plugin_template_root, "").replace(path.sep, "/");
                let content = fs.readFileSync(template_file) + "";

                Mustache.parse(content);

                that.addTemplate(tpl_name.replace(".html", ""), content);
            } else {
                that.loadTemplate(template_file);
            }

        });


    }
}

module.exports = PluginCore;