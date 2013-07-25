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
