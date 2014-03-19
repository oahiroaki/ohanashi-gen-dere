module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.initConfig
    concat:
      dist:
        src: [
          'src/main.js'
          'src/model/*.js'
          'src/filter/*.js'
          'src/directive/*.js'
          'src/controller/*.js'
        ]
        dest: 'index.js'
    connect:
      server:
        options:
          keepalive: true
    stylus:
      complie:
        files:
          'css/index.css': 'stylus/index.stylus'
    watch:
      src:
        files: 'src/**/*.js'
        tasks: ['concat']
      css:
        files: 'stylus/*.stylus'
        tasks: ['stylus']

  grunt.registerTask 'server', 'connect'
  grunt.registerTask 'build', ['concat', 'stylus']
