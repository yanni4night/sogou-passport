/**
 * Copyright (C) 2014 yanni4night.com
 *
 * Gruntfile.js
 *
 * changelog
 * 2014-05-24[20:41:37]:authorized
 * 2014-05-25[11:31:17]:clean
 * 2014-06-11[21:10:44]:skin images
 * 2014-06-13[14:18:04]:reorder
 *
 * @author yanni4night@gmail.com
 * @version 0.1.3
 * @since 0.1.0
 */

module.exports = function(grunt) {

    "use strict";
    var STATIC_DIR = 'src/';
    var WEB_DIR = 'web/';
    var CDN_DIR = 'dist/';

    var pkg = grunt.file.readJSON('package.json');

    var TARGET_DIR = WEB_DIR + CDN_DIR + pkg.version;

    grunt.initConfig({
        jshint: {
            lib: {
                src: STATIC_DIR + 'js/*.js',
            }
        },
        uglify: {
            options: {
                sourceMap: false
            },
            libjs: {
                files: [{
                    expand: true,
                    cwd: TARGET_DIR,
                    src: ['**/passport-*.js'],
                    dest: TARGET_DIR
                }]
            },
            skin: {
                files: [{
                    expand: true,
                    cwd: STATIC_DIR,
                    src: ['skin/js/*.js'],
                    dest: TARGET_DIR
                }]
            },
            plugins:{
                files:[{
                    expand:true,
                    cwd:STATIC_DIR+"js",
                    src:["plugins/*.js"],
                    dest:TARGET_DIR
                }]
            }
        },
        less: {
            options: {
                strictMath: true,
                cleancss: true
            },
            css: {
                files: [{
                    expand: true,
                    cwd: STATIC_DIR,
                    src: ['css/*.{css,less}'],
                    ext: '.css',
                    dest: WEB_DIR
                }]
            },
            skin: {
                files: [{
                    expand: true,
                    cwd: STATIC_DIR,
                    src: ['skin/**/*.{css,less}'],
                    ext: '.css',
                    dest: TARGET_DIR
                }]
            }
        },
        copy: {
            html: {
                files: [{
                    expand: true,
                    cwd: 'template/',
                    src: ['*.html'],
                    dest: WEB_DIR
                }]
            },
            ico: {
                files: [{
                    expand: true,
                    cwd: STATIC_DIR,
                    src: ['**/*.{ico}'],
                    dest: WEB_DIR
                }]
            }
        },
        imagemin: {
            options: {
                optimizationLevel: 7
            },
            static: {
                files: [{
                    expand: true,
                    cwd: STATIC_DIR,
                    src: ['img/*.{jpg,png,gif}'],
                    dest: WEB_DIR
                }]
            },
            skin: {
                files: [{
                    expand: true,
                    cwd: STATIC_DIR,
                    src: 'skin/**/*.{jpg,png,gif}',
                    dest: TARGET_DIR
                }]
            }
        },
        watch: {
            libjs: {
                files: [STATIC_DIR + 'js/**/*.js'],
                tasks: ['libjs-test']
            },
            css: {
                files: [STATIC_DIR + 'css/**/*.{css,less}'],
                tasks: ['less:css']
            },
            html: {
                files: ['template/**/*.html'],
                tasks: ['official']
            },
            img: {
                files: [STATIC_DIR + 'img/**/*.{png,jpg,gif,ico}'],
                tasks: ['official']
            },
            skin: {
                files: [STATIC_DIR + "skin/**/*"],
                tasks: ['skin']
            }
        },
        clean: {
            options: {
                force: true
            },
            built: [WEB_DIR + "*", "**/._*", "**/.DS_Store"]
        },
        express: {
            test: {
                options: {
                    script: 'app.js',
                    background: false,
                    port: 3775,
                    node_env: 'development',
                    debug: true
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        browserify: {
/*            plugins: {
                src: [STATIC_DIR + 'js/*.js', STATIC_DIR + 'js/plugins/*.js'],
                dest: TARGET_DIR + '/js/passport-draw.js'
            },*/
            core: {
                src: [STATIC_DIR + 'js/*.js'],
                dest: TARGET_DIR + '/js/passport-core.js'
            },
            test: {
                src: [STATIC_DIR + 'js/*.js', STATIC_DIR + 'js/test/*.js'],
                dest: TARGET_DIR + '/js/passport-test.js'
            }
        },
        vars: {
            dist: {
                options: {
                    debug: false
                },
                src: [TARGET_DIR + '/js/*.js']
            },
            test: {
                options: {
                    debug: true
                },
                src: [TARGET_DIR + '/js/*.js']
            },
            html: {
                options: {
                    debug: true
                },
                src: [WEB_DIR + '/*.html']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerMultiTask('vars', 'replace vars', function() {
        var options = this.options({});
        this.files.forEach(function(f) {
            f.src.forEach(function(src) {
                var content = grunt.file.read(src);
                content = content.replace(/@version@/img, pkg.version).replace(/@debug@/img, +!!options.debug);
                grunt.file.write(src, content);
                grunt.log.ok(src);
            });
        });
    });

    grunt.registerTask('skin', ['uglify:skin', 'imagemin:skin', 'less:skin']);
    grunt.registerTask('libjs-dist', ['jshint', 'browserify', 'vars:dist', 'uglify:libjs','uglify:plugins']);
    grunt.registerTask('libjs-test', ['jshint', 'browserify', 'vars:test', 'uglify:libjs','uglify:plugins']);
    grunt.registerTask('official', ['copy', 'vars:html', 'imagemin:static']);


    grunt.registerTask('test', ['clean', 'skin', 'libjs-test', 'official']);
    grunt.registerTask('dist', ['clean', 'skin', 'libjs-dist', 'official']);
    grunt.registerTask('default', ['test']);
    grunt.registerTask('server', ['express']);
};