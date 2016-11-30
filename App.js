const fs = require('fs');
const path = require('path');
const PluginCore = require('./lib/PluginCore');

module.exports = class App extends PluginCore {
    constructor(options) {
        super(Object.assign({
            name : 'app'
        }, options || {}));

        this.plugin_root = __dirname + "/plugin";
        this.plugin_instances = {};
        this.plugin_tables = [];
        this.swtich = null;

        this.initElement();
        this.loadPlugins();
        this.showPlugin();
    }

    getTemplateRoot () {
        return path.join(__dirname, "template");
    }

    find (selector) {
        return this.$el.find(selector);
    }

    initElement () {
        this.$el = $(this.tpl('main'));

        this.$menu_items = this.find(".menu-items");
        this.$app_content = this.find(".app-content");

        this.switch = jui.create("ui.switch", this.find(".proxy-switch"));

        this.initEvent ()
    }

    loadPlugins () {
        let plugins = fs.readdirSync(this.plugin_root);
        let that = this;

        this.plugin_instances = {};
        this.plugin_tables = [];

        let plugin_root = this.plugin_root;

        plugins.forEach(function(plugin) {
            let PluginObject = JSON.parse(fs.readFileSync(plugin_root + "/" + plugin + "/package.json") + "");

            let PluginClass = require(plugin_root + "/" + plugin);

            // use directory name as plugin id
            PluginObject.id = plugin;

            that.addPlugin(PluginObject, PluginClass);
        });

        this.reloadMenuItems();
    }

    reloadMenuItems () {
        this.$menu_items.html(this.tpl('menu-item', { menus : this.plugin_tables } ));
    }

    selectMenu(name) {
        this.$menu_items.find(".selected").removeClass('selected');
        this.$menu_items.find("[data-name='" + name + "']").addClass('selected');
    }

    showPlugin(name) {

        if (!name) {
            name = this.plugin_tables[0].name;
        }

        this.selectMenu(name);

        this.$app_content.html(this.tpl('content', this.plugin_instances[name].options));

        this.$app_content.find(".plugin-" + name).html(this.plugin_instances[name].$el);
    }

    switchOn (isOn) {
        this.set('on', isOn);

        // 프록시 설정을 어떻게 해야하나
    }

    initEvent () {
        let that = this;
        this.switch.on('change', function () {
            that.switchOn(this.getValue());
        })
    }

    addPlugin(options, PluginClass) {
        this.plugin_instances[options.name] = new PluginClass(options);
        this.plugin_tables.push(options);
    }

}

