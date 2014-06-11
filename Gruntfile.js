/**
 * Copyright (C) 2014 yanni4night.com
 *
 * Gruntfile.js
 *
 * changelog
 * 2014-05-24[20:41:37]:authorized
 * 2014-05-25[11:31:17]:clean
 * 2014-06-11[21:10:44]:skin images
 *
 * @info yinyong,osx-x64,UTF-8,192.168.1.101,js,/Volumes/yinyong/sogou-passport-fe
 * @author yanni4night@gmail.com
 * @version 0.1.2
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
                sourceMap: true
            },
            compress: {
                options: {
                    sourceMap: false
                },
                files: [{
                    expand: true,
                    cwd: TARGET_DIR,
                    src: ['**/*.js'],
                    dest: TARGET_DIR
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
                    src: ['css/skin/**/*.{css,less}'],
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
            skin:{
                files:[{
                    expand:true,
                    cwd:STATIC_DIR,
                    src:'css/skin/**/*.{jpg,png,gif}',
                    dest:TARGET_DIR
                }]
            }
        },
        watch: {
            js: {
                files: [STATIC_DIR + '**/*.js'],
                tasks: ['clean:js', 'jshint', 'browserify', 'vars:test']
            },
            css: {
                files: [STATIC_DIR + '**/*.{css,less}'],
                tasks: ['less']
            },
            html: {
                files: ['template/**/*.html'],
                tasks: ['copy:html', 'vars:html']
            },
            img: {
                files: [STATIC_DIR + 'img/**/*.{png,jpg,gif,ico}'],
                tasks: ['imagemin', 'copy:img']
            }
        },
        clean: {
            options: {
                force: true
            },
            built: [WEB_DIR + "*", "**/._*", "**/.DS_Store"],
            js: [WEB_DIR + '**/*.js']
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
            plugins: {
                src: [STATIC_DIR + 'js/*.js', STATIC_DIR + 'js/plugins/*.js'],
                dest: TARGET_DIR + '/js/passport-draw.js'
            },
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

    grunt.registerTask('test', ['clean', 'jshint', 'browserify', 'vars:test', 'less', 'copy', 'vars:html', 'imagemin']);
    grunt.registerTask('dist', ['clean', 'jshint', 'browserify', 'vars:dist', 'uglify', 'less', 'copy', 'vars:html', 'imagemin']);
    grunt.registerTask('default', ['test']);
    grunt.registerTask('server', ['express']);
};