const fs = require('fs');
const path = require('path');
const RenderPlugin = require('./lib/RenderPlugin');

const remote = require('electron').remote;

module.exports = class App extends RenderPlugin {
    constructor(options) {
        super(Object.assign({
            name : 'app'
        }, options || {}));

        this.plugin_root = __dirname + "/plugin";
        this.plugin_instances = {};
        this.plugin_tables = [];
        this.switch = null;

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
            let PluginObject = JSON.parse(fs.readFileSync(path.join(plugin_root, plugin, "package.json")) + "");

            let PluginClass = require(path.join(plugin_root , plugin , "render"));

            // use directory name as plugin id
            PluginObject.id = plugin;

            that.addPlugin(PluginObject, PluginClass);
        });

        this.plugin_tables.sort(function (a, b) {
            return a.order > b.order;
        })

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

    plugin (name) {
        return this.plugin_instances[name];
    }

    switchOn (isOn) {
        this.set('on', isOn);

        remote.app.emit('proxyOn', isOn, this.settings);
    }

    initEvent () {
        let that = this;
        this.switch.on('change', function () {
            that.switchOn(this.getValue());
        });

        this.$menu_items.on('click', '[data-name]', function () {
            that.showPlugin($(this).data('name'));
        })
    }

    addPlugin(options, PluginClass) {
        this.plugin_instances[options.name] = new PluginClass(options);
        this.plugin_tables.push(options);

        remote.app.addPlugin(this.plugin_instances[options.name]);
    }

    /**
     * common ui
     */
    alert (message, callback) {
        if (typeof callback == 'function') {
            callback(alert(message));
        } else {
            return alert(message);
        }
    }

    confirm(message, callback) {
        if (typeof callback == 'function') {
            callback(confirm(message));
        } else {
            return confirm(message);
        }
    }
    
    modal ($div, options) {
        this.$el.append($div);
        var position = this.$el.position();
        var width = this.$el.width();
        var height = this.$el.height();

        var left = width/2 - $div.width()/2;
        var top = height/2 - $div.height()/2;

        $div.css({
            position: 'absolute',
            left : left + 'px',
            top : top + 'px'
        }).show();
    }

    showDirectory (options, callback) {
        this.showOpenDialog(Object.assign({
            properties: ['openDirectory']
        }, options || {}), callback);
    }

    showFile (options, callback) {
        this.showOpenDialog(Object.assign({
            properties: ['openFile']
        }, options || {}), callback);
    }

    showOpenDialog (options, callback) {
        remote.dialog.showOpenDialog(options || {}, callback);
    }
}

