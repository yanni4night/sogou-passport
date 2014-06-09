/**
 * Copyright (C) 2014 yanni4night.com
 *
 * dom.js
 *
 * Some simple DOM operations.
 *
 * changelog
 * 2014-06-07[16:33:33]:authorized
 * 2014-06-08[21:38:47]:add callback to 'addLink';add 'addScript'
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */


(function(window, document, undefined) {
    "use strict";

    var type = require('./type');
    var buggy = require('./buggy');

    if (!window || !document || !document.documentElement || 'HTML' !== document.documentElement.nodeName) {
        throw new Error("It's only for HTML document");
    }

    var dom = {
        /**
         * Insert a link element
         *
         * @param  {String} href Link url
         * @param  {Function} callback Callback function
         * @return {HTMLLinkElement}
         * @throws {Error} If parameters illegal
         */
        addLink: function(href, callback) {

            type.assertNonEmptyString('href', href);

            if (callback) {
                type.assertFunction(callback);
            } else {
                callback = type.noop;
            }

            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(link);
            if (link.readyState) {
                link.onreadystatechange = function() {
                    if (link.readyState === "loaded" || link.readyState === "complete") {
                        link.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                link.onload = function() {
                    callback();
                };
            }
            link.href = href;
            return link;
        },
        /**
         * Insert a script element.
         * 
         * @param {String}   src     
         * @param {Function} callback
         */
        addScript: function(src, callback) {
            
            type.assertNonEmptyString('src', src);

            if (callback) {
                type.assertFunction(callback);
            } else {
                callback = type.noop;
            }

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.charset = "utf-8";
            if (script.readyState) {
                script.onreadystatechange = function() {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                script.onload = function() {
                    callback();
                };
            }
            script.src = src;
            document.getElementsByTagName("head")[0].appendChild(script);
            return script;
        },
        addIframe: function(container, url, callback) {

            type.assertHTMLElement('container', container);
            type.assertNonEmptyString('url', url);

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

            type.assertHTMLElement('ele', ele);
            type.assertNonEmptyString('evt', evt);
            type.assertFunction('func', func);

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

            type.assertNonEmptyString('id', id);

            var ele = document.getElementById(id),
                all, node;
            if (!buggy.getElementById) {
                //BlackBerry 4.6
                //https://github.com/jquery/sizzle/blob/96728dd43c62dd5e94452f18564a888e7115f936/src/sizzle.js#L538
                return (ele && ele.parentNode) ? ele : null;
            } else if (ele) {
                //IE6/7
                node = typeof ele.getAttributeNode !== type.strundefined && ele.getAttributeNode("id");
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
        }
    };
    module.exports = dom;
})(window, document);