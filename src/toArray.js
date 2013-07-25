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
	
