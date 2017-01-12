module.exports = function(grunt) {

    "use strict";

    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.initConfig({

        sass: {

            dev: {
                options: {
                    style: "compressed"
                },

                files : {
                    "styles.min.css": "styles.scss"
                }
            }
        },

        autoprefixer: {
        options: {

          browsers: ['last 2 versions', 'ie 8', 'ie 9']
        },
        dist: { 
          files: {
            'styles.min.css': 'styles.min.css'
          }
        }
      },

        watch: {

          scss: {
              files: ["*.scss"],
              tasks: ["sass:dev", "autoprefixer"]
          }
        }
    });

    grunt.registerTask("run", ["watch"]);
};