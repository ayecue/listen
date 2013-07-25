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
