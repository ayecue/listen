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
