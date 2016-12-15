const path = require('path');
const electron = require('electron');
const fs = require('fs');

let loadedLanguage = {};
let app = electron.app ? electron.app : electron.remote.app;

module.exports = i18n;

function i18n() {

    this.load('default', __dirname);
}

i18n.prototype.__ = function (phrase, name) {

    name = name || 'default';

    return loadedLanguage[name][phrase] || loadedLanguage['default'][phrase] || phrase;
}

i18n.prototype.load = function (name, externalI18nDir) {

    if (loadedLanguage[name]) return;

    let localeFile = path.join(externalI18nDir, app.getLocale() + '.json');

    if (fs.existsSync(localeFile)) {
        loadedLanguage[name] = JSON.parse(fs.readFileSync(localeFile, 'utf8'));
    } else {
        loadedLanguage[name] = JSON.parse(fs.readFileSync(path.join(externalI18nDir, 'en.json'), 'utf8'))
    }
}