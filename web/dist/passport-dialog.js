(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * array.js
 *
 * Some polyfill for ES5 array.
 *
 * changelog
 * 2014-06-06[14:11:09]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function() {
  "use strict";

  var type = require('./type');
  var array = {};

  /**
   * ES5 array indexOf polyfill.
   *
   * @param  {Array} arr
   * @param  {Object} ele
   * @param  {Integer} fromIndex
   * @return {Boolean}
   */
  array.indexOf = function(arr, ele, fromIndex) {
    var i, len;

    if (!arr || !ele) {
      return -1;
    }

    fromIndex = fromIndex | 0;
    if (isNaN(fromIndex)) {
      fromIndex = 0;
    }
    if (fromIndex >= arr.length) {
      return -1;
    }
    if (fromIndex < 0) {
      fromIndex = arr.length + fromIndex;
      if (fromIndex < 0) {
        fromIndex = 0;
      }
    }

    if (Array.prototype.indexOf) {
      return Array.prototype.indexOf.call(arr, ele, fromIndex);
    } else {
      for (i = fromIndex, len = arr.length; i < len; ++i) {
        if (ele === arr[i]) {
          return i;
        }
      }
    }

    return -1;
  };

  /**
   * ES5 array forEach polyfill.
   *
   * @param  {Array} arr
   * @param  {Function} callbackfn
   * @param  {Object} thisArg
   * @return {Undefined}
   */
  array.forEach = function(arr, callbackfn, thisArg) {
    var i, len;

    type.assertNonNullOrUndefined('arr', arr);
    type.assertFunction('callbackfn', callbackfn);

    if (Array.prototype.forEach) {
      return Array.prototype.forEach.call(arr, callbackfn, thisArg);
    }

    for (i = 0, len = arr.length; i < len; ++i) {
      callbackfn.call(thisArg, arr[i], i, arr);
    }

  };
  /**
   * ES5 array every polyfill.
   *
   * @param  {Array} arr
   * @param  {Function} func
   * @return {Boolean}
   */
  array.each = array.every = function(arr, callbackfn, thisArg) {
    var i, len;

    type.assertNonNullOrUndefined('arr', arr);
    type.assertFunction('callbackfn', callbackfn);

    //ES5
    if (Array.prototype.every) {
      return Array.prototype.every.call(arr, callbackfn, thisArg);
    } else {
      for (i = 0, len = arr.length; i < len; ++i) {
        if (!callbackfn.call(thisArg, arr[i], i, arr)) {
          return false;
        }
      }
    }

    return true;
  };

  /**
   * ES5 array some polyfill.
   *
   * @param  {Array} arr
   * @param  {Function} callbackfn
   * @param  {Object} thisArg
   * @return {Boolean}
   */
  array.some = function(arr, callbackfn, thisArg) {
    var i, len;

    type.assertNonNullOrUndefined('arr', arr);
    type.assertFunction('callbackfn', callbackfn);

    //ES5
    if (Array.prototype.some) {
      return Array.prototype.some.call(arr, callbackfn, thisArg);
    } else {
      for (i = 0, len = arr.length; i < len; ++i) {
        if (true === callbackfn.call(thisArg, arr[i], i, arr)) {
          return true;
        }
      }
    }

    return false;
  };

  /**
   * ES5 array filter polyfill.
   *
   * @param  {Array} arr
   * @param  {Function} callbackfn
   * @param  {Object} thisArg
   * @return {Array}
   */
  array.filter = function(arr, callbackfn, thisArg) {
    var ret = [];

    type.assertNonNullOrUndefined('arr', arr);
    type.assertFunction('callbackfn', callbackfn);


    if (Array.prototype.filter) {
      return Array.prototype.filter.call(arr, callbackfn, thisArg);
    }

    array.forEach(arr, function(val, index) {
      if (callbackfn.call(thisArg, val, index, arr)) {
        ret.push(val);
      }
    });
    return ret;
  };

  module.exports = array;
})();
},{"./type":11}],2:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * buggy.js
 *
 * changelog
 * 2014-06-07[10:08:13]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function(window, document, undefined) {
    "use strict";

    var expando = require('./type').expando;

    var Buggy = {
        /**
         * "getElementById" is buggy on IE6/7.
         *
         * @see  https://github.com/jquery/sizzle/blob/96728dd43c62dd5e94452f18564a888e7115f936/src/sizzle.js#L528
         * @property
         */
        getElementById: (function(document) {
            var div = document.createElement('div');

            //document.body is null here
            document.documentElement.appendChild(div).setAttribute('id', expando);

            var buggy = document.getElementsByName && document.getElementsByName(expando).length;

            document.documentElement.removeChild(div);

            div = null;

            return !!buggy;
        })(document)
    };

    module.exports = Buggy;
})(window, document);
},{"./type":11}],3:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * codes.js
 *
 * changelog
 * 2014-05-24[23:06:47]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function(window, document, undefined) {
    "use strict";

    //Just for freeze
    var utils = require('./utils');
    
    var codes = {
        SYSTEM_ERROR: {
            code: 10001,
            info: "未知错误"
        },
        PARAM_ERROR: {
            code: 10002,
            info: "参数错误"
        },
        CAPTCHA_FAILED: {
            code: 20221,
            info: "验证码验证失败 "
        },
        ACCOUNT_NOT_EXIST: {
            code: 20205,
            info: "帐号不存在"
        },
        ACCOUNT_NOT_EXIST_1: {
            code: 10009,
            info: "帐号不存在"
        },
        ACCOUNT_NOT_ACTIVED: {
            code: 20231,
            info: "登陆账号未激活"
        },
        ACCOUNT_KILLED: {
            code: 20232,
            info: "登陆账号被封杀"
        },
        ACCOUNT_PWD_WRONG: {
            code: 20206,
            info: "账号或密码错误"
        },
        LOGIN_TIME_OUT: {
            code: 100000,
            info: "登录超时"
        },
        NEED_USERNAME: {
            code: 100001,
            info: "请输入通行证用户名"
        },
        NEED_PASSWORD: {
            code: 100002,
            info: "请输入通行证密码"
        }
    };

    utils.freeze(codes);

    module.exports = codes;

})(window, document);
},{"./utils":12}],4:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * console.js
 *
 * Polyfill for console.
 *
 * changelog
 * 2014-06-06[11:43:57]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function(window, undefined) {
    "use strict";

    var type = require('./type');
    var console = window.console;

    if (!console || type.strobject !== typeof console) {
        console = {};
    }

    var keys = 'trace,info,log,debug,warn,error'.split(',');

    for (var i = keys.length - 1; i >= 0; i--) {
        console[keys[i]] = console[keys[i]] || type.noop;
    }

    module.exports = console;
})(window);
},{"./type":11}],5:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * cookie.js
 *
 * Some operations about cookie.
 *
 * changelog
 * 2014-06-07[13:47:16]:authorized
 * 2014-06-07[15:21:54]:search cookie by regexp
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */
(function(window, document, undefined) {
    "use strict";

    var UTILS = require('./utils');

    var PassportCookieParser = {
        cookie:{},
        getCookie: function() {
            return this.cookie;
        },
        parsePassportCookie: function() {
            var value, i, parsedArray,matches;

            if (true !== (window.navigator && navigator.cookieEnabled)) {
                return this;
            }
            //clear
            this.cookie = {};

            var cookieArray = document.cookie.split("; ");
            for (i = 0; i < cookieArray.length; ++i) {
                matches = cookieArray[i].match(/^p(?:pinf|pinfo|assport)=(.+)$/);
                if(matches&&matches[1])
                {
                    value = matches[1];
                    break;
                }
            }

            //No cookie read
            if (!value) {
                return this;
            }

            try {
                parsedArray = unescape(value).split("|");
                if (parsedArray[0] == "1" || parsedArray[0] == "2" && parsedArray[3]) {
                    this._parsePassportCookie(UTILS.math.utf8to16(UTILS.math.b64_decodex(parsedArray[3])));
                }
            } catch (e) {}

            return this;
        },
        /**
         * Legacy function,DO NOT MODIFY.
         */
        _parsePassportCookie: function(F) {
            var J = 0,
                D, B, A, I, lenEnd_offset;
            var C = F.indexOf(":", J);
            while (C != -1) {
                B = F.substring(J, C);
                lenEnd_offset = F.indexOf(":", C + 1);
                if (lenEnd_offset == -1) {
                    break;
                }
                A = parseInt(F.substring(C + 1, lenEnd_offset));
                I = F.substr(lenEnd_offset + 1, A);
                if (F.charAt(lenEnd_offset + 1 + A) != "|") {
                    break;
                }
                this.cookie[B] = I;
                J = lenEnd_offset + 2 + A;
                C = F.indexOf(":", J);
            }

            return this;
        }
    };

    module.exports = {
        PassportCookieParser: {
            parse: function() {
                return PassportCookieParser.parsePassportCookie().getCookie();
            }
        }
    };
})(window, document);
},{"./utils":12}],6:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com sogou.com
 *
 * core.js
 *
 * Passport for sogou.com Ltd.
 *
 * Compared to previous sogou.js,we removed the
 * HTML dialog part,and export the least number
 * of interfaces.
 *
 * We plan to support HTML dialog by plugins.
 *
 * changelog
 * 2014-05-24[20:43:42]:authorized
 * 2014-05-25[10:48:30]:code matched
 * 2014-06-04[15:16:38]:remove 'container' parameter,we create it instead
 * 2014-06-04[16:37:06]:disabled 'remindActive' action
 * 2014-06-06[11:18:50]:'getOptions'&'isInitialized' added
 * 2014-06-07[11:03:49]:make 'getOptions' returns copy
 * 2014-06-07[12:56:24]:'NEEDCAPTCHA' event
 * 2014-06-07[20:07:16]:reconstruction PassportSC
 * 2014-06-08[01:28:21]:third party login supported by 'login3rd'
 * 2014-06-08[12:24:48]:hide source of functions
 *
 * @author yanni4night@gmail.com
 * @version 0.1.7
 * @since 0.1.0
 */

(function(window, document, undefined) {
    "use strict";

    var UTILS = require('./utils');
    var CODES = require('./codes');
    var console = require('./console');
    var Event = require('./event');
    var type = UTILS.type;
    var PassportCookieParser = require('./cookie').PassportCookieParser;

    var EXPANDO = type.expando;
    var HIDDEN_CSS = 'width:1px;height:1px;position:absolute;left:-100000px;display:block;';

    var EVENTS = {
        login_success: 'loginsuccess',
        login_failed: 'loginfailed',
        logout_success: 'logoutsuccess',
        need_captcha: 'needcaptcha',
        third_party_login_complete: '3rdlogincomplete'
    };

    var FIXED_URLS = {
        login: 'https://account.sogou.com/web/login',
        logout: 'https://account.sogou.com/web/logout_js',
        //active: 'https://account.sogou.com/web/remindActivate',
        captcha: 'https://account.sogou.com/captcha',
        trdparty: 'http://account.sogou.com/connect/login'
    };

    var THIRD_PARTY_SIZE = {
        size: {
            renren: [880, 620],
            sina: [780, 640],
            qq: [500, 300]
        }
    };


    var HTML_FRAME_LOGIN = '<form method="post" action="' + FIXED_URLS.login + '" target="' + EXPANDO + '">' + '<input type="hidden" name="username" value="<%=username%>">' + '<input type="hidden" name="password" value="<%=password%>">' + '<input type="hidden" name="captcha" value="<%=vcode%>">' + '<input type="hidden" name="autoLogin" value="<%=autoLogin%>">' + '<input type="hidden" name="client_id" value="<%=appid%>">' + '<input type="hidden" name="xd" value="<%=redirectUrl%>">' + '<input type="hidden" name="token" value="<%=token%>"></form>' + '<iframe name="' + EXPANDO + '" src="about:blank" style="' + HIDDEN_CSS + '"></iframe>';

    //For validations of options in bulk
    var VALIDATORS = [{
        name: ['appid'],
        validate: function(name, value) {
            return value && (type.strstr === typeof value || type.strnumber === typeof value);
        },
        errmsg: function(name, value) {
            return '"' + name + '" SHOULD be a string or a number';
        }
    }, {
        name: ['redirectUrl'],
        validate: function(name, value) {
            return value && type.strstr === typeof value && new RegExp('^' + location.protocol + "//" + location.host, 'i').test(value);
        },
        errmsg: function(name, value) {
            return '"' + name + '" SHOULD be a URL which has the some domain as the current page';
        }
    }];

    var gOptions = null;
    var PassportSC = null;
    var frameWrapper = null;
    var defaultOptions = {
        appid: null,
        redirectUrl: null
    };

    var NOT_INITIALIZED_ERROR = 'Passport has not been initialized yet';

    /**
     * Create frameWrapper if it not exists.
     *
     * @param {Function}
     * @return {HTMLElement} frameWrapper
     */
    function assertFrameWrapper(callback) {
        var c = frameWrapper;
        if (!c || (type.strobject !== typeof c) || (type.strundefined === typeof c.appendChild) || !c.parentNode) {
            c = frameWrapper = document.createElement('div');
            c.style.cssText = HIDDEN_CSS;
            c.className = c.id = EXPANDO;
            document.body.appendChild(c);
        }

        if (type.isFunction(callback)) {
            callback(c);
        }
        return c;
    }

    /**
     * This is the inner PASSPORT constructor.
     * As the instance could not be more then one,
     * it may be called only once.
     *
     * @param {Object} options
     * @throws {Error} If any validattion failed
     */
    function validateOptions(options) {
        var i, j, validator, name, opt;

        opt = gOptions = {};

        type.assertPlainObject('options', options);

        UTILS.mixin(opt, defaultOptions);
        UTILS.mixin(opt, options);

        for (i = VALIDATORS.length - 1; i >= 0; --i) {
            validator = VALIDATORS[i];
            for (j = validator.name.length - 1; j >= 0; --j) {
                name = validator.name[j];
                if (!validator.validate(name, opt[name])) {
                    throw new Error(type.strfunction === typeof validator.errmsg ?
                        validator.errmsg(name, opt[name]) : validator.errmsg
                    );
                }
            }
        }
        //DON'T FORGET IT
        opt._token = UTILS.math.uuid();
    }

    /**
     * Simple template replacer.
     *
     * @param  {String} tpl
     * @param  {Object} data
     * @return {String}
     */
    function template(tpl, data) {
        return tpl.replace(/<%=([\w\-]+?)%>/g, function(k, n) {
            var key = data[n];
            return undefined === key ? "" : key;
        });
    }

    /**
     * Core passport object.
     *
     * This will be merged into PassportSC.
     *
     * @class
     */
    var Passport = {
        version: '0.1.7', //see 'package.json'
        /**
         * Initialize.
         * This must be called at first before
         * any other operations.
         *
         * The following options must be set in options:
         * 1.appid -- Integer of ID,it depends on the product line;
         * 2.redirectUrl -- A same domain page url for cross-domain;
         *
         * @param  {Obejct} options Required options
         * @return {Object} PassportSC
         */
        init: function(options) {
            if (!this.isInitialized()) {
                console.trace('Initialize passport');
                validateOptions(options);
            } else {
                console.warn('Passport has already been initialized');
            }
            //support both PassportSC() and PassportSC.init()
            return PassportSC;
        },
        /**
         * Do login
         *
         * @param  {String} username
         * @param  {String} password
         * @param  {String} vcode
         * @param  {Boolean} autoLogin
         * @return {Object} this
         * @throws {Error} If not initialized
         */
        login: function(username, password, vcode, autoLogin) {
            if (!this.isInitialized()) {
                throw new Error(NOT_INITIALIZED_ERROR);
            }

            console.trace('logining with:' + Array.prototype.join.call(arguments));

            var payload;

            if (arguments.length < 4) {
                autoLogin = vcode;
                vcode = '';
            }

            //this._currentUname = username;

            type.assertNonEmptyString('username', username);
            type.assertNonEmptyString('password', password);

            payload = {
                username: username,
                password: password,
                vcode: vcode || "",
                autoLogin: +(!!autoLogin), //:0/1
                appid: gOptions.appid,
                redirectUrl: gOptions.redirectUrl,
                token: gOptions._token
            };

            assertFrameWrapper(function(container) {
                container.innerHTML = template(HTML_FRAME_LOGIN, payload);
                container.getElementsByTagName('form')[0].submit();
            });

        },
        /**
         * Third party login.
         *
         * @param  {String} provider qq|sina|renren
         * @param  {String} display page|popup
         * @param  {String} redirectUrl
         */
        login3rd: function(provider, display, redirectUrl) {
            if (!this.isInitialized()) {
                throw new Error(NOT_INITIALIZED_ERROR);
            }

            type.assertNonEmptyString('provider', provider);

            var size = THIRD_PARTY_SIZE.size[provider];
            if (!size) {
                throw new Error('provider:"' + provider + '" is not supported in  third party login');
            }

            if ('popup' === display) {
                //popup and at least 2
                type.assertNonEmptyString('redirectUrl', redirectUrl);
            } else if (type.isUndefined(display)) {
                //One
                display = 'page';
                redirectUrl = location.href;
            } else {
                //At least two and not popup
                redirectUrl = redirectUrl || location.href;
            }

            var authUrl = FIXED_URLS.trdparty + '?client_id=' + gOptions.appid + '&provider=' + provider + '&ru=' + encodeURIComponent(redirectUrl);

            if ('popup' === display) {
                var left = (window.screen.availWidth - size[0]) / 2;
                window.open(authUrl, '', 'height=' + size[1] + ',width=' + size[0] + ',top=80,left=' + left + ',toolbar=no,menubar=no');
            } else if ('page' === display) {
                location.href = authUrl;
            } else {
                throw new Error('display:"' + display + '" is not supported in third party login');
            }

        },
        /**
         * Do logout.
         * @return {Object} this
         * @throws {Error} If not initialized
         */
        logout: function() {
            if (!this.isInitialized()) {
                throw new Error(NOT_INITIALIZED_ERROR);
            }
            console.trace('logouting');
            var self = this;
            var url = FIXED_URLS.logout + '?client_id=' + gOptions.appid;

            assertFrameWrapper(function(container) {
                UTILS.dom.addIframe(container, url, function() {
                    self.emit(EVENTS.logout_success);
                });
            });

        },
        /**
         * Get userid from cookie
         * @return {String} userid or empty string
         * @throws {Error} If not initialized
         */
        userid: function() {
            if (!this.isInitialized()) {
                throw new Error(NOT_INITIALIZED_ERROR);
            }

            return PassportCookieParser.parse().userid || "";
        },
        /**
         * Login callback from iframe.
         * DO NOT call it directly.
         *
         * @param  {Object} data login result
         */
        _logincb: function(data) {
            if (!this.isInitialized()) {
                console.trace('Login callback received but [Passport] has not been initialized');
                return;
            }

            if (!data || type.strobject !== typeof data) {
                console.error('Nothing callback received');
                this.emit(EVENTS.login_failed, data);
            } else if (0 === +data.status) {
                this.emit(EVENTS.login_success, data);
            }
            /* else if (+data.status === 20231) {
                location.href = FIXED_URLS.active + '?email=' + encodeURIComponent(this._currentUname) + '&client_id=' + gOptions.appid + '&ru=' + encodeURIComponent(location.href);
            }*/
            else if (+data.needcaptcha) {
                data.captchaimg = FIXED_URLS.captcha + '?token=' + gOptions._token + '&t=' + (+new Date());
                this.emit(EVENTS.need_captcha, data);
            } else {
                for (var e in CODES) {
                    if (CODES[e].code == data.status) {
                        data.msg = CODES[e].info;
                        break;
                    }
                }
                data.msg = data.msg || "Unknown error";
                this.emit(EVENTS.login_failed, data);
            }
        },
        /**
         * Third party login callback from 'popup' window.
         * DO NOT call it directly.
         *
         * It does not support callback with 'page' display.
         */
        _logincb3rd: function() {
            if (!this.isInitialized()) {
                console.trace('Login3rd callback received but [Passport] has not been initialized');
                return;
            }
            this.emit(EVENTS.third_party_login_complete);
        },
        /**
         * If passport has been initialized.
         *
         * @return {Boolean} Initialized
         */
        isInitialized: function() {
            return !!gOptions;
        },
        /**
         * Get a copy of options.
         *
         * @return {Object} Options
         */
        getOptions: function() {
            var opts = {};
            return UTILS.mixin(opts, gOptions);
        },
        /**
         * Get a copy of events which passport supports.
         *
         * @return {Object} Supported events
         */
        getSupportedEvents: function() {
            var events = {};
            return UTILS.mixin(events, EVENTS);
        }
    };

    /**
     * Create toString functions.
     *
     * @param  {String} name
     * @return {Function}
     */
    function createToString(name, source) {
        return (function(name, source) {
            return function() {
                return 'PassportSC.' + name + source.match(/\([^\{\(]+(?=\{)/)[0];
            };
        })(name, source);
    }

    //Hide implementation for beauty.
    PassportSC = function() {
        return Passport.init.apply(Passport, arguments);
    };

    UTILS.mixin(PassportSC, Passport);


    //Make proxy an event emitter too.
    UTILS.mixin(PassportSC, new Event());

    //PassportSC is shy.
    //We do this for hiding source of its function members,
    //which may show up in chrome console.
    for (var e in PassportSC) {
        if (type.isFunction(PassportSC[e])) {
            PassportSC[e].toString = createToString(e, String(PassportSC[e]));
        }
    }

    //Sync loading supported
    if (window.PassportSC && type.strobject === typeof window.PassportSC) {
        UTILS.mixin(window.PassportSC, PassportSC);
        if (strfunction === typeof window.PassportSC.onApiLoaded)
            window.PassportSC.onApiLoaded();
    } else {
        window.PassportSC = PassportSC;
    }

    module.exports = PassportSC;
})(window, document);
},{"./codes":3,"./console":4,"./cookie":5,"./event":8,"./utils":12}],7:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * dom.js
 *
 * Some simple DOM operations.
 *
 * changelog
 * 2014-06-07[16:33:33]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
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
         * @param  {String} src Link url
         * @return {HTMLLinkElement}
         * @throws {Error} If parameters illegal
         */
        addLink: function(src) {

            type.assertNonEmptyString('src',src);

            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = src;
            document.getElementsByTagName('head')[0].appendChild(link);
            return link;
        },
        addIframe: function(container, url, callback) {

            type.assertHTMLElement('container',container);
            type.assertNonEmptyString('url',url);

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

            type.assertHTMLElement('ele',ele);
            type.assertNonEmptyString('evt',evt);
            type.assertFunction('func',func);

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
            
            type.assertNonEmptyString('id',id);

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
},{"./buggy":2,"./type":11}],8:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * event.js
 *
 * changelog
 * 2014-06-06[14:02:08]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function() {
    "use strict";
    
    var UTILS = require('./utils');
    var console = require('./console');
    var array = UTILS.array;
    var type = UTILS.type;

    var EventEmitter = function() {

        var listeners = {};

        /**
         * Bind event,multiple events split by space supported
         * @param  {String} event
         * @param  {Function} func
         * @param  {Object} thisArg
         * @return {EventEmitter}      This event emitter
         */
        this.on = function(event, func, thisArg) {
            var evtArr;

            type.assertNonEmptyString('event',event);
            type.assertFunction('func',func);

            evtArr = UTILS.trim(event).split(/\s/);

            array.forEach(evtArr, function(evt) {
                listeners[evt] = listeners[evt] || [];
                listeners[evt].push({
                    type: evt,
                    func: func,
                    thisArg: thisArg
                });
            });

            return this;
        };

        /**
         * Remove event,multiple events split by space supported.
         *
         * Empty 'func' means remove all listeners named 'event'.
         * 
         * @param  {String} event
         * @param  {Function} func
         * @return {EventEmitter}     This event emitter
         */
        this.off = function(event, func) {
            var evtArr, objs;

            type.assertNonEmptyString('event',event);
            type.assertFunction('func',func);

            evtArr = UTILS.trim(event).split(/\s/);
            array.forEach(evtArr, function(evt) {
                if (!func) {
                    delete listeners[evt];
                    return this;
                } else {
                    objs = listeners[evt];
                    if (type.isArray(objs)) {
                        listeners[evt] = array.filter(objs, function(obj) {
                            return obj.func !== func;
                        });
                    }
                }
            });


            return this;
        };

        /**
         * Emit event(s),multiple events split by space supported.
         * 
         * @param  {String} event
         * @param  {Object} data
         * @return {EventEmitter} This event emitter
         */
        this.emit = function(event, data) {
            var evtArr, objs;

            type.assertNonEmptyString('event',event);

            evtArr = UTILS.trim(event).split(/\s/);

            array.forEach(evtArr, function(evt) {
                objs = listeners[evt];
                if (type.isArray(objs)) {
                    array.forEach(objs, function(obj) {
                        //add timestamp
                        obj.timestamp = +new Date();
                        obj.func.call(obj.thisArg || null, obj, data);
                    });
                }
            });

            console.trace('emitting ' + evtArr.join());
            return this;
        };
    };

    module.exports = EventEmitter;
})();
},{"./console":4,"./utils":12}],9:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * math.js
 *
 * changelog
 * 2014-06-07[15:36:34]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
(function() {
    "use strict";

    //They seem to be const
    var hexcase = 0;
    var chrsz = 8;
    
    var math = {
        b64_423: function(E) {
            var D = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"];
            var F = '';
            for (var C = 0; C < E.length; C++) {
                for (var A = 0; A < 64; A++) {
                    if (E.charAt(C) == D[A]) {
                        var B = A.toString(2);
                        F += ("000000" + B).substr(B.length);
                        break;
                    }
                }
                if (A == 64) {
                    if (C == 2) {
                        return F.substr(0, 8);
                    } else {
                        return F.substr(0, 16);
                    }
                }
            }
            return F;
        },
        b2i: function(D) {
            var A = 0;
            var B = 128;
            for (var C = 0; C < 8; C++, B = B / 2) {
                if (D.charAt(C) == "1") {
                    A += B;
                }
            }
            return String.fromCharCode(A);
        },
        b64_decodex: function(D) {
            var B = [];
            var C;
            var A = "";
            for (C = 0; C < D.length; C += 4) {
                A += this.b64_423(D.substr(C, 4));
            }
            for (C = 0; C < A.length; C += 8) {
                B += this.b2i(A.substr(C, 8));
            }
            return B;
        },
        hex_md5: function(A) {
            return this.binl2hex(this.core_md5(this.str2binl(A), A.length * chrsz));
        },
        core_md5: function(K, F) {
            K[F >> 5] |= 128 << ((F) % 32);
            K[(((F + 64) >>> 9) << 4) + 14] = F;
            var J = 1732584193;
            var I = -271733879;
            var H = -1732584194;
            var G = 271733878;
            var md5_ff = this.md5_ff;
            var md5_gg = this.md5_gg;
            var md5_hh = this.md5_hh;
            var md5_ii = this.md5_ii;
            for (var C = 0; C < K.length; C += 16) {
                var E = J;
                var D = I;
                var B = H;
                var A = G;
                J = md5_ff(J, I, H, G, K[C + 0], 7, -680876936);
                G = md5_ff(G, J, I, H, K[C + 1], 12, -389564586);
                H = md5_ff(H, G, J, I, K[C + 2], 17, 606105819);
                I = md5_ff(I, H, G, J, K[C + 3], 22, -1044525330);
                J = md5_ff(J, I, H, G, K[C + 4], 7, -176418897);
                G = md5_ff(G, J, I, H, K[C + 5], 12, 1200080426);
                H = md5_ff(H, G, J, I, K[C + 6], 17, -1473231341);
                I = md5_ff(I, H, G, J, K[C + 7], 22, -45705983);
                J = md5_ff(J, I, H, G, K[C + 8], 7, 1770035416);
                G = md5_ff(G, J, I, H, K[C + 9], 12, -1958414417);
                H = md5_ff(H, G, J, I, K[C + 10], 17, -42063);
                I = md5_ff(I, H, G, J, K[C + 11], 22, -1990404162);
                J = md5_ff(J, I, H, G, K[C + 12], 7, 1804603682);
                G = md5_ff(G, J, I, H, K[C + 13], 12, -40341101);
                H = md5_ff(H, G, J, I, K[C + 14], 17, -1502002290);
                I = md5_ff(I, H, G, J, K[C + 15], 22, 1236535329);
                J = md5_gg(J, I, H, G, K[C + 1], 5, -165796510);
                G = md5_gg(G, J, I, H, K[C + 6], 9, -1069501632);
                H = md5_gg(H, G, J, I, K[C + 11], 14, 643717713);
                I = md5_gg(I, H, G, J, K[C + 0], 20, -373897302);
                J = md5_gg(J, I, H, G, K[C + 5], 5, -701558691);
                G = md5_gg(G, J, I, H, K[C + 10], 9, 38016083);
                H = md5_gg(H, G, J, I, K[C + 15], 14, -660478335);
                I = md5_gg(I, H, G, J, K[C + 4], 20, -405537848);
                J = md5_gg(J, I, H, G, K[C + 9], 5, 568446438);
                G = md5_gg(G, J, I, H, K[C + 14], 9, -1019803690);
                H = md5_gg(H, G, J, I, K[C + 3], 14, -187363961);
                I = md5_gg(I, H, G, J, K[C + 8], 20, 1163531501);
                J = md5_gg(J, I, H, G, K[C + 13], 5, -1444681467);
                G = md5_gg(G, J, I, H, K[C + 2], 9, -51403784);
                H = md5_gg(H, G, J, I, K[C + 7], 14, 1735328473);
                I = md5_gg(I, H, G, J, K[C + 12], 20, -1926607734);
                J = md5_hh(J, I, H, G, K[C + 5], 4, -378558);
                G = md5_hh(G, J, I, H, K[C + 8], 11, -2022574463);
                H = md5_hh(H, G, J, I, K[C + 11], 16, 1839030562);
                I = md5_hh(I, H, G, J, K[C + 14], 23, -35309556);
                J = md5_hh(J, I, H, G, K[C + 1], 4, -1530992060);
                G = md5_hh(G, J, I, H, K[C + 4], 11, 1272893353);
                H = md5_hh(H, G, J, I, K[C + 7], 16, -155497632);
                I = md5_hh(I, H, G, J, K[C + 10], 23, -1094730640);
                J = md5_hh(J, I, H, G, K[C + 13], 4, 681279174);
                G = md5_hh(G, J, I, H, K[C + 0], 11, -358537222);
                H = md5_hh(H, G, J, I, K[C + 3], 16, -722521979);
                I = md5_hh(I, H, G, J, K[C + 6], 23, 76029189);
                J = md5_hh(J, I, H, G, K[C + 9], 4, -640364487);
                G = md5_hh(G, J, I, H, K[C + 12], 11, -421815835);
                H = md5_hh(H, G, J, I, K[C + 15], 16, 530742520);
                I = md5_hh(I, H, G, J, K[C + 2], 23, -995338651);
                J = md5_ii(J, I, H, G, K[C + 0], 6, -198630844);
                G = md5_ii(G, J, I, H, K[C + 7], 10, 1126891415);
                H = md5_ii(H, G, J, I, K[C + 14], 15, -1416354905);
                I = md5_ii(I, H, G, J, K[C + 5], 21, -57434055);
                J = md5_ii(J, I, H, G, K[C + 12], 6, 1700485571);
                G = md5_ii(G, J, I, H, K[C + 3], 10, -1894986606);
                H = md5_ii(H, G, J, I, K[C + 10], 15, -1051523);
                I = md5_ii(I, H, G, J, K[C + 1], 21, -2054922799);
                J = md5_ii(J, I, H, G, K[C + 8], 6, 1873313359);
                G = md5_ii(G, J, I, H, K[C + 15], 10, -30611744);
                H = md5_ii(H, G, J, I, K[C + 6], 15, -1560198380);
                I = md5_ii(I, H, G, J, K[C + 13], 21, 1309151649);
                J = md5_ii(J, I, H, G, K[C + 4], 6, -145523070);
                G = md5_ii(G, J, I, H, K[C + 11], 10, -1120210379);
                H = md5_ii(H, G, J, I, K[C + 2], 15, 718787259);
                I = md5_ii(I, H, G, J, K[C + 9], 21, -343485551);
                J = this.safe_add(J, E);
                I = this.safe_add(I, D);
                H = this.safe_add(H, B);
                G = this.safe_add(G, A);
            }
            return [J, I, H, G];
        },
        md5_cmn: function(F, C, B, A, E, D) {
            return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(C, F), this.safe_add(A, D)), E), B);
        },
        md5_ff: function(C, B, G, F, A, E, D) {
            return this.md5_cmn((B & G) | ((~B) & F), C, B, A, E, D);
        },
        md5_gg: function(C, B, G, F, A, E, D) {
            return this.md5_cmn((B & F) | (G & (~F)), C, B, A, E, D);
        },
        md5_hh: function(C, B, G, F, A, E, D) {
            return this.md5_cmn(B ^ G ^ F, C, B, A, E, D);
        },
        md5_ii: function(C, B, G, F, A, E, D) {
            return this.md5_cmn(G ^ (B | (~F)), C, B, A, E, D);
        },
        safe_add: function(A, D) {
            var C = (A & 65535) + (D & 65535);
            var B = (A >> 16) + (D >> 16) + (C >> 16);
            return (B << 16) | (C & 65535);
        },
        bit_rol: function(A, B) {
            return (A << B) | (A >>> (32 - B));
        },
        binl2hex: function(C) {
            var B = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var D = "";
            for (var A = 0; A < C.length * 4; A++) {
                D += B.charAt((C[A >> 2] >> ((A % 4) * 8 + 4)) & 15) + B.charAt((C[A >> 2] >> ((A % 4) * 8)) & 15);
            }
            return D;
        },
        str2binl: function(D) {
            var C = [];
            var A = (1 << chrsz) - 1;
            for (var B = 0; B < D.length * chrsz; B += chrsz) {
                C[B >> 5] |= (D.charCodeAt(B / chrsz) & A) << (B % 32);
            }
            return C;
        },
        utf8to16: function(I) {
            var D, F, E, G, H, C, B, A, J;
            D = [];
            G = I.length;
            F = E = 0;
            while (F < G) {
                H = I.charCodeAt(F++);
                switch (H >> 4) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        D[E++] = I.charAt(F - 1);
                        break;
                    case 12:
                    case 13:
                        C = I.charCodeAt(F++);
                        D[E++] = String.fromCharCode(((H & 31) << 6) | (C & 63));
                        break;
                    case 14:
                        C = I.charCodeAt(F++);
                        B = I.charCodeAt(F++);
                        D[E++] = String.fromCharCode(((H & 15) << 12) | ((C & 63) << 6) | (B & 63));
                        break;
                    case 15:
                        switch (H & 15) {
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                                C = I.charCodeAt(F++);
                                B = I.charCodeAt(F++);
                                A = I.charCodeAt(F++);
                                J = ((H & 7) << 18) | ((C & 63) << 12) | ((B & 63) << 6) | (A & 63) - 65536;
                                if (0 <= J && J <= 1048575) {
                                    D[E] = String.fromCharCode(((J >>> 10) & 1023) | 55296, (J & 1023) | 56320);
                                } else {
                                    D[E] = "?";
                                }
                                break;
                            case 8:
                            case 9:
                            case 10:
                            case 11:
                                F += 4;
                                D[E] = "?";
                                break;
                            case 12:
                            case 13:
                                F += 5;
                                D[E] = "?";
                                break;
                        }
                }
                E++;
            }
            return D.join("");
        },
        s4: function() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        },
        uuid: function() {
            var s4 = this.s4;
            return s4() + s4() + s4() + s4() +
                s4() + s4() + s4() + s4();
        }
    };

    module.exports = math;
})();
},{}],10:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * dialog.js
 *
 * We attempt to show a login dialog in HTML.
 *
 * changelog
 * 2014-06-04[23:14:19]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
(function(window, document, undefined) {
  "use strict";

  var PassportSC = require('../core');
  var UTILS = require('../utils');
  var console = require('../console');

  //var IE6 = UTILS.getIEVersion() == '6';

  var WRAPPER_ID = 'sogou-passport-pop';
  var FORM_ID = 'sogou-passport-form';
  var USER_ID = 'sogou-passport-user';
  var PASS_ID = 'sogou-passport-pass';
  var AUTO_ID = 'sogou-passport-auto';
  var ERROR_ID = 'sogou-passport-error';

  var DEFAULT_HTML = '' +
    '<div class="sogou-passport-caption">搜狗帐号登录</div>' +
    '<form id="' + FORM_ID + '" action="#" autocomplete="off" type="post">' +
    '<div id="sogou-passport-error" class="sogou-passport-error"></div>' +
    '<div class="sogou-passport-row re">' +
    '<input type="text" class="sogou-passport-input" id="' + USER_ID + '" placeholder="手机/邮箱/用户名"/>' +
    '</div>' +
    '<div class="sogou-passport-row re">' +
    '<input type="password" class="sogou-passport-input" id="' + PASS_ID + '" placeholder="密码"/>' +
    '</div>' +
    '<div class="sogou-passport-row sogou-passport-autologin">' +
    '<input type="checkbox" id="' + AUTO_ID + '"/>' +
    '<label for="sogou-passport-auto">下次自动登录</label>' +
    '<a href="#" class="fr" target="_blank">找回密码</a>' +
    '</div>' +
    '<div class="sogou-passport-row sogou-passport-submitwrapper">' +
    '<input id="sogou-passport-submit" type="submit" value="登录" class="sogou-passport-submit">' +
    '</div>' +
    '</form>';

  var PassportDialog = function(options) {
    var userid;
    this.options = {
      template: DEFAULT_HTML,
      style: null
    };

    UTILS.mixin(this.options, options);

    //FIXME by style
    //preload
    UTILS.dom.addLink('css/skin/default.css');

    var wrapper = this.wrapper = document.createElement('div');
    wrapper.id = wrapper.className = WRAPPER_ID;
    wrapper.innerHTML = this.options.template;
    document.body.appendChild(wrapper);

    this.initEvent();

    if (!!(userid = PassportSC.userid())) {
      UTILS.dom.id(USER_ID).value = userid;
    }

    PassportSC.on('loginfailed', function(e,data) {
      UTILS.dom.id(ERROR_ID).innerHTML = data.msg||'登录失败';
    }).on('loginsuccess', function(e,data) {
      UTILS.dom.id(ERROR_ID).innerHTML = '登录成功';
    }).on('needcaptcha', function(e,data) {
      UTILS.dom.id(ERROR_ID).innerHTML = '需要验证码';
    }).on('3rdlogincomplete', function(e,data) {
      UTILS.dom.id(ERROR_ID).innerHTML = '第三方登录完成';
    });
  };

  PassportDialog.prototype = {
    initEvent: function() {
      var self = this;
      UTILS.dom.bindEvent(UTILS.dom.id(FORM_ID), 'submit', function(e) {
        var dom = UTILS.dom.eventTarget(e);
        UTILS.dom.preventDefault(e);
        console.trace('Passport form submitting');
        self.doPost();
        return false;
      });
    },
    doPost: function() {
      var user$, pass$, auto$;
      var user, pass, auto;
      if (!(user$ = UTILS.dom.id(USER_ID))) {
        console.error('Element[#' + USER_ID + '] does not exist');
        return;
      }
      if (!(pass$ = UTILS.dom.id(PASS_ID))) {
        console.error('Element[#' + PASS_ID + '] does not exist');
        return;
      }
      if (!(auto$ = UTILS.dom.id(AUTO_ID))) {
        console.error('Element[#' + AUTO_ID + '] does not exist');
        return;
      }
      if (!(user = UTILS.trim(user$.value))) {
        console.trace('user empty');
        return;
      }
      if (!(pass = UTILS.trim(pass$.value))) {
        console.trace('user empty');
        return;
      }

      auto = auto$.checked;

      PassportSC.login(user, pass, auto);
    },
    show: function() {
      this.wrapper.style.display = 'block';
    },
    hide: function() {
      this.wrapper.style.display = 'none';
    }
  };

  var gPassportDialog = null;
  /**
   * [pop description]
   * @param  {Object} options
   * @return {this}
   */
  PassportSC.pop = function(options) {

    if (!this.isInitialized()) {
      throw new Error('You have to initialize passport before pop');
    }

    if (!gPassportDialog) {
      gPassportDialog = new PassportDialog(options);
    }
    gPassportDialog.show();
  };

})(window, document);
},{"../console":4,"../core":6,"../utils":12}],11:[function(require,module,exports){
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
        strundefined: typeof undefined,
        strstr: typeof '',
        strobject: typeof {},
        strnumber: typeof 0,
        strfunction: typeof noop,
        isNullOrUndefined: function(obj) {
            return this.isNull(obj) || this.isUndefined(obj);
        },
        isNonNullOrUndefined: function(obj) {
            return !this.isNullOrUndefined(obj);
        },
        isInteger: function(num) {
            return this.isNumber(num) && /^(\-|\+)?\d+?$/i.test(num);
        },
        isNull: function(obj) {
            return null === obj;
        },
        isUndefined: function(obj) {
            return undefined === obj;
        },
        /**
         * Check if obj is a non-null object.
         *
         * @param  {Object}  obj
         * @return {Boolean}
         */
        isPlainObject: function(obj) {
            return this.isObject(obj) && !this.isNull(obj);
        },
        isNonEmptyString: function(obj) {
            return obj && this.isString(obj);
        },
        isHTMLElement: function(obj) {
            return obj && obj.childNodes && obj.tagName && obj.appendChild;
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
        isGeneralizedObject: function(obj) {
            return this.strobject === typeof obj;
        }
    };

    var typeKeys = "Arguments,RegExp,Date,String,Array,Boolean,Function,Number,Object".split(',');

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
    var assertKeys = "Empty,HTMLElement,PlainObject,Undefined,Null,Integer,NullOrUndefined,NonNullOrUndefined,NonEmptyString,GeneralizedObject".split(',');
    for (i = assertKeys.length; i >= 0; --i) {
        type['assert' + assertKeys[i]] = createAssert(assertKeys[i]);
    }

    //As type is required by utils,we cannot use utils.freeze
    module.exports = type;
})();
},{}],12:[function(require,module,exports){
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

            src = src || {};

            type.assertNonNullOrUndefined('dest', dest);

            for (var e in src) {
                if (src.hasOwnProperty && src.hasOwnProperty(e)) {
                    dest[e] = src[e];
                }
            }
            return dest;
        },

        /**
         * Get version of Internet Explorer by user agent.
         * IE 11 supported.
         *
         * @return {Integer} Version in integer.
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

            type.assertNonNullOrUndefined('obj', obj);
            type.assertGeneralizedObject('obj', obj);

            if (type.strundefined !== typeof Object && type.strfunction === typeof Object.freeze) {
                Object.freeze(obj);
            }

            return obj;
        }
    };

    utils.freeze(math);
    utils.freeze(dom);
    utils.freeze(type);
    utils.freeze(array);

    module.exports = utils;
})();
},{"./array":1,"./dom":7,"./math":9,"./type":11}]},{},[1,2,3,4,5,6,7,8,9,11,12,10])