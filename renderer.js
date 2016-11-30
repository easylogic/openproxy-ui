const App = require("./App");

jui.ready(function () {

    window.app = new App();

    $('body').append(window.app.$el);

});