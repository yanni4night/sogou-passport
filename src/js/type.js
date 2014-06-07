/**
 * Copyright (C) 2014 yanni4night.com
 *
 * type.js
 *
 * changelog
 * 2014-06-07[15:50:11]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
(function() {
    "use strict";

    var noop = function() {};

    var type = {
        noop: noop,
        strundefined: typeof undefined,
        strstr: typeof '',
        strobject: typeof {},
        strnumber: typeof 0,
        strfunction: typeof noop,
        isNullOrUndefined: function(obj) {
            return undefined === obj || null === obj;
        },
        isInteger: function(num) {
            return this.strnumber === typeof num && /^(\-|\+)?\d+?$/i.test(num);
        }
    };

    var typeKeys = "Arguments,RegExp,Date,String,Array,Boolean,Function,Number".split(',');
    var key;
    var createIs = function(type) {
        return function(variable) {
            return '[object ' + type + ']' === ({}).toString.apply(variable);
        };
    };

    for (var i = typeKeys.length - 1; i >= 0; --i) {
        key = 'is' + typeKeys[i];
        type[key] = createIs(typeKeys[i]);
    }

    module.exports = type;
})();