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

    $(".policy-items").on("click", ".check-status", function (e) {
        e.preventDefault();
        if ($(this).hasClass('icon-checkbox')) {
            $(this).addClass('icon-checkbox2').removeClass('icon-checkbox');
        } else {
            $(this).addClass('icon-checkbox').removeClass('icon-checkbox2');
        }
    });
    $(".policy-items").on("click", ".icon-trashcan", function (e) {
        if (confirm("Delete a rule?")) {
            $(this).parent().parent().remove();
        }
        e.preventDefault();
        return;
    })
    $(".policy-items").on("click", "> .panel .head", function (e) {

        if ($(e.target)[0].tagName == 'I') {

        } else {
            $(".policy-items .panel.selected").removeClass('selected');
            $(this).parent().addClass('selected');
        }


    })
});