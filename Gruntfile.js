module.exports = function(grunt) { 

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {separator: ";"},
      dist: {
        src: ['public/client/**/*.js'],
        dest: 'public/dist/<%= pkg.name %>.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      dist: {
        files: {
          'public/dist/<%= pkg.name %>.min.js': ['public/client/**/*.js']
        }
      }
    },

    eslint: {
      target: [
        // Add list of files to lint here
        './client/*.js',
        './app/*.js',
        'server.js', 'server-config.js'
      ],
      // options: {
      //   ignoreWarnings: true
      // }
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      commit: {
        command: "git commit -am 'automatic commit'"
      },
      prodServer: { ///push to server
        command: "git push live master"
      },
      MSG: {
        command: "echo pinga"
      }
    },
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('push', ['shell:commit','shell:prodServer']);

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [ 'eslint', 'test', 'concat', 'uglify']);

  grunt.registerTask('deploy', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['build', 'push']);
    } else {
      grunt.task.run([ 'build', 'server-dev' ]);
    }
  });
};
