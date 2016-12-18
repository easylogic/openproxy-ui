const fs = require('fs');
const path = require('path');
const app = require('electron').app;
const MainPlugin = require('./lib/MainPlugin');

module.exports = class App extends MainPlugin {
    constructor(options) {
        super(Object.assign({
            name : 'app'
        }, options || {}));

        this.plugin_root = __dirname + "/plugin";
        this.plugin_instances = {};
        this.plugin_tables = [];

        this.loadPlugins();
    }


    loadPlugins () {
        let plugins = fs.readdirSync(this.plugin_root);
        let that = this;

        this.plugin_instances = {};
        this.plugin_tables = [];

        let plugin_root = this.plugin_root;

        plugins.forEach(function(plugin) {
            let PluginObject = JSON.parse(fs.readFileSync(path.join(plugin_root, plugin, "package.json")) + "");

            let PluginClass = require(path.join(plugin_root , plugin , "main"));

            // use directory name as plugin id
            PluginObject.id = plugin;

            that.addPlugin(PluginObject, PluginClass);
        });

        this.plugin_tables.sort(function (a, b) {
            return a.order > b.order;
        })
    }

    plugin (name) {
        return this.plugin_instances[name];
    }

    addPlugin(options, PluginClass) {
        this.plugin_instances[options.name] = new PluginClass(options);
        this.plugin_tables.push(options);

        app.openproxy.addPlugin(this.plugin_instances[options.name]);
    }
}

