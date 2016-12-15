const electron = require('electron');
const app = electron.app;
const MainPlugin = require('../../lib/MainPlugin');

class Settings extends MainPlugin {
    constructor () {
        super({
            name : 'settings'
        })
    }

    load () {
        super.load();

        if (app) {
            app.openproxy.setOption(this.get('settings') || {});
        }

    }

    unload () {
        super.unload();

        if (app) {
            app.openproxy.removeOption();
        }

    }


}

module.exports = Settings;