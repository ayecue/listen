listen
======

Track object property changes. All Internet Explorer > 5 will work with this.


Here an example:

    //Demo object
    var testing = {
      	test : 'woot',
    		another : 'aye'
    	};
    
      //Setup the object you want to listen.
    	testing = listen(testing,'test',function(key,value){
    		console.log('set');
    		console.log(key);
    		console.log(value);
    	},function(key,value){
    		console.log('get');
    		console.log(key);
    		console.log(value);
    	});
    
      //Will output:
      // "set"
      // "test"
      // "null"
    	testing.test = 'null';
      
      //Will output:
      // "get"
      // "test"
      // "null"
      var test = testing.test;
