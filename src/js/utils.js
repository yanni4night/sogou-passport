/**
 * Copyright (C) 2014 yanni4night.com
 *
 * utils.js
 *
 * changelog
 * 2014-05-24[23:06:31]:authorized
 * 2014-06-06[09:23:53]:getIEVersion
 * 2014-06-07[15:30:38]:clean by split in 'math','dom' etc
 *
 *
 * @author yanni4night@gmail.com
 * @version 0.1.2
 * @since 0.1.0
 */

(function(window, document, undefined) {
    "use strict";

    var Buggy = require('./buggy');
    var array = require('./array');
    var math = require('./math');

    //https://github.com/jquery/sizzle/blob/96728dd43c62dd5e94452f18564a888e7115f936/src/sizzle.js#L102
    var whitespace = "[\\x20\\t\\r\\n\\f]";
    var rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g");

    var type = {};

    var dom = {
        /**
         * Insert a link element
         *
         * @param  {String} src Link url
         * @return {HTMLLinkElement}
         * @throws {Error} If parameters illegal
         */
        addLink: function(src) {
            if (!src || !type.isString(src)) {
                throw new Error('"src" has to be a url string');
            }
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = src;
            document.getElementsByTagName('head')[0].appendChild(link);
            return link;
        },
        addIframe: function(container, url, callback) {
            if (!url || !type.isString(url)) {
                throw new Error('"url" has to be a url string');
            }

            var iframe = document.createElement('iframe');
            iframe.style.cssText = 'height:1px;width:1px;visibility:hidden;';
            iframe.src = url;

            if (iframe.attachEvent) {
                iframe.attachEvent("onload", function() {
                    if (type.isFunction(callback)) {
                        callback();
                    }
                });
            } else {
                iframe.onload = function() {
                    if (type.isFunction(callback)) {
                        callback();
                    }
                };
            }

            container.appendChild(iframe);
        },
        /**
         * Attatch event listener to HTMLElements.
         * @param  {HTMLElement} dom
         * @param  {String} evt
         * @param  {Function} func
         * @return {this}
         * @throws {Error} If parameters illegal
         */
        bindEvent: function(ele, evt, func) {
            if (!ele || !ele.childNodes) {
                throw new Error('"ele" has to be a HTMLElement');
            }
            if (!evt || !type.isString(evt)) {
                throw new Error('"evt" has to be a string');
            }
            if (!func || !type.isFunction(func)) {
                throw new Error('"func" has to be a function');
            }

            if (document.addEventListener) {
                ele.addEventListener(evt, func, false);
            } else if (document.attachEvent) {
                ele.attachEvent('on' + evt, func);
            }

            return this;
        },
        stopPropagation: function(evt) {
            if (evt.stopPropagation) {
                evt.stopPropagation();
            } else {
                evt.cancelBubble = true;
            }
        },
        preventDefault: function(evt) {
            if (evt.preventDefault) {
                evt.preventDefault();
            } else {
                evt.returnValue = false;
            }
        },
        eventTarget: function(e) {
            e = e || window.event;
            return e.target || e.srcElement;
        },
        /**
         * Get HTMLElement by id.
         *
         * @param  {String} id
         * @return {HTMLElement}
         */
        id: function(id) {
            var ele = document.getElementById(id),
                all, node;
            if (!Buggy.getElementById) {
                //BlackBerry 4.6
                //https://github.com/jquery/sizzle/blob/96728dd43c62dd5e94452f18564a888e7115f936/src/sizzle.js#L538
                return (ele && ele.parentNode) ? ele : null;
            } else if (ele) {
                //IE6/7
                node = typeof ele.getAttributeNode !== 'undefined' && ele.getAttributeNode("id");
                if (node && node.value === id) {
                    return ele;
                }
            }
            //TODO test
            all = document.getElementsByTagName('*');
            array.some(all, function(ele) {
                //ignore comment
                if (ele && ele.nodeType === 1 && ele.id === id) {
                    return true;
                }
            });
            return (ele && ele.id === id) ? ele : null;
        },
    };

    var utils = {
        math: math,
        array: array, //alias
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
            if (!src || 'object' !== typeof src) {
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
        }
    };

    (function() {
        //is***
        var types = "Arguments,RegExp,Date,String,Array,Boolean,Function,Number".split(',');
        var key;
        var createIs = function(type) {
            return function(variable) {
                return '[object ' + type + ']' === ({}).toString.apply(variable);
            };
        };
        for (var i = types.length - 1; i >= 0; --i) {
            key = 'is' + types[i];
            utils[key] = type[key] = createIs(types[i]);
        }
    })();

    module.exports = utils;
})(window, document);