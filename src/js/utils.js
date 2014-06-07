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
 *
 *
 * @author yanni4night@gmail.com
 * @version 0.1.3
 * @since 0.1.0
 */

(function(undefined) {
    "use strict";

    var array = require('./array');
    var math = require('./math');
    var type = require('./type');
    var dom = require('./dom');

    //https://github.com/jquery/sizzle/blob/96728dd43c62dd5e94452f18564a888e7115f936/src/sizzle.js#L102
    var whitespace = "[\\x20\\t\\r\\n\\f]";
    var rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g");

    var utils = {
        math: math,
        array: array,
        dom: dom,
        type: type,
        /**
         * Merge object members.
         *
         * @param  {Object} dest
         * @param  {Object} src
         * @return {Object}      Dest
         */
        mixin: function(dest, src) {
            if (!src || type.strobject !== typeof src) {
                return dest;
            }

            for (var e in src) {
                if (src.hasOwnProperty(e)) {
                    dest[e] = src[e];
                }
            }
            return dest;
        },

        /**
         * Get version of Internet Explorer by user agent.
         * IE 6~11 supported.
         *
         * @return {Integer} Version in number.
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
         * Trim a string.If a non-string passed in,
         * convert it to a string.
         *
         * @param  {Object} str Source string
         * @return {String}    Trimed string
         * @version 0.1.1
         */
        trim: function(str) {
            if (String.prototype.trim) {
                return String.prototype.trim.call(String(str));
            } else {
                return String(str).replace(rtrim, '');
            }
        },
        /**
         * Freeze an object by Object.freeze,so it does not
         * work on old browsers.
         *
         * This function is trying to remind developers to not 
         * modify something.
         * 
         * @param  {Object} obj Object to be freezed
         * @return {Object}    Source object
         */
        freeze: function(obj) {
            if (type.strundefined !== typeof Object && type.strfunction === typeof Object.freeze) {
                Object.freeze(obj);
            }

            return obj;
        }
    };

    module.exports = utils;
})();