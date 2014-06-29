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
          // include: ['node_modules/underscore/underscore.js'],
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
        options: {
          paths: ["bower_components/bootstrap/less"]
        },
        files: {
          "dist/main.css": "src/main.less"
        }
      },
      production: {
        options: {
          cleancss: true
        },
        files: {
          "dist/main.css": "dist/main.css"
        }
      }
    },
    copy: {
      main: {
        files: [{
          cwd: 'html/',
          src: '**',
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
        files: ['src/*.less'],
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
    // qunit: {
    //   files: ['test/**/*.html']
    // },
    // watch: {
    //   files: ['<%= jshint.files %>'],
    //   tasks: ['jshint', 'qunit']
    // }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  // grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask('default', ['jshint', 'requirejs', 'uglify', 'less',
    'copy'
  ]);
  // grunt.registerTask('test', ['jshint', 'qunit']);
};
