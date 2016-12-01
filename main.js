
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

const OpenProxy = require('openproxy');

app.openproxy = new OpenProxy();

app.openproxy.addPlugin({
  load : function () {
    console.log('start proxy', app.openproxy.opt.port );
  },

  close : function () {
    console.log('stop proxy'); 
  },
  
  beforeRequest : function (session) {
    //console.log(session.parse);
  }
})

function setProxyOn () {
  if (process.platform == 'darwin') {

  } else if (process.platform == 'window') {

  } else if (process.platform == 'linux') {

  }
}

function setProxyOff () {
  if (process.platform == 'darwin') {

  } else if (process.platform == 'window') {

  } else if (process.platform == 'linux') {

  }
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1024, height: 600})

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

app.on('settings', function (settings) {
  app.openproxy.set(settings);
})

// when proxy is on
app.on('proxyOn', function (isOn) {
  if (isOn) {
    app.openproxy.init()

    setProxyOn();
  } else {
    app.openproxy.close();
    setProxyOff();
  }

})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
