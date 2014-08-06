/**
 * Copyright (C) 2014 yanni4night.com
 * lone.js
 *
 * changelog
 * 2014-08-06[10:57:58]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
"use strict";

var type = require('./type');
var array = require('./array');

var hasOwn = ({}).hasOwnProperty;

module.exports = {

    /**
     * Merge object members.
     *
     * @param  {Object} dest
     * @param  {Object} srcs
     * @return {Object} Dest
     */
    mixin: function(dest, srcs) {

        type.assertNonNullOrUndefined('dest', dest);

        srcs = Array.prototype.slice.call(arguments, 1);
        array.forEach(srcs, function(src) {
            for (var e in src) {
                if (hasOwn.call(src, e)) {
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
    },
    /**
     * Get Unix timestamp of now.
     * @return {Integer} Unix timestamp
     */
    now: function() {
        return Date.now ? Date.now() : +new Date();
    }

};