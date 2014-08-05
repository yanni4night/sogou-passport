/**
 * Copyright (C) 2014 yanni4night.com
 *
 * utils.js
 *
 * changelog
 * 2014-05-24[23:06:31]:authorized
 * 2014-06-06[09:23:53]:getIEVersion
 * 2014-06-07[15:30:38]:clean by split in 'math','dom' etc
 * 2014-06-07[16:39:34]:remove 'dom' module
 * 2014-06-09[11:05:06]:define 'hideSource' function
 * 2014-06-12[09:23:30]:remove 'trim'
 * 2014-06-13[09:48:40]:as freeze does not throw errors,we removed it
 * 2014-06-13[10:27:27]:redesigned 'mixin' to support multiple sources;defined 'extend' as an alias of 'mixin'
 * 2014-06-14[12:16:03]:event included
 * 2014-06-14[21:43:05]:async included
 *
 * @author yanni4night@gmail.com
 * @version 0.1.9
 * @since 0.1.0
 */

"use strict";

var array = require('./array');
var math = require('./math');
var type = require('./type');
var dom = require('./dom');
var string = require('./string');
var xevent = require('./event');
var async = require('./async');
var console = require('./console');

var utils = {
    math: math,
    array: array,
    dom: dom,
    type: type,
    string: string,
    event: xevent,
    async: async,
    console: console,
    /**
     * Merge object members.
     *
     * @param  {Object} dest
     * @param  {Object} srcs
     * @return {Object}      Dest
     */
    mixin: function(dest, srcs) {

        type.assertNonNullOrUndefined('dest', dest);

        srcs = Array.prototype.slice.call(arguments, 1);
        array.forEach(srcs, function(src) {
            for (var e in src) {
                if (src.hasOwnProperty && src.hasOwnProperty(e)) {
                    dest[e] = src[e];
                }
            }
        });

        return dest;
    },
    /**
     * Alias for mixin.
     *
     * @return {Object}
     */
    extend: function() {
        return this.mixin.apply(this, arguments);
    },
    /**
     * Get version of Internet Explorer by user agent.
     * IE 11 supported.
     *
     * @return {Integer} Version in integer.
     */
    getIEVersion: function() {
        var ua = navigator.userAgent,
            matches, tridentMap = {
                '4': 8,
                '5': 9,
                '6': 10,
                '7': 11
            };

        matches = ua.match(/MSIE (\d+)/i);

        if (matches && matches[1]) {
            //find by msie
            return +matches[1];
        }

        matches = ua.match(/Trident\/(\d+)/i);
        if (matches && matches[1]) {
            //find by trident
            return tridentMap[matches[1]] || null;
        }

        //we did what we could
        return null;
    },
    /**
     * Hide source of a function by defining toString.
     *
     * @param  {String} name Function name
     * @param  {Function} func Function to be hide-sourced
     * @param  {String} prefix
     * @return {Function}      'toString' function
     */
    hideSource: function(name, func, prefix) {
        type.assertNonEmptyString('name', name);
        type.assertFunction('func', func);

        if (prefix) {
            type.assertNonEmptyString(prefix);
        } else {
            prefix = 'PassportSC.';
        }

        var source = String(func);

        func.toString = (function(name, source) {
            return function() {
                //function(a,b,c){var s=....} => function(a,b,c)
                return prefix + name + source.match(/\([^\{\(]+(?=\{)/)[0];
            };
        })(name, source);

        return func.toString;
    }
};

module.exports = utils;