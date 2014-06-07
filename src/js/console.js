/**
 * Copyright (C) 2014 yanni4night.com
 *
 * console.js
 *
 * Polyfill for console.
 *
 * changelog
 * 2014-06-06[11:43:57]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function(window, undefined) {
    "use strict";

    var type = require('./type');
    var console = window.console;

    if (!console || type.strobject !== typeof console) {
        console = {};
    }

    var keys = 'trace,info,log,debug,warn,error'.split(',');

    for (var i = keys.length - 1; i >= 0; i--) {
        console[keys[i]] = console[keys[i]] || type.noop;
    }

    module.exports = console;
})(window);