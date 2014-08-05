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
    whitespace: whitespace,
    trim: function(str) {
        if (String.prototype.trim) {
            return String.prototype.trim.call(String(str));
        } else {
            return String(str).replace(rtrim, '');
        }
    },
    /**
     *
     *
     *
     * @param  {String} source
     * @param  {String} pattern
     * @return {Boolean}
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
     *
     *
     * @param  {String} source
     * @param  {String} pattern
     * @return {Boolean}
     */
    startsWithIgnoreCase: function(source, pattern) {
        type.assertString('source', source);
        type.assertString('pattern', pattern);

        return this.startsWith(source.toLowerCase(), pattern.toLowerCase());
    },
    /**
     *
     *
     * @param  {String} source
     * @param  {String} pattern
     * @return {Boolean}
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
     *
     * @param  {String} source
     * @param  {String} pattern
     * @return {Boolean}
     */
    endsWithIgnoreCase: function(source, pattern) {
        type.assertString('source', source);
        type.assertString('pattern', pattern);

        return this.endsWith(source.toLowerCase(), pattern.toLowerCase());
    },
    /**
     *
     * @param  {String} str1
     * @param  {String} str2
     * @return {boolean}
     */
    equalsIgnoreCase: function(str1, str2) {
        type.assertString('str1', str1);
        type.assertString('str2', str2);
        return str1.toLowerCase() === str2.toLowerCase();
    }
};