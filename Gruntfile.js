module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*!\n' +
        ' * <%= pkg.title || pkg.name %> v<%= pkg.version %>\n' +
        '<% if (pkg.homepage) { %> * <%= pkg.homepage %>\n<% } %>' +
        ' *\n' +
        ' * Copyright <%= grunt.template.today("yyyy") %>, <%= pkg.author.name %>\n' +
        ' * This content is released under the' +
        ' <%= _.pluck(pkg.licenses, "type").join(", ") %> license<%= pkg.licenses.length === 1 ? "" : "s" %>\n' +
        ' * <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
        ' */\n\n',
      microbanner: '/*! <%= pkg.title || pkg.name %> v<%= pkg.version %> ' +
        '© <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>, ' +
        'Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'
    },
    clean: {
      files: ['dist']
    },
    uglify: {
      options: {
        banner: '<%= meta.microbanner %>'
      },
      'dist/<%= pkg.name %>.min.js': ['src/**/*.js']
    },
    jasmine: {
      src: ['src/**/*.js'],
      options: {
        specs: 'tests/**/test_*.js'
      }
    },
    jshint: {
      src: ['Gruntfile.js', 'src/**/*.js', 'tests/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['clean', 'jshint', 'jasmine', 'uglify']);
  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('build', ['clean', 'uglify']);
};
