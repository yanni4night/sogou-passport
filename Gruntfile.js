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
 * 2014-08-05[18:09:12]:options jshint
 *
 * @author yanni4night@gmail.com
 * @version 0.1.4
 * @since 0.1.0
 */

var markdown = require('markdown').markdown;

module.exports = function(grunt) {

    "use strict";
    var STATIC_DIR = 'src/';
    var WEB_DIR = 'web/';
    var CDN_DIR = 'dist/';

    var mdHTML = markdown.toHTML(grunt.file.read('./README.md'));

    var pkg = grunt.file.readJSON('package.json');
    var now = new Date();
    var builtVersion = pkg.version + "." + String(now.getFullYear()).slice(-2) + w(1 + now.getMonth()) + w(now.getDate());

    function w(d) {
        return d < 10 ? ('0' + d) : d;
    }

    var TARGET_DIR = WEB_DIR + CDN_DIR + builtVersion;

    grunt.initConfig({
        jshint: {
            options: {
                strict: true, //use strict
                node: true, //module,require,console
                browser: true, //window,document,navigator
                nonstandard: true //escape,unescape
            },
            lib: {
                src: [STATIC_DIR + 'js/*.js',STATIC_DIR + 'js/appendix/*.js',STATIC_DIR + 'js/plugin/*.js'],
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
            plugins: {
                files: [{
                    expand: true,
                    cwd: TARGET_DIR,
                    src: ['js/plugin/*.js'],
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
                files: [STATIC_DIR + 'js/*.js',STATIC_DIR + 'js/{appendix,test}/*.js'],
                tasks: ['libjs-test']
            },
            plugins:{
                files:[STATIC_DIR + 'js/plugin/*.js'],
                tasks:['browserify:plugins']
            },
            css: {
                files: [STATIC_DIR + 'css/**/*.{css,less}'],
                tasks: ['less:css']
            },
            html: {
                files: ['template/**/*.html','*.md'],
                tasks: ['copy', 'vars:html']
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
            plugins: {
                expand:true,
                cwd:STATIC_DIR,
                src: [  'js/plugin/*.js'],
                dest: TARGET_DIR 
            },
            core: {
                src: [STATIC_DIR + 'js/core.js'],
                dest: TARGET_DIR + '/js/passport-core.js'
            },
            test: {
                src: [/*STATIC_DIR + 'js/*.js', STATIC_DIR + 'js/appendix/*.js',*/ STATIC_DIR + 'js/test/*.js'],
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

    grunt.task.registerTask('inline markdown', 'Merge README to index.html', function(arg1, arg2) {

    });

    grunt.registerMultiTask('vars', 'replace vars', function() {
        var options = this.options({});

        this.files.forEach(function(f) {
            f.src.forEach(function(src) {
                var content = grunt.file.read(src);
                content = content.replace(/@version@/img, builtVersion).replace(/@debug@/img, +!!options.debug).replace(/@readme@/img, mdHTML);
                grunt.file.write(src, content);
                grunt.log.ok(src);
            });
        });
    });

    grunt.registerTask('skin', ['uglify:skin', 'imagemin:skin', 'less:skin']);
    grunt.registerTask('libjs-dist', ['jshint', 'browserify', 'vars:dist', 'uglify:libjs']);
    grunt.registerTask('libjs-test', ['jshint', 'browserify', 'vars:test' /*, 'uglify:libjs'*/ ]);
    grunt.registerTask('official', ['copy', 'vars:html', 'imagemin:static', 'less:css']);


    grunt.registerTask('test', ['clean', 'skin', 'libjs-test', 'official']);
    grunt.registerTask('dist', ['clean', 'skin', 'libjs-dist', 'official']);
    grunt.registerTask('default', ['test']);
    grunt.registerTask('pub', ['dist']);
    grunt.registerTask('server', ['express']);
};