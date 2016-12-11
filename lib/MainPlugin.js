const fs = require('fs');
const Config = require('electron-config');

class MainPlugin {
    constructor (options) {
        this.options = options || {};
        this.config = new Config({ name : 'openproxy.' + this.options.name });

        this.load();
    }

    has (key) {
        return this.config.has(key);
    }

    get (key) {
        return this.config.get(key);
    }

    set (key, value) {
        this.config.set(key, value);
    }

    remove (key) {
        this.config.delete(key);
    }

    reload () {
        this.unload();
        this.load();
    }

    load () {

    }

    unload () {

    }

    /** Override method 
    beforeRequest (session) {

    }**/

}

module.exports = MainPlugin;