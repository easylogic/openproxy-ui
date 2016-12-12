const MainPlugin = require('../../lib/MainPlugin');

class Settings extends MainPlugin {
    constructor (app) {

        console.log(app);
        super({
            name : 'settings'
        })

        this.mainApp = app;

        //console.log(this.mainApp);
    }

    load () {
        super.load();
        //console.log(this);
        this.mainApp.openproxy.set(this.get('settings'));

    }

    unload () {
        super.unload();

        this.mainApp.openproxy.removeOption();
    }


}

module.exports = Settings;