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
"use strict";

var noop = function() {};

var hasOwn = ({}).hasOwnProperty;

var type = {
    /**
     * Library expando.
     *
     * @type {String}
     * @class Type
     * @since 0.0.8
     */
    expando: "sogou-passport-" + (+new Date()),
    /**
     * A empty function.
     *
     * @type {Function}
     * @class Type
     * @since 0.0.8
     */
    noop: noop,
    /**
     * Debug mode status.
     *
     * @type {Boolean}
     * @class Type
     * @since 0.0.8
     */
    debug: +'@debug@', //This has to be replaced with 1 or 0 to indicate a boolean value
    /**
     * typeof undefined
     *
     * @type {String}
     * @class Type
     * @since 0.0.8
     */
    strundefined: typeof undefined,
    /**
     * typeof a string
     *
     * @type {String}
     * @class Type
     * @since 0.0.8
     */
    strstr: typeof '',
    /**
     * typeof an object
     *
     * @type {String}
     * @class Type
     * @since 0.0.8
     */
    strobject: typeof {},
    /**
     * typeof a number
     *
     * @type {String}
     * @class Type
     * @since 0.0.8
     */
    strnumber: typeof 0,
    /**
     * typeof a function
     *
     * @type {String}
     * @class Type
     * @since 0.0.8
     */
    strfunction: typeof noop,
    /**
     * Detect if an object is null or undefined.
     *
     * @param  {Object}  obj
     * @return {Boolean}
     * @class Type
     * @since 0.0.8
     */
    isNullOrUndefined: function(obj) {
        return !!(this.isNull(obj) || this.isUndefined(obj));
    },
    /**
     * Detect if an object isn't null or undefined.
     * 
     * @param  {object}  obj
     * @return {Boolean}
     * @class Type
     * @since 0.0.8
     */
    isNonNullOrUndefined: function(obj) {
        return !this.isNullOrUndefined(obj);
    },
    /**
     * Detect if an object is a number,NaN and Finite are not included.
     * 
     * @param  {object}  obj
     * @return {Boolean}
     * @class Type
     * @since 0.0.8
     */
    isInteger: function(num) {
        return !!(this.isNumber(num) && /^(\-|\+)?\d+?$/i.test(num));
    },
    /**
     * Detect if an object is null.
     * 
     * @param  {object}  obj
     * @return {Boolean}
     * @class Type
     * @since 0.0.8
     */
    isNull: function(obj) {
        return null === obj;
    },
    /**
     * Detect if an object is undefined.
     * 
     * @param  {object}  obj
     * @return {Boolean}
     * @class Type
     * @since 0.0.8
     */
    isUndefined: function(obj) {
        return undefined === obj;
    },
    /**
     * Check if obj is a plain object.
     *
     * @param  {Object}  obj
     * @return {Boolean}
     * @class Type
     * @since 0.0.8
     */
    isPlainObject: function(obj) {
        if (!obj || !this.isObject(obj) || obj.nodeType || this.isWindow(obj)) {
            return false;
        }

        try {
            if (obj.constructor && !hasOwn.call(obj, 'constructor') && !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                return false;
            }
        } catch (e) {
            return false;
        }
        var key;
        for (key in obj) {}
        return this.isUndefined(key) || hasOwn.call(obj, key);
    },
    /**
     * Detect if an object is a non-empty string.
     * 
     * @param  {Object}  obj
     * @return {Boolean}
     * @class Type
     * @since 0.0.8
     */
    isNonEmptyString: function(obj) {
        return !!(obj && this.isString(obj));
    },
    /**
     * Detect if an object is a HTMLElement.
     *
     * This kind detection is quite simple,you can easily
     * pass with a fake HTMLElement with some special methods.
     * 
     * @param  {Object}  obj
     * @return {Boolean}
     * @class Type
     * @since 0.0.8
     */
    isHTMLElement: function(obj) {
        return !!(obj && obj.childNodes && obj.tagName && obj.appendChild);
    },
    /**
     * Detect if an object is null,undefined,empty array or empty string.
     *
     * @param  {Object}  obj
     * @return {Boolean}
     * @class Type
     * @since 0.0.8
     */
    isEmpty: function(obj) {
        return this.isNullOrUndefined(obj) || (this.isArray(obj) && !obj.length) || '' === obj;
    },
    /**
     * Detect typeof obj is 'object',which makes array&null pass.
     *
     * @param  {Object}  obj
     * @return {Boolean}
     * @class Type
     * @since 0.0.8
     */
    isObject: function(obj) {
        return this.strobject === typeof obj;
    },
    /**
     * Detect if an object is window in browser.
     *
     * @param  {Object}  obj
     * @return {Boolean}
     * @class Type
     * @since 0.0.8
     */
    isWindow: function(obj) {
        //jquery
        return this.isNonNullOrUndefined(obj) && obj == obj.window;
    }
};

var typeKeys = "RegExp,Date,String,Array,Boolean,Function,Number".split(',');

/**
 * Create is* functions.
 *
 * @ignore
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
 *
 * @ignore
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