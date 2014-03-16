module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-connect'

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
