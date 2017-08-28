module.exports = (grunt) =>
    grunt.initConfig
        pkg: grunt.file.readJSON('package.json')
        jade:
            compile:
                options:
                    pretty: true
                files: [
                    expand: true
                    cwd: 'jade'
                    src: ['*.jade']
                    dest: 'public/'
                    ext: '.html'
                ]
        compass:
            dist:
                options:
	                  config: "config.rb"
        coffee:
            compile:
                options:
                    bare: true
                files: [
                    expand: true
                    cwd: 'coffee'
                    src: ['**/*.coffee']
                    dest: 'public/js/'
                    ext: '.js'
                ]
        bower:
            install:
                options:
                    targetDir: 'public/lib'
                    layout: 'byType'
                    install: true
                    cleanTargetDir: true
                    cleanBowerDir: false
        shell:
            start:
                 command: 'node server.js'
              
	    esteWatch:
	        options:
	            dirs: [
	                "coffee/**"
	                "jade/**"
	                "sass/**"
	            ]
	            livereload:
	                enabled: true
	                extensions: ['js', 'html', 'css']
	                port: 35729
	        "coffee": (path) ->
	            ['newer:coffee']
           
	        "jade": (path) ->
	            ['newer:jade']
	        "sass": (path) ->
	            ['newer:compass']


    grunt.loadNpmTasks 'grunt-contrib-jade'
    grunt.loadNpmTasks 'grunt-contrib-compass'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-bower-task'
   # grunt.loadNpmTasks 'grunt-contrib-connect'
    grunt.loadNpmTasks 'grunt-shell'
	# grunt.loadNpmTasks 'grunt-este-watch'
    grunt.loadNpmTasks 'grunt-newer'
    grunt.registerTask 'make', ['bower', 'newer:coffee', 'newer:jade', 'compass']
   #  grunt.registerTask 'default', ['make', 'connect', 'esteWatch']
    grunt.registerTask 'default', ['make', 'shell:start'] #, 'esteWatch']
