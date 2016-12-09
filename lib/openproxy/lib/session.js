var url = require('url'),
	net = require('net'),
	http = require('http'),
	fs = require('fs'),
	mime = require('mime'),
	util = require('util'),
	path = require('path');

function Session (proxy, req, res, head) {
	
	this.proxy = proxy;  
	this.req = req;
	this.res = res;
	this.head = head;
	
	this.init();	
	
}

Session.prototype.setProxyResponse = function(response) {
	this.proxyRes = response;
}

Session.prototype.getProxyResponse = function() {
	return this.proxyRes;
}

/**
 * obj {
 * 	  type :   domain or pattern,  default "domain"
 *    source,
 *    target,
 *    dir
 *    file,
 *    status
 * }
 *  
 * @param {Object} obj
 */
Session.prototype.change = function(obj) {
	obj.type = obj.type || "domain";
	
	
	
	if (obj.target.indexOf("file://") > -1) {
		this.file(obj.target.replace("file://", ""));
	} else if (obj.target.indexOf("dir://") > -1) {
		if (obj.type == 'pattern') {
			var path = this.url();
			var index = path.indexOf(obj.source) + obj.source.length;
			var subpath = path.substr(index);
		} else {
			var subpath = this.$("path");
		}
		
		if (subpath == "" || subpath == "/") {
			subpath = "/index.html";
		}
		
		this.file(obj.target.replace("dir://", "") + subpath);	

	} else if (obj.target.indexOf("@") > -1) {
		var arr = obj.target.split("@");
		var status = parseInt(arr.shift());
		this.response({
			status : status,
			data : arr.join("@")
		});
	} else {
		var path = this.url().replace(obj.source, obj.target);
		var change = url.parse(path);
		
		if (change.hostname) 	this.$('hostname', change.hostname);
		if (change.port) 		this.$('port', change.port);
		
		this.$('path', change.path);			
		
		// check don't keep domain
		var keep = obj.keep || false;
		
		if (obj.keep) {
			var headers = this.$req('headers');
			
			// change host header
			headers['host'] = this.$("hostname");
			
			this.$req('headers', headers);
		}
		
	}	
}

Session.prototype.exec_error = function() {
	
	switch(this.error.message) {
		case "getaddrinfo ENOENT": this.response({ status : 400, data : '[OpenProxy] : Gateway Timeout' }); break;
	}

}

Session.prototype.exec_data = function() {
	var self = this;
		
	var fullBody = [];
	this.req.on("data", function(data) {
		fullBody.push(data);
	})
	this.req.on("end", function() {
		this.fullBody = fullBody;	
	})
 
	this.proxy.trigger('beforeRequest', this);

	if (this.hasResponse) return false;
	
	// get changed url data   
	var opt = this.opt();
	
	//console.log('data', JSON.stringify(opt, null, 4))	
	
	// create new http connection 
	var proxyReq = this.proxyReq = http.request(opt, function(response){
			
			this.proxyRes = response;
			var _res = self.res; 
			
			/*
			//TODO : save full response data  
			var temp = [];
			response.on('data', function(data) {
				temp.push(data+"");
			})
			
			response.on('end', function(){
				console.log(temp);
			}) */
			
			_res.statusCode = response.statusCode;
			_res.headers = response.headers;
			
			if (self.hasResponse) return ;
						
			self.proxy.trigger('beforeResponse', self);
		
			if (self.hasResponse) return ;		
		
			_res.writeHead(_res.statusCode, _res.headers);		  
			
			response.pipe(_res);		
			_res.pipe(response);
	})
	
	proxyReq.on('error', function(e){

		//console.log(e, self);
		self.error = e; 
		self.proxy.trigger('error', self)
		
		if (self.hasResponse) return;
		
		self.trigger('error', e)
		
	})
	  
	proxyReq.on('data', function(data) { 
		console.log('proxy request data', data);
	})
	
	this.req.pipe(proxyReq);
	
	this.proxy.trigger('afterRequest', this);

}

Session.prototype.exec_connect = function() {
	  var self = this; 
	  this.method = 'connect';
	  
	  //console.log("this", "connect", this.req.headers);
	  
	  this.proxy.trigger('beforeRequest', this);
	  
	  var opt = this.opt();
	  
	  //console.log('connect', JSON.stringify(opt, null, 4))
	  
	  var serverSocket = net.connect(opt.port, opt.host, function(){
	  	
	    self.res.write(
	    		"HTTP/1.1 200 Connection Established\r\n" + 
	    		"Proxy-agent:OpenProxy\r\n" + 
	    		"\r\n"
	    );
	    
	    // start https tunneling , don't touch secure data  
	    serverSocket.write(self.head);
	    serverSocket.pipe(self.res);
	    self.res.pipe(serverSocket);
	    
	  })	
	  
	  serverSocket.on('error', function(e){
		switch(e.message) {
			case "getaddrinfo ENOENT": self.response({ status : 400, data : '[OpenProxy] : Gateway Timeout' }); break;
		}
	  })

}

Session.prototype.exec_upgrade = function() {
	var self = this;
	this.method = 'upgrade';
	this.res.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' + 
				 'Upgrade: WebSocket\r\n' +
				 'Connection: Upgrade\r\n' + 
				 '\r\n'
	);  
	
	this.res.setMaxListeners(0);	
  
	this.res.on('error' ,function(e) {
		switch(e.message) {
			case "getaddrinfo ENOENT": self.response({ status : 400, data : '[OpenProxy] : Gateway Timeout' }); break;
		}
	})		
				 
	this.res.pipe(this.res);	
}

Session.prototype.trigger = function(event) {
	
	switch(event){
	case 'data': this.exec_data(); break;
	case 'connect' : this.exec_connect(); break;
	case 'upgrade' : this.exec_upgrade(); break;
	case 'error'   : this.exec_error(); break;
	}
}

Session.prototype.url = function() { 
		return url.format(this.parse);
}
	
Session.prototype.$ = function(key, value) { 
	
		if (arguments.length == 0)  {
			return this.parse;
		} else if (arguments.length == 1) { 
			if (key == 'port') {
				return parseInt(this.parse[key] || 80);
			} else if (key == 'protocol') {
				return this.parse[key] || "http:";			
			} else { 
				return this.parse[key];
			}
		} else if (arguments.length == 2) { 
			this.parse[key] = value;
		}
}

	
Session.prototype.hostnameIs = function(hostname) { 
	return (this.$('hostname') == hostname);
}

Session.prototype.methodIs = function(method) {
	return (this.$req("method") == method.toUpperCase());
}

Session.prototype.hostnameContains = function(hostname) {
	return (this.$('hostname').indexOf(hostname) > -1);
}

Session.prototype.urlContains = function(pattern) {
	return (this.url().indexOf(pattern) > -1);
}

Session.prototype.$req = function(k, v) {
	
	if (arguments.length == 1) {
		return this.req[k];		
	} else if (arguments.length == 2){
		return this.req[k] = v;
	}
}
	
Session.prototype.$res = function(k,v) {
	
	if (arguments.length == 1) {
		return this.res[k];		
	} else if (arguments.length == 2){
		return this.res[k] = v;
	}	 
}

Session.prototype.getClientIp = function() {
	return this.req.connection.remoteAddress;
}

Session.prototype.getClientPort = function() {
	return this.req.connection.remotePort;
}

Session.prototype.getServerIp = function() {
	return this.proxyReq.connection.remoteAddress;
}

Session.prototype.getServerPort = function() {
	return this.proxyReq.connection.remotePort;	
}

Session.prototype.init = function() { 
	var self = this; 
	if (this.$req('method') == 'CONNECT') { 
		this.parse = url.parse("https://" + this.$req('url'));
	} else { 
		this.parse = url.parse(this.$req('url'));
	}
	
	this.res.on('finish', function() {
		self.proxy.trigger('afterResponse', self);
	})
	
	//console.log(this.url());
	
	//console.log(this.req.connection.remoteAddress);
	
}

Session.prototype.file = function(target) {
	if (!target) {
		target = path.join(this.proxy.file, this.$('path'));
	}
	
	if (fs.existsSync(target)) {
		var stat = fs.statSync(target);
		
		var headers =  {
			'Content-Length' : stat.size, 
			'Content-Type' : mime.lookup(target) ,
			'Cache-Control' : 'no-cache,must-revalidate',
			'X-Proxy-Info' : 'OpenProxy'
		}

		if (this.method != 'connect' && this.method != 'upgrade') {
			this.res.writeHead(200, headers);
		
			fs.createReadStream(target).pipe(this.res);
			
			this.hasResponse = true; 			
		}

	} else {
		this.response({
			status : 400,
			data : "File not exists : " + target
		})
	}	
}

/**
 * data {
 *    status
 *    contentType
 *    data	
 * }
 *  
 * @param {Object} data
 */	
Session.prototype.response = function(data) {
	
		if (data.status == 200) {
			var headers =  {
				'Content-Length' : data.data.length, 
				'Content-Type' : data.contentType ,
				'Cache-Control' : 'no-cache,must-revalidate',
				'X-Proxy-Info' : 'OpenProxy'
			}
	
			this.res.writeHead(data.status, headers);			
		} else {
			if (this.res.writeHead) {
				this.res.writeHead(data.status);
			}
		}
		
		this.res.write(data.data);
		this.res.end();
		
		this.hasResponse = true; 
}

Session.prototype.opt = function() { 
		var headers = this.$req('headers');
		  
		headers['connection'] = headers['proxy-connection'];
		
		headers['proxy-connection'] = null;
		delete headers['proxy-connection'];
		  
		var opt = {
			host: this.$('hostname'),
			port: this.$('port'),
			path: this.$('path'),
			method: this.$req('method'),
			headers: headers
		};		
		
		return opt;
}

module.exports = Session;
