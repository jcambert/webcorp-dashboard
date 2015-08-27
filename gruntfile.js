'use strict';

module.exports = function(grunt) {
		
	grunt.initConfig({
	 	pkg: grunt.file.readJSON('package.json'),
	    'http-server': {
	 
	        'dev': {
	 
	            // the server root directory 
	            root: '',
	 
	            // the server port 
	            // can also be written as a function, e.g. 
	            // port: function() { return 8282; } 
	            port: 8282,
	 
	            // the host ip address 
	            // If specified to, for example, "127.0.0.1" the server will 
	            // only be available on that ip. 
	            // Specify "0.0.0.0" to be available everywhere 
	            host: "0.0.0.0",
	 
	            cache: 0,
	            showDir : true,
	            autoIndex: true,
	 
	            // server default file extension 
	            ext: "html",
	 
	            // run in parallel with other tasks 
	            runInBackground: false,
	 
	            // specify a logger function. By default the requests are 
	            // sent to stdout. 
	            logFn: function(req, res, error) { },
	 
	            /// Use 'https: true' for default module SSL configuration 
	            /// (default state is disabled) 
	            //https: {
	            //    cert: "cert.pem",
	            //    key : "key.pem"
	            //}
	 
	        }
	 
	    }
	});
	 // Load NPM tasks
//	require('load-grunt-tasks')(grunt);
	
	// Making grunt default to force in order not to break the project.
//	grunt.option('force', true);
	

	
	// Default task(s).
	grunt.loadNpmTasks('grunt-http-server');
	grunt.registerTask('default','http-server:dev');
}