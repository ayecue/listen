var /**
	 *	Regular Expressions
	 */
	rxAgent = /(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i,
	rxVersion = /version\/([\.\d]+)/i,
	
	/**
	 * Browser
	 */
	browser = (function(){
		var agent = navigator.userAgent,
		app = agent.match(rxAgent),
		version = !app ? agent.match(rxVersion) : null, 
		res = {
			version : version ? version[1] : (app[2] || navigator.appVersion)
		};
		
		res[app[1] || navigator.appName] = true;
		
		return res;
	})();
	