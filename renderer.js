const fs = require('fs');
const PLUGIN_ROOT = __dirname + "/plugin";
let  plugin_tables = {};

function createPlugin(plugin, options, PluginClass) {
    plugin_tables[plugin] = new PluginClass(options);
}


jui.ready(function () {

    let plugins = fs.readdirSync(PLUGIN_ROOT);

    plugins.forEach(function(plugin) {
        let PluginObject = JSON.parse(fs.readFileSync(PLUGIN_ROOT + "/" + plugin + "/package.json") + "");

        let PluginClass = require(PLUGIN_ROOT + "/" + plugin);

        createPanel(plugin, PluginObject, PluginClass);
    });

   
});