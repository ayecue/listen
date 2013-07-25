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
