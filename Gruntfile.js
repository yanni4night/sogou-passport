/**
 * Copyright (C) 2014 yanni4night.com
 *
 * Gruntfile.js
 *
 * changelog
 * 2014-05-24[20:41:37]:authorized
 * 2014-05-25[11:31:17]:clean
 *
 * @info yinyong,osx-x64,UTF-8,192.168.1.101,js,/Volumes/yinyong/sogou-passport-fe
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */

module.exports = function(grunt) {

    "use strict";
    var STATIC_DIR = 'src/';
    var WEB_DIR = 'web/';

    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        jshint: {
            check: {
                src: STATIC_DIR + 'js/**/*.js',
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
                    cwd: WEB_DIR,
                    src: ['**/*.js'],
                    dest: WEB_DIR
                }]
            }
        },
        less: {
            development: {
                options: {
                    strictMath: true,
                    cleancss: true
                },
                files: [{
                    expand: true,
                    cwd: STATIC_DIR,
                    src: ['**/*.{css,less}'],
                    ext: '.css',
                    dest: WEB_DIR
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
            img: {
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
                    src: ['**/*.{jpg,png,gif}'],
                    dest: WEB_DIR
                }]
            }
        },
        watch: {
            js: {
                files: [STATIC_DIR + '**/*.js'],
                tasks: ['jshint', 'browserify','version']
            },
            css: {
                files: [STATIC_DIR + '**/*.{css,less}'],
                tasks: ['less']
            },
            html: {
                files: ['template/**/*.html'],
                tasks: ['copy:html']
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
        browserify: {
            dialog: {
                src: [STATIC_DIR + 'js/**/*.js'],
                dest: WEB_DIR + '/dist/passport-dialog.js'
            },
            core:{
                src: [STATIC_DIR + 'js/*.js'],
                dest: WEB_DIR + '/dist/passport-core.js'
            }
        },
        version:{
            sogou:[WEB_DIR+'dist/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerMultiTask('version','set version',function(){
        this.files.forEach(function(f){
            f.src.forEach(function(src){
                var content = grunt.file.read(src);
                content = content.replace('@version@',pkg.version);
                grunt.file.write(src,content);
            });
        });
    });

    grunt.registerTask('default', ['clean', 'jshint', 'browserify', 'uglify', 'version','less', 'copy', 'imagemin']);
    grunt.registerTask('server', ['express']);
};