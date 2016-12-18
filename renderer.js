const App = require("./RenderApp");

jui.ready(function () {

    window.app = new App();

    $('body').append(window.app.$el);

});