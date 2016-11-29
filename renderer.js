const fs = require('fs');
const PLUGIN_ROOT = __dirname + "/plugin";
let  plugin_tables = {};

function createPlugin(options, PluginClass) {
    let $dom = $("<div />");

    plugin_tables[options.name] = new PluginClass($dom, options);
}


jui.ready(function () {

    let plugins = fs.readdirSync(PLUGIN_ROOT);

    plugins.forEach(function(plugin) {
        let PluginObject = JSON.parse(fs.readFileSync(PLUGIN_ROOT + "/" + plugin + "/package.json") + "");

        let PluginClass = require(PLUGIN_ROOT + "/" + plugin);

        createPanel(PluginObject, PluginClass);
    });

   
});