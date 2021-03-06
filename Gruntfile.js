/*
 * Gruntfile Game of Life
 */

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      compile: {
        options: {
          baseUrl: './',
          mainConfigFile: 'src/main.js',
          name: 'src/main.js',
          out: 'dist/<%= pkg.name %>.min.js',
          useStrict: true,
          optimize: 'none',
        }
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': [
            '<%= requirejs.compile.options.out %>'
          ]
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    less: {
      development: {
        files: {
          'dist/main.css': 'html/main.less'
        }
      },
      production: {
        options: {
          cleancss: true
        },
        files: {
          'dist/main.css': 'dist/main.css'
        }
      }
    },
    copy: {
      main: {
        files: [{
          cwd: 'html/',
          src: '*.html',
          dest: 'dist/',
          expand: true,
          filter: 'isFile'
        }, {
          src: 'node_modules/requirejs/require.js',
          dest: 'dist/require.js'
        }]
      }
    },
    watch: {
      scripts: {
        files: ['src/*.js'],
        tasks: ['requirejs'],
        options: {
          spawn: false,
        },
      },
      less: {
        files: ['html/*.less'],
        tasks: ['less'],
        options: {
          spawn: false,
        },
      },
      html: {
        files: ['html/**'],
        tasks: ['copy'],
        options: {
          spawn: false,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', ['jshint', 'requirejs', 'less', 'copy']);
  grunt.registerTask('release', ['default', 'uglify']);
};
