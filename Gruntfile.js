module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			dist: {
				src: [
					'src/browser.js',
					'src/forEach.js',
					'src/extend.js',
					'src/toArray.js',
					'src/Class.js',
					'src/Type.js',
					'src/objectListener.js'
				],
				dest: 'build/<%= pkg.name %>.js'
			}
		},
		wrap: {
			modules: {
				src: ['build/<%= pkg.name %>.js'],
				dest: '',
				wrapper: ['(function(global){','})(window || this);']
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-wrap');
	
	grunt.registerTask('default', ['concat','wrap']);
};
