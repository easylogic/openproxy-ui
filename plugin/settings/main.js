const MainPlugin = require('../../lib/MainPlugin');

class Settings extends MainPlugin {
    constructor (app) {
        super({
            name : 'settings'
        })

        this.app = app;
    }

    load () {
        super.load();

        this.app.openproxy.set(this.get('settings'));

    }

    unload () {
        super.unload();

        this.app.openproxy.removeOption();
    }


}

module.exports = Settings;