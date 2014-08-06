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
 * 2014-06-12[09:28:41]:add 'addClass'/'hasClass'/'removeClass' functions
 * 2014-06-16[10:21:41]:add 'siblings' function
 * 2014-08-06[12:32:36]:strict test window and head
 *
 * @author yanni4night@gmail.com
 * @version 0.1.4
 * @since 0.1.0
 */

"use strict";

var type = require('./type');
var array = require('./array');
var string = require('./string');
var buggy = require('./buggy');

var doc, docHead;

if (type.strundefined === typeof window || type.isNullOrUndefined(window.document) || type.isNullOrUndefined(document.documentElement) || 'HTML' !== document.documentElement.nodeName) {
    throw new Error("It's only for HTML document");
}

doc = window.document;
docHead = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement;

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

        var link = doc.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.charset = 'utf-8';
        link.media = 'screen';
        
        docHead.appendChild(link);

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

        var script = doc.createElement("script");
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
        docHead.appendChild(script);
        return script;
    },
    addIframe: function(container, url, callback) {

        type.assertHTMLElement('container', container);
        type.assertNonEmptyString('url', url);

        var iframe = doc.createElement('iframe');
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

        if (doc.addEventListener) {
            ele.addEventListener(evt, func, false);
        } else if (doc.attachEvent) {
            ele.attachEvent('on' + evt, func);
        } else {
            ele['on' + evt] = func;
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

        var ele = doc.getElementById(id),
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
        all = doc.getElementsByTagName('*');
        array.some(all, function(ele) {
            //ignore comment
            if (ele && ele.nodeType === 1 && ele.id === id) {
                return true;
            }
        });
        return (ele && ele.id === id) ? ele : null;
    },
    /**
     * [hasClass description]
     * @param  {[type]}  ele        [description]
     * @param  {[type]}  classnames [description]
     * @return {Boolean}            [description]
     */
    hasClass: function(ele, classnames) {

        type.assertHTMLElement('ele', ele);

        if (arguments.length < 2) {
            return false;
        }

        if (!type.isNullOrUndefined(ele.classList) && ele.classList.contains) {
            return array.every(Array.prototype.slice.call(arguments, 1), function(cz) {
                return ele.classList.contains(cz);
            });
        }

        var myClass = ele.className;

        for (var i = arguments.length - 1; i > 0; --i) {
            var cn = arguments[i];
            if (!type.isString(cn)) {
                //non-string
                return false;
            }

            cn = string.trim(cn);

            if (new RegExp('\\b' + cn + '\\b').test(myClass)) {
                //Exist
                return true;
            }

        } //for arguments


        return false;
    },
    /**
     * Add a class to an element.
     * @param {HTMLElement} ele
     * @param {String} classnames
     * @return {O}
     */
    addClass: function(ele, classnames) {

        type.assertHTMLElement('ele', ele);

        if (arguments.length < 2) {
            return this;
        }

        var classAttr = string.trim(ele.className) || '';
        var classAttrArr = classAttr.split(new RegExp(string.whitespace));

        for (var i = 1, len = arguments.length; i < len; ++i) {
            var cn = arguments[i];
            if (!type.isString(cn)) {
                //non-string
                continue;
            }

            cn = string.trim(cn);

            //FIXME
            if (!/^[\w\-]+$/.test(cn)) {
                //Illegal class name
                continue;
            }

            if (new RegExp('\\b' + cn + '\\b').test(classAttr)) {
                //Exist
                continue;
            }

            classAttrArr.push(cn);

        } //for arguments

        ele.className = string.trim(classAttrArr.join(' '));

        return this;
    },

    /**
     * Remove classes from an element.
     * @param  {HTMLElement} ele
     * @param  {String|Function} classnames
     * @return {O}
     */
    removeClass: function(ele, classnames) {

        type.assertHTMLElement('ele', ele);

        if (arguments.length < 2) {
            return this;
        }

        classnames = Array.prototype.slice.call(arguments, 1);

        var classAttr = string.trim(ele.className) || "";
        var classAttrArr = classAttr.split(new RegExp(string.whitespace, ''));

        var newAttrArray = array.filter(classAttrArr, function(classn, index) {
            classn = string.trim(classn);
            if (array.some(classnames, function(filter) {
                if (type.isString(filter)) {
                    return filter === classn;
                } else if (type.isFunction(filter)) {
                    return !!filter(classn);
                } else
                    return false;
            })) {
                classAttrArr.splice(index, 1);
                return false;
            }

            return true;
        });

        ele.className = string.trim(newAttrArray.join(' '));

        return this;
    },
    /**
     * Judge if a HTMLElement matches the selector.
     *
     * The selector could include tagName(case ignored),id or class name,
     * like "li.clazz#id".
     *
     * @param  {HTMLElement} ele
     * @param  {String} selector
     * @return {Boolean}
     */
    matches: function(ele, selector) {

        type.assertHTMLElement('ele', ele);
        type.assertString('selector', selector);

        selector = string.trim(selector);

        var segs = selector.match(/([\w-]+)|(\.[\w-]+)|(#[\w-]+)/mg);
        var pattern;

        if (!segs || !segs.length) {
            return false;
        }

        segs = array.filter(segs, function(n) {
            return !!n;
        });

        for (var i = segs.length - 1; i >= 0; --i) {
            pattern = segs[i];
            if (string.startsWith(pattern, '.')) {
                if (!this.hasClass(ele, pattern.slice(1)))
                    return false;
            } else if (string.startsWith(pattern, '#')) {
                if (ele.id !== pattern.slice(1))
                    return false;
            } else {
                if (ele.tagName.toLowerCase() !== pattern.toLowerCase()) {
                    return false;
                }
            }
        }

        return true;
    },
    /**
     * Find a parent which mathes the selector.
     *
     * @param  {HTMLElement} ele
     * @param  {String} selector
     * @return {HTMLElement}
     */
    parents: function(ele, selector) {
        type.assertHTMLElement('ele', ele);
        type.assertString('selector', selector);
        selector = string.trim(selector);
        var current = ele,
            parent;
        while (!!(parent = current.parentNode)) {
            if (this.matches(parent, selector)) {
                return parent;
            }
            current = parent;
        }

        return null;
    },
    /**
     * Find all siblings of an element which match the selector.
     *
     * @param  {HTMLElement} ele
     * @param  {String} selector
     * @return {Array}
     */
    siblings: function(ele, selector) {
        type.assertHTMLElement('ele', ele);
        type.assertString('selector', selector);
        selector = string.trim(selector);
        var parent = ele.parentNode;
        if (!parent) {
            return [];
        }

        var children = parent.childNodes;
        var siblings = [];
        array.forEach(children, function(child) {
            if (this.matches(child, selector) && child != ele) {
                siblings.push(child);
            }
        }, this);

        return siblings;
    }
};

module.exports = dom;