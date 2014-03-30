module.exports = (grunt) ->
  grunt.util.linefeed = '\n'

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
    facelist:
      src: ['img/icon/*']
      dest: 'face_list.json'

  grunt.registerTask 'facelist', 'generate face-list.json', () ->
    path = require 'path'
    grunt.log.writeln 'Generating face-list.json.'
    grunt.config.requires 'facelist.src'
    grunt.config.requires 'facelist.dest'
    face_list = {}
    for charname in grunt.file.expand grunt.config('facelist.src')
      icons = []
      for fname in grunt.file.expand "#{charname}/*.png"
        icons.push path.basename(fname)
      face_list[path.basename(charname)] = icons
    grunt.file.write grunt.config('facelist.dest'), JSON.stringify(face_list)
  grunt.registerTask 'server', 'connect'
  grunt.registerTask 'build', ['facelist', 'concat', 'stylus']
