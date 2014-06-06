/**
 * Copyright (C) 2014 yanni4night.com
 *
 * console.js
 *
 * changelog
 * 2014-06-06[11:43:57]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
var console = window.console;
var noop = function() {};

if (!console || 'object' !== typeof console) {
    console = {};
}

var keys = 'trace,info,log,debug,warn,error'.split(',');

for (var i = keys.length - 1; i >= 0; i--) {
    console[keys[i]] = console[keys[i]] || noop;
}

module.exports = console;