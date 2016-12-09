openproxy
=========

Open Proxy for Developers

# Install 
	
	npm install openproxy 
	
# How to use 

	var Proxy = require('openproxy');
	
	new Proxy().init();
	
# Events 

* beforeRequest
* afterRequest
* beforeResponse
* afterResponse
* error  	

# Plugin System 

	var Proxy = require('openproxy');
	
	proxy = new Proxy();
	
	// reverse proxy sample 
	proxy.addPlugin({
	
		// run beforeRequest event
		beforeRequest : function(session) {
		
			// if hostname is 'www.google.com', change to 'www.facebook.com'
			if (session.hostnameIs('www.google.com')) {
				session.change({ source : "www.google.com", target : 'www.facebook.com' })
			}
		}
	})
	
	proxy.init();
	
# License

The MIT License (MIT)

Copyright (c) 2012 easylogic.co.kr (cyberuls@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	
