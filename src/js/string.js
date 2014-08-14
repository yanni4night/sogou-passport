/**
 * Copyright (C) 2014 yanni4night.com
 *
 * string.js
 *
 * changelog
 * 2014-06-12[09:18:30]:authorized
 * 2014-06-13[09:54:34]:add 'equalsIgnoreCase'
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */

"use strict";

var type = require('./type');

//https://github.com/jquery/sizzle/blob/96728dd43c62dd5e94452f18564a888e7115f936/src/sizzle.js#L102
var whitespace = "[\\x20\\t\\r\\n\\f]";
var rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g");

module.exports = {
    /**
     * Whitespace matching pattern.
     * 
     * @type {RexExp}
     * @class String
     * @since 0.0.8
     */
    whitespace: whitespace,
    /**
     * Trim a string.
     * 
     * @param  {String} str
     * @return {String}
     * @class String
     * @since 0.0.8
     */
    trim: function(str) {
        if (String.prototype.trim) {
            return String.prototype.trim.call(String(str));
        } else {
            return String(str).replace(rtrim, '');
        }
    },
    /**
     * Detect if a string starts with another string.
     *
     * @param  {String} source
     * @param  {String} pattern
     * @return {Boolean}
     * @class String
     * @since 0.0.8
     */
    startsWith: function(source, pattern) {
        type.assertString('source', source);
        type.assertString('pattern', pattern);

        if (pattern.length > source.length) {
            return false;
        }
        var t = pattern.length;
        while (--t >= 0) {
            if (source.charAt(t) !== pattern.charAt(t)) {
                return false;
            }
        }
        return true;
    },
    /**
     * like 'starsWith',but case ignored.
     *
     * @param  {String} source
     * @param  {String} pattern
     * @return {Boolean}
     * @class String
     * @since 0.0.8
     */
    startsWithIgnoreCase: function(source, pattern) {
        type.assertString('source', source);
        type.assertString('pattern', pattern);

        return this.startsWith(source.toLowerCase(), pattern.toLowerCase());
    },
    /**
     * Detect if a string ends with another string.
     *
     * @param  {String} source
     * @param  {String} pattern
     * @return {Boolean}
     * @class String
     * @since 0.0.8
     */
    endsWith: function(source, pattern) {
        type.assertString('source', source);
        type.assertString('pattern', pattern);
        var t = pattern.length;
        var diff = source.length - t;
        if (diff < 0) {
            return false;
        }

        while (--t >= 0) {
            if (source.charAt(diff + t) !== pattern.charAt(t)) {
                return false;
            }
        }

        return true;
    },
    /**
     * Like 'endsWith',but case ignored.
     * 
     * @param  {String} source
     * @param  {String} pattern
     * @return {Boolean}
     * @class String
     * @since 0.0.8
     */
    endsWithIgnoreCase: function(source, pattern) {
        type.assertString('source', source);
        type.assertString('pattern', pattern);

        return this.endsWith(source.toLowerCase(), pattern.toLowerCase());
    },
    /**
     * Detect if two strings equal with each other case ignored.
     *
     * @param  {String} str1
     * @param  {String} str2
     * @return {boolean}
     * @class String
     * @since 0.0.8
     */
    equalsIgnoreCase: function(str1, str2) {
        type.assertString('str1', str1);
        type.assertString('str2', str2);
        return str1.toLowerCase() === str2.toLowerCase();
    }
};