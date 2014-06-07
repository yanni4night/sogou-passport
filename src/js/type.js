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
        noop: noop,
        strundefined: typeof undefined,
        strstr: typeof '',
        strobject: typeof {},
        strnumber: typeof 0,
        strfunction: typeof noop,
        isNullOrUndefined: function(obj) {
            return this.isNull(obj) || this.isUndefined(obj);
        },
        isInteger: function(num) {
            return this.strnumber === typeof num && /^(\-|\+)?\d+?$/i.test(num);
        },
        isNull: function(obj) {
            return null === obj;
        },
        isUndefined: function(obj) {
            return undefined === obj;
        },
        isPlainObject: function(obj) {
            return this.isObject(obj) && !this.isNull(obj);
        },
        isNonEmptyString: function(obj) {
            return obj && this.isString(obj);
        },
        isHTMLElement:function(obj){
            return obj&&obj.childNodes&&obj.appendChild;
        }
    };

    var typeKeys = "Arguments,RegExp,Date,String,Array,Boolean,Function,Number,Object".split(',');

    function createIs(vari) {
        return (function(vari) {
            return function(variable) {
                return '[object ' + vari + ']' === ({}).toString.apply(variable);
            };
        })(vari);
    }

    function createAssert(vari) {
        return (function(vari) {
            return function(name, variable) {

                if(arguments.length<2){
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

    var assertKeys = "HTMLElement,PlainObject,Undefined,Null,Integer,NullOrUndefined,NonEmptyString".split(',');
    for (i = assertKeys.length; i >= 0; --i) {
        type['assert' + assertKeys[i]] = createAssert(assertKeys[i]);
    }

    //As type is required by utils,we cannot use utils.freeze
    module.exports = type;
})();