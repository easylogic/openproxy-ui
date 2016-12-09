var fs = require('fs');

function Config(opt) {
	this.opt = opt;
	this.data = {};
	
	this.load();
}

Config.prototype.load = function() {
	
	if (this.opt.path) {
		this.data = JSON.parse(fs.readFileSync(this.opt.path));	
	}
	
}

Config.prototype.get = function(key) {
	
	return this.data[key];
}

Config.prototype.set = function(key, value) {
	this.data[key] = value;
}

Config.prototype.hostnameIs = function(hostname) {
	if (this.data.table) { 
		return this.data.table[hostname];
	} else {
		return false;
	}
}

/**
 * save config file in opt.path
 *  
 */
Config.prototype.update = function() {
	fs.writeFileSync(this.opt.path, JSON.stringify(this.data, null, 4))
}

module.exports = Config;