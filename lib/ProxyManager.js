const execSync = require('child_process').execSync;

let window_proxy_command = function (command) {
    let ret = execSync(__dirname + "/../system/window/WindowProxyManager.exe "+ command);
};

let darwin_proxy_command = function (command) {

    let arr = command.split(" ");

    if (arr[0] == 'start') {

    } else if (arr[0] == 'stop') {

    }


}

let linux_proxy_command = function (command) {

    let arr = command.split(" ");

    if (arr[0] == 'start') {

    } else if (arr[0] == 'stop') {

    }


}

function setProxyOn (proxy_address) {
    console.log('attach proxy');
    if (process.platform == 'darwin') {
        darwin_proxy_command("start " + proxy_address);
    } else if (process.platform == 'win32') {
        window_proxy_command("start " + proxy_address);
    } else if (process.platform == 'linux') {
        linux_proxy_command("start " + proxy_address);
    }
}

function setProxyOff () {
    console.log('detach proxy');
    if (process.platform == 'darwin') {
        darwin_proxy_command("stop");
    } else if (process.platform == 'win32') {
        window_proxy_command("stop");
    } else if (process.platform == 'linux') {
        linux_proxy_command("stop");
    }
}

module.exports = {
    on : setProxyOn,
    off : setProxyOff
}
