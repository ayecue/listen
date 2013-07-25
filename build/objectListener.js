(function(global){var /**
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
	
/**
 * Loops through arrays and objects.
 * 
 * @param Object/Array obj Current context to go through
 * @param Function callback Current char
 * @param Object pre Predefine result value (optional)
 * @return result object
 */
function forEach(obj, callback, pre) {
	if (obj == null) {
		return null;
	}
	
	var t, d = {
		result: pre,
		skip: false
	};
	
	if (typeof obj == 'function') {
		while ((t = obj.call(d)) && !d.skip) {
			callback.call(d, t);
		}
	} else if (t = obj.length) {
		for (var k = 0; k < t && !d.skip; callback.call(d, k, obj[k++]));
	} else {
		for (var k in obj) {
			typeof obj[k] != 'unknown' && callback.call(d, k, obj[k]);
			
			if (d.skip) {
				break;
			}
		}
	}
	
	return d.result;
}

/**
 * Extend multiple objects.
 * 
 * @param Object[] All objects which you want to unite
 * @return extended object
 */
function extend() {
	var args = toArray(arguments),
	last = args.length - 1,
	nil = true,
	src = args.shift() || {};
	
	getType(args[last]) === 'boolean' && (nil = args.pop());
	
	return forEach(args, function(index, item) {
		getType(item) === 'object' && (this.result = forEach(item, function(prop, child) { 
			!! (nil || (child != null && child.length)) && item.hasOwnProperty(prop) && (this.result[prop] = child);
		}, this.result));
	}, src);
}

/**
 * Convert objects to an array.
 * 
 * @param Object obj Object to convert
 * @return converted object
 */
var slice = [].slice,
	push = [].push,
	toArray = (!browser.MSIE || parseInt(browser.version) > 7) && slice ? function(obj) {
		return slice.call(obj);
	} : function(obj) {
		var toSlice = [];
		
		push.apply(toSlice,obj);
		
		return toSlice;
	};
	

/**
 * Basic class creator.
	*
 * @package Class
 * @author swe <soerenwehmeier@googlemail.com>
 * @version 0.8.2.2
 */
function Class() {
	return forEach(arguments, function(_, module) {
		var create = module.create;
		
		if (create) {
			var old = this.result.prototype.create;
			
			this.result.prototype.create = old ? function() {
				return forEach([create.apply(this, arguments), old.apply(this, arguments)], function(_, item) {
					item && (item instanceof Array ? this.result.concat(item) : this.result.push(item));
				}, []);
				} : function() {
				return create.apply(this, arguments);
			};
			
			delete module.create;
		}
		
		if (module.static) {
			extend(this.result, module.static);
			delete module.static;
		}
		
		extend(this.result.prototype, module);
		}, function() {
		return !!this.create ? this.create.apply(this, arguments) : this;
	});
}

var	/**
	 * Handling object types.
		*
	 * @package Type
	 * @author swe <soerenwehmeier@googlemail.com>
	 * @version 0.8.2.2
	 */
	Type = new Class({
		/**
		 * Constructor
		 * 
		 * @param Object handler Special handler for different object subtypes
		 * @return Type
		 */
		create: function(handler) {
			this.handler = handler;
		},
		
		/**
		 * Compile native object types to their subtype.
		 * 
		 * @param Object obj Object you want to know the type of
		 * @return Type
		 */
		compile: function(obj) {
			var type = typeof obj,
			func = this.handler[type];
			
			return func ? func(obj) : type;
		}
	}),

	/**
	 * GetType helper.
	 */
	typeifier = new Type({
		object: (function(parents) {
			var length = parents.length;
			
			return function(object) {
				return forEach(parents, function(index, item) {
					if (object instanceof global[item]) {
						this.result = item.toLowerCase();
						this.skip = true;
					}
				}) || 'object';
			};
		})(['Array', 'Number', 'Date', 'RegExp'])
	});
	
/**
 * Get the type of an object.
 * 
 * @param Object obj Object you want to know the type of
 * @return type of object
 */
function getType(obj) {
	return !!typeifier ? typeifier.compile(obj) : typeof obj;
}

var /**
	 * Variables
	 * --
	 */

	/**
	 * General Globals
	 */
	author = 'swe',
	version = '1.0.0',
	
	/**
	 * Global Shortcuts
	 */
	doc = document,
	
	/**
	 * Static Functions
	 * --
	 */
	
	/**
	 *	Listener
	 */
	Listener = new Class({
		create : function(value,key,setFN,getFN){
			extend(this,{
				value : value,
				ref : key,
				setFN : setFN,
				getFN : getFN
			});
		},
		set : function(v){
			!!this.setFN && this.setFN.call(this,this.ref,v);
			
			this.value = v;
		},
		get : function(){
			!!this.getFN && this.getFN.call(this,this.ref,this.value);
			
			return this.value;
		}
	}),
	
	ListenToMSIEObject = function(prop,setFN,getFN){
		var self = this;
		
		if (self.tagName != '__tracker__'){
			var root = doc.getElementsByTagName('body');
			
			self = doc.createElement('__tracker__');
			!!root[0] && root[0].appendChild(self);
			
			extend(self,this,{
				__src__ : this,
				__stacked__ : {},
				__changefn__ : function(){
					var prop = event.propertyName || false;
					
					if (prop && self.__stacked__[prop]){
						self.detachEvent('onpropertychange',self.__changefn__);
						self.__stacked__[prop].set(self[prop]);
						
						var fn = function(){								
							return self.__stacked__[prop].get();
						};
						
						self[prop] = fn;
						self[prop].toString = fn;

						self.attachEvent('onpropertychange',self.__changefn__);
					}
				}
			});
		} else {
			self.detachEvent('onpropertychange',self.__changefn__);
		}

		self.__stacked__[prop] = new Listener(self[prop],prop,setFN,getFN);
		self.attachEvent('onpropertychange',self.__changefn__);

		return self;
	},
	
	ListenToObject = (function(){
		if (Object.__defineSetter__){
			return function(prop,setFN,getFN){
				var listener = new Listener(this[prop],prop,setFN,getFN);
				
				this.__defineGetter__(prop,function(){return listener.get();});
				this.__defineSetter__(prop,function(v){listener.set(v);});
				
				return this;
			};
		} else if (Object.defineProperty && (!browser.MSIE || parseInt(browser.version) > 8)){
			return function(prop,setFN,getFN){
				var listener = new Listener(self[prop],prop,setFN,getFN);
					
				Object.defineProperty(this,prop,{
					get : function(){return listener.get();},
					set : function(v){listener.set(v);}
				});
				
				return this;
			};
		}
		
		return ListenToMSIEObject;
	})();
	
extend(global,{
	listen : function(){
		var args = toArray(arguments),
			object = args.shift();
			
		return ListenToObject.apply(object,args);
	}
});
})(window || this);