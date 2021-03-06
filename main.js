
const electron = require('electron')
const path = require('path')
const url = require('url')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const appRoot = path.join(__dirname, '.')

require('electron-compile').init(appRoot, './');
require('electron-reload')(__dirname);

const ProxyManager = require('./lib/ProxyManager');
const OpenProxy = require('./lib/openproxy');
const i18n = new(require('./translations/i18n'));
const MainApp = require('./MainApp');

app.openproxy = new OpenProxy();
app.proxymanager = ProxyManager;
app.mainApp = new MainApp();


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1200, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null

    app.emit('proxyOn', false); // 윈도우를 닫을 때 프록시 설정 다시 돌리기 

  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// when proxy is on
app.on('proxyOn', function (isOn) {
  if (isOn) {
    ProxyManager.on(app.openproxy.host());
  } else {
    ProxyManager.off();
  }

})

app.on('proxyStart', function (isOn) {
  if (isOn) {
    app.openproxy.trigger('reload');
    app.openproxy.init();
  } else {
    app.openproxy.close();
  }

})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
