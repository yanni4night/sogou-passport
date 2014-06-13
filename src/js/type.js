/**
 * Copyright (C) 2014 yanni4night.com
 *
 * type.js
 *
 * changelog
 * 2014-06-07[15:50:11]:authorized
 * 2014-06-07[17:26:01]:asserts,customs
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */
(function() {
    "use strict";

    var noop = function() {};

    var type = {
        expando: "sogou-passport-" + (+new Date()),
        noop: noop,
        debug:+'@debug@',//This has to be replaced with 1 or 0 to indicate a boolean value
        strundefined: typeof undefined,
        strstr: typeof '',
        strobject: typeof {},
        strnumber: typeof 0,
        strfunction: typeof noop,
        isNullOrUndefined: function(obj) {
            return !!(this.isNull(obj) || this.isUndefined(obj));
        },
        isNonNullOrUndefined: function(obj) {
            return !this.isNullOrUndefined(obj);
        },
        isInteger: function(num) {
            return !!(this.isNumber(num) && /^(\-|\+)?\d+?$/i.test(num));
        },
        isNull: function(obj) {
            return null === obj;
        },
        isUndefined: function(obj) {
            return undefined === obj;
        },
        /**
         * Check if obj is a non-null and non-array object.
         *
         * @param  {Object}  obj
         * @return {Boolean}
         */
        isPlainObject: function(obj) {
            return this.isObject(obj) && !this.isNull(obj) && !this.isArray(obj) && !this.isRegExp(obj) && !this.isDate(obj);
        },
        isNonEmptyString: function(obj) {
            return !!(obj && this.isString(obj));
        },
        isHTMLElement: function(obj) {
            return !!(obj && obj.childNodes && obj.tagName && obj.appendChild);
        },
        /**
         * Check if obj is null,undefined,empty array or empty string.
         *
         * @param  {Object}  obj
         * @return {Boolean}
         */
        isEmpty: function(obj) {
            return this.isNullOrUndefined(obj) || (this.isArray(obj) && !obj.length) || '' === obj;
        },
        isObject: function(obj) {
            return type.strobject === typeof obj;
        }
    };

    var typeKeys = "RegExp,Date,String,Array,Boolean,Function,Number".split(',');

    /**
     * Create is* functions.
     * @param  {String} vari
     * @return {Function}
     */
    function createIs(vari) {
        return (function(vari) {
            return function(variable) {
                return '[object ' + vari + ']' === ({}).toString.apply(variable);
            };
        })(vari);
    }

    /**
     * Create assert function.
     * @param  {String} vari
     * @return {Function}
     */
    function createAssert(vari) {
        return (function(vari) {
            return function(name, variable) {

                if (arguments.length < 2) {
                    variable = name;
                    name = String(variable);
                }

                if (!type['is' + vari](variable)) {
                    throw new Error('"' + name + '" has to be a(n) ' + vari);
                }
            };
        })(vari);
    }

    for (var i = typeKeys.length - 1; i >= 0; --i) {
        type['is' + typeKeys[i]] = createIs(typeKeys[i]);
        type['assert' + typeKeys[i]] = createAssert(typeKeys[i]);
    }

    //create missing asserts
    var assertKeys = "Empty,HTMLElement,PlainObject,Undefined,Null,Integer,NullOrUndefined,NonNullOrUndefined,NonEmptyString,Object".split(',');
    for (i = assertKeys.length; i >= 0; --i) {
        type['assert' + assertKeys[i]] = createAssert(assertKeys[i]);
    }

    module.exports = type;
})();