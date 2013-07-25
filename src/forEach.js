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
