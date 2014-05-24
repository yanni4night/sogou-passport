/**
  * Copyright (C) 2014 yanni4night.com
  *
  * Gruntfile.js
  *
  * changelog
  * 2014-04-15[21:21:21]:authorized
  * 2014-05-04[10:58:33]:clean
  *
  * @info yinyong,osx-x64,UTF-8,10.129.164.4,js,/Users/yinyong/work/jsonData/clo
  * @author yanni4night@gmail.com
  * @version 0.1.1
  * @since 0.1.0
  */
var fs = require('fs');

module.exports = function(grunt) {

    "use strict";
    var STATIC_DIR = 'static/';
    var BUILD_DIR = 'build/';

    var jsonData = grunt.file.readJSON('_data/index.json');

    grunt.initConfig({
        jshint: {
            check: {
                src: STATIC_DIR + 'js/**/*.js',
            }
        },
        uglify: {
            compress: {
                files: [{
                    expand: true,
                    cwd: STATIC_DIR,
                    src: ['**/*.js'],
                    dest: BUILD_DIR + STATIC_DIR
                }]
            }
        },
        less: {
            development: {
                options: {
                    cleancss: true
                },
                files: [{
                    expand: true,
                    cwd: STATIC_DIR,
                    src: ['**/*.less'],
                    ext: '.css',
                    dest: BUILD_DIR + STATIC_DIR
                }]
            }
        },
        cssmin: {
            merge: {
                files: [{
                    expand: true,
                    cwd: BUILD_DIR,
                    src: ['**/*.css'],
                    dest: BUILD_DIR
                }]
            }
        },
        twig_render: {
            render: {
                files: [{
                    template: 'template/index.html',
                    data: '_data/index.json',
                    dest: BUILD_DIR+'index.html'
                }]
            }
        },
        'regex-replace': {
            stamp: {
                src: [BUILD_DIR + '**/*.html'],
                actions: [{
                    name: '@',
                    search: /@([\w\-]+?)@/mg,
                    replace: function(n) {
                        return jsonData[RegExp.$1] || ''
                    }
                }]
            }

        },
        copy: {},
        imagemin: {
            images: {
                files: [{
                    expand: true,
                    cwd: STATIC_DIR,
                    src: '**/*.{gif,png,jpg}',
                    dest: BUILD_DIR + STATIC_DIR
                }]
            }
        },
        watch: {
            build: {
                files: ['static/js/**/*.js', 'static/css/**/*.less', 'template/**/*.html', '_data/**/*.json'],
                tasks: ['default']
            }
        },
        clean: {
            options: {
                force: true
            },
            built: [BUILD_DIR + "*", "**/._*", "**/.DS_Store"]
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            html: {
                files: [{
                    expand: true,
                    cwd: BUILD_DIR,
                    src: '**/*.html',
                    ext: '.html',
                    dest: BUILD_DIR
                }]
            }
        },
        stamp: {
            options: {
                baseDir: BUILD_DIR,
            },
            index: {
                files: [{
                    expand: true,
                    cwd: BUILD_DIR,
                    src: ['**/*.{html,css}'],
                    dest: BUILD_DIR
                }]
            }
        },
        shell: {
            options: {
                stdout: true
            },
            upload: {
                command: 'sshpass -p "xxx" scp index.html root@ip:/search/path'
            }
        },
        express: {
            test: {
                options: {
                    script: 'app.js',
                    background: false,
                    port: 3008,
                    node_env: 'development',
                    debug: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-twig-render');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-regex-replace');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-web-stamp');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-shell');


    grunt.registerTask('default', []);
    grunt.registerTask('server',['express']);
};