(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * array.js
 *
 * changelog
 * 2014-06-06[14:11:09]:authorized
 *
 * @info yinyong,osx-x64,UTF-8,10.129.169.219,js,/Volumes/yinyong/passport/src/js
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
(function() {
  "use strict";
  var UTILS = require('./utils');
  var array = {};

  /**
   * [indexOf description]
   * @param  {Array} arr
   * @param  {Object} ele
   * @param  {Integer} fromIndex
   * @return {Boolean}
   */
  array.indexOf = function(arr, ele, fromIndex) {
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
      for (var i = fromIndex, len = arr.length; i < len; ++i) {
        if (ele === arr[i]) {
          return i;
        }
      }
    }

    return -1;
  };

  /**
   * [forEach description]
   * @param  {Array} arr
   * @param  {Function} callbackfn
   * @param  {Object} thisArg
   * @return {Undefined}
   */
  array.forEach = function(arr, callbackfn, thisArg) {
    if (!UTILS.isFunction(callbackfn)) return;

    if (Array.prototype.forEach) {
      return Array.prototype.forEach.call(arr, callbackfn, thisArg);
    }

    for (var i = 0, len = arr.length; i < len; ++i) {
      callbackfn.call(thisArg, arr[i], i, arr);
    }

  };
  /**
   * [every description]
   * @param  {Array} arr
   * @param  {Function} func
   * @return {Boolean}
   */
  array.each = array.every = function(arr, callbackfn, thisArg) {
    if (!arr || !UTILS.isFunction(callbackfn)) {
      return false;
    }

    //ES5
    if (Array.prototype.every) {
      return Array.prototype.every.call(arr, callbackfn, thisArg);
    } else {
      for (var i = 0, len = arr.length; i < len; ++i) {
        if (!callbackfn.call(thisArg, arr[i], i, arr)) {
          return false;
        }
      }
    }

    return true;
  };

  /**
   * [some description]
   * @param  {Array} arr
   * @param  {Function} callbackfn
   * @param  {Object} thisArg
   * @return {Boolean}
   */
  array.some = function(arr, callbackfn, thisArg) {
    if (!arr || !UTILS.isFunction(callbackfn)) {
      return false;
    }

    //ES5
    if (Array.prototype.some) {
      return Array.prototype.some.call(arr, callbackfn, thisArg);
    } else {
      for (var i = 0, len = arr.length; i < len; ++i) {
        if (true === callbackfn.call(thisArg, arr[i], i, arr)) {
          return true;
        }
      }
    }

    return false;
  };

  /**
   * [filter description]
   * @param  {Array} arr
   * @param  {Function} callbackfn
   * @param  {Object} thisArg
   * @return {Array}
   */
  array.filter = function(arr, callbackfn, thisArg) {
    if (!arr || arguments.length < 2) {
      return arr;
    }

    if (Array.prototype.filter) {
      return Array.prototype.filter.call(arr, callbackfn, thisArg);
    }

    var ret = [];
    array.forEach(arr, function(val, index) {
      if (callbackfn.call(thisArg, val, index, arr)) {
        ret.push(val);
      }
    });
    return ret;
  };
  module.exports = array;
})();
},{"./utils":7}],2:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * codes.js
 *
 * changelog
 * 2014-05-24[23:06:47]:authorized
 *
 * @info yinyong,osx-x64,UTF-8,192.168.1.101,js,/Volumes/yinyong/sogou-passport-fe/static/js
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function(window, document, undefined) {
    "use strict";
    module.exports = {
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
})(window, document);
},{}],3:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * console.js
 *
 * changelog
 * 2014-06-06[11:43:57]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
var console = window.console;
var noop = function() {};

if (!console || 'object' !== typeof console) {
    console = {};
}

var keys = 'trace,info,log,debug,warn,error'.split(',');

for (var i = keys.length - 1; i >= 0; i--) {
    console[keys[i]] = console[keys[i]] || noop;
}

module.exports = console;
},{}],4:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com sogou.com
 *
 * sogou.js
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
 * 2014-06-04[16:37:06]:disabled remindActive action
 * 2014-06-06[11:18:50]:getOptions&isInitialized added
 *
 * @author yanni4night@gmail.com
 * @version 0.1.4
 * @since 0.1.0
 */

(function(window, document, undefined) {
    "use strict";
    var UTILS = require('./utils');
    var CODES = require('./codes');
    var console = require('./console');
    var Event = require('./event');

    var FILE_NAME = 'sogou.js';
    var EXPANDO = "sogou-passport-" + (+new Date());
    var HIDDEN_CSS = 'width：1px;height:1px;position:absolute;left:-100000px;';

    var EVENTS = {
        LOGINSUCCESS: 'loginsuccess',
        LOGINFAILED: 'loginfailed',
        LOGOUTSUCCESS: 'logoutsuccess'
    };

    var FIXED_URLS = {
        login: 'https://account.sogou.com/web/login',
        logout: 'https://account.sogou.com/web/logout_js',
        //active: 'https://account.sogou.com/web/remindActivate',
        captcha: 'https://account.sogou.com/captcha'
    };

    var noop = function() {};
    var strundefined = typeof undefined;
    var strstr = typeof '';
    var strobject = typeof {};
    var strnumber = typeof 0;
    var strfunction = typeof noop;

    if (!window || !document || !document.documentElement || 'HTML' !== document.documentElement.nodeName) {
        throw new Error(FILE_NAME + ' is only for HTML document');
    }

    var _passhtml = '<form method="post" action="' + FIXED_URLS.login + '" target="' + EXPANDO + '">' + '<input type="hidden" name="username" value="<%=username%>">' + '<input type="hidden" name="password" value="<%=password%>">' + '<input type="hidden" name="captcha" value="<%=vcode%>">' + '<input type="hidden" name="autoLogin" value="<%=autoLogin%>">' + '<input type="hidden" name="client_id" value="<%=appid%>">' + '<input type="hidden" name="xd" value="<%=redirectUrl%>">' + '<input type="hidden" name="token" value="<%=token%>"></form>' + '<iframe name="' + EXPANDO + '" src="about:blank" style="' + HIDDEN_CSS + '"></iframe>';

    var defaultOptions = {
        appid: null,
        redirectUrl: null,
        onLoginSuccess: noop,
        onLoginFailed: noop,
        onLogoutSuccess: noop
    };

    //Singleton inner object
    var gPassport = null;
    var NOT_INITIALIZED_ERROR = 'Passport has not been initialized yet';

    //For validations of options in bulk
    var VALIDATORS = [{
        name: ['appid'],
        validate: function(name, value) {
            return value && (strstr === typeof value || strnumber === typeof value);
        },
        errmsg: function(name, value) {
            return '"' + name + '" SHOULD be a string or a number';
        }
    }, {
        name: ['redirectUrl'],
        validate: function(name, value) {
            return value && strstr === typeof value && new RegExp('^' + location.protocol + "//" + location.host, 'i').test(value);
        },
        errmsg: function(name, value) {
            return '"' + name + '" SHOULD be a URL which has the some domain as the current page';
        }
    }];

    /**
     * This is the inner PASSPORT constructor.
     * As the instance could not be more then one,
     * it may be called only once.
     *
     * @param {Object} options
     */
    function Passport(options) {
        var i, j, validator, name, opt;
        //This constructor will be called less then twice,
        //whatever even 'defaultOptions' changed...
        opt = this.opt = defaultOptions;

        if (!options || strobject !== typeof options) {
            throw new Error('"options" MUST be a plain object');
        }

        UTILS.mixin(opt, options);

        for (i = VALIDATORS.length - 1; i >= 0; --i) {
            validator = VALIDATORS[i];
            for (j = validator.name.length - 1; j >= 0; --j) {
                name = validator.name[j];
                if (!validator.validate(name, opt[name])) {
                    throw new Error(strfunction === typeof validator.errmsg ?
                        validator.errmsg(name, opt[name]) : validator.errmsg
                    );
                }
            }
        }
        //DON'T FORGET IT
        opt._token = UTILS.uuid();

        UTILS.mixin(this, new Event());
    }

    Passport.prototype = {
        /**
         * Do login action.
         *
         * @param  {String} username
         * @param  {String} password
         * @param  {String} vcode
         * @param  {Boolean} autoLogin
         */
        login: function(username, password, vcode, autoLogin) {
            var payload;

            if (arguments.length < 4) {
                autoLogin = vcode;
                vcode = '';
            }

            //this._currentUname = username;

            payload = {
                username: username,
                password: password,
                vcode: vcode,
                autoLogin: +(!!autoLogin),
                appid: this.opt.appid,
                redirectUrl: this.opt.redirectUrl,
                token: this.opt._token
            };

            this._assertContainer();
            this.mHTMLContainer.innerHTML = _passhtml.replace(/<%=(\w+?)%>/g, function(k, n) {
                var key = payload[n];
                return undefined === key ? "" : key;
            });

            this.mHTMLContainer.getElementsByTagName('form')[0].submit();
        },
        /**
         * Do logout action.It's an async function.
         */
        logout: function() {
            var self = this;
            var url = FIXED_URLS.logout + '?client_id=' + self.opt.appid;
            self._assertContainer();
            UTILS.addIframe(this.mHTMLContainer, url, function() {
                self.emit(EVENTS.LOGOUTSUCCESS);
            });
        },
        /**
         * Callback with result from iframe.
         * @param  {Object} data Should inclding status&needcaptcha at least
         */
        loginCallback: function(data) {
            var e;
            if (!data || strobject !== typeof data) {
                console.error('Nothing callback received');
                //this.opt.onLoginFailed(data);
                this.emit(EVENTS.LOGINFAILED, data);
            } else if (0 === +data.status) {
                //this.opt.onLoginSuccess(data);
                this.emit(EVENTS.LOGINSUCCESS, data);
            }
            /* else if (+data.status === 20231) {
                location.href = FIXED_URLS.active + '?email=' + encodeURIComponent(this._currentUname) + '&client_id=' + this.opt.appid + '&ru=' + encodeURIComponent(location.href);
            }*/
            else if (+data.needcaptcha) {
                data.captchaimg = FIXED_URLS.captcha + '?token=' + this.opt._token + '&t=' + (+new Date());
                //this.opt.onLoginFailed(data);
                this.emit(EVENTS.LOGINFAILED, data);
            } else {
                for (e in CODES) {
                    if (CODES[e].code == data.status) {
                        data.msg = CODES[e].info;
                        break;
                    }
                }
                data.msg = data.msg || "Unknown error";
                //this.opt.onLoginFailed(data);
                this.emit(EVENTS.LOGINFAILED, data);
            }
        },
        getOptions: function() {
            return this.opt;
        },
        /**
         * Assert mHTMLContainer,create it if not exists.
         * @return {HTMLElement} mHTMLContainer
         */
        _assertContainer: function() {
            var container = this.mHTMLContainer;
            if (!container || (strobject !== typeof container) || (strundefined === typeof container.appendChild) || !container.parentNode) {
                container = this.mHTMLContainer = document.createElement('div');
                container.style.cssText = HIDDEN_CSS;
                container.className = container.id = EXPANDO;
                document.body.appendChild(container);
            }

            return container;
        },
        /**
         * Legacy function,DO NOT MODIFY.
         */
        parserRelation: function() {
            var B = this.cookie.relation;
            if (strstr === typeof B && B.length > 0) {
                var A = B.split(";");
                for (var F = 0; F < A.length; F++) {
                    var D = A[F].split(",");
                    var E = D[2].split("#");
                    for (var C = 0; C < E.length; C++) {
                        if (this.opt.appid == E[C]) {
                            return D[0];
                        }
                    }
                }
            }
            return "";
        },
        /**
         * Legacy function,DO NOT MODIFY.
         */
        parsePassportCookie: function() {
            var C;
            var E = document.cookie.split("; ");
            for (var D = 0; D < E.length; D++) {
                if (E[D].indexOf("ppinf=") === 0) {
                    C = E[D].substr(6);
                    break;
                }
                if (E[D].indexOf("ppinfo=") === 0) {
                    C = E[D].substr(7);
                    break;
                }
                if (E[D].indexOf("passport=") === 0) {
                    C = E[D].substr(9);
                    break;
                }
            }
            if (D == E.length) {
                this.cookie = false;
                return;
            }
            try {
                var A = unescape(C).split("|");
                if (A[0] == "1" || A[0] == "2") {
                    var B = UTILS.utf8to16(UTILS.b64_decodex(A[3]));
                    this._parsePassportCookie(B);
                    return;
                }
            } catch (F) {}
        },
        /**
         * Legacy function,DO NOT MODIFY.
         */
        _parsePassportCookie: function(F) {
            var J = 0,
                D, B, A, I, lenEnd_offset;
            var C = F.indexOf(":", J);
            this.cookie = {};
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
            relation_userid = this.parserRelation();
            if (strstr === typeof relation_userid && relation_userid.length > 0) {
                this.cookie[B] = relation_userid;
            }
            try {
                this.cookie.service = {};
                var H = this.cookie.service;
                H.mail = 0;
                H.alumni = 0;
                H.chinaren = 0;
                H.blog = 0;
                H.pp = 0;
                H.club = 0;
                H.crclub = 0;
                H.group = 0;
                H.say = 0;
                H.music = 0;
                H.focus = 0;
                H["17173"] = 0;
                H.vip = 0;
                H.rpggame = 0;
                H.pinyin = 0;
                H.relaxgame = 0;
                var G = this.cookie.serviceuse;
                if (G.charAt(0) == 1) {
                    H.mail = "sohu";
                } else {
                    if (G.charAt(2) == 1) {
                        H.mail = "sogou";
                    } else {
                        if (this.cookie.userid.indexOf("@chinaren.com") > 0) {
                            H.mail = "chinaren";
                        }
                    }
                } if (G.charAt(1) == 1) {
                    H.alumni = 1;
                }
                if (G.charAt(3) == 1) {
                    H.blog = 1;
                }
                if (G.charAt(4) == 1) {
                    H.pp = 1;
                }
                if (G.charAt(5) == 1) {
                    H.club = 1;
                }
                if (G.charAt(7) == 1) {
                    H.crclub = 1;
                }
                if (G.charAt(8) == 1) {
                    H.group = 1;
                }
                if (G.charAt(10) == 1) {
                    H.music = 1;
                }
                if (G.charAt(11) == 1 || this.cookie.userid.lastIndexOf("@focus.cn") > 0) {
                    H.focus = 1;
                }
                if (G.charAt(12) == 1 || this.cookie.userid.indexOf("@17173.com") > 0) {
                    H["17173"] = 1;
                }
                if (G.charAt(13) == 1) {
                    H.vip = 1;
                }
                if (G.charAt(14) == 1) {
                    H.rpggame = 1;
                }
                if (G.charAt(15) == 1) {
                    H.pinyin = 1;
                }
                if (G.charAt(16) == 1) {
                    H.relaxgame = 1;
                }
            } catch (E) {}
        },
        /**
         * Legacy function,DO NOT MODIFY.
         */
        parseCookie: function() {
            var cookie = document.cookie.split("; ");
            var result;
            for (var i = 0, l = cookie.length; i < l; i++) {
                if (cookie[i].indexOf("ppinf=") === 0) {
                    result = cookie[i].substr(6);
                    break;
                }
                if (cookie[i].indexOf("ppinfo=") === 0) {
                    result = cookie[i].substr(7);
                    break;
                }
                if (cookie[i].indexOf("passport=") === 0) {
                    result = cookie[i].substr(9);
                    break;
                }
            }
            if (!result) {
                return null;
            }
            try {
                result = unescape(result).split("|");
                if (result[0] == "1" || result[0] == "2") {
                    result = UTILS.utf8to16(UTILS.b64_decodex(result[3]));
                    this.parsePassportCookie(result);
                    return;
                }
            } catch (F) {}

        }
    };

    //Expose few interfaces
    var PassportProxy = {
        version: '0.1.3', //from 'package.json'
        /**
         * Initialize.
         * This must be called at first before
         * any other operations.
         *
         * The following options must be set in options:
         * 1.appid -- Integer of ID,it depends on the product line;
         * 2.redirectUrl -- A same domain page url for cross-domain;
         * 3.container -- An empty HTML element,hidden usually
         *
         * @param  {Obejct} options Required options
         * @return {Object} this
         */
        init: function(options) {
            if (!gPassport) {
                console.trace('Initialize passport');
                gPassport = new Passport(options);
                gPassport.on([EVENTS.LOGINSUCCESS, EVENTS.LOGINFAILED, EVENTS.LOGOUTSUCCESS].join(' '), function(evt, data) {
                    PassportProxy.emit(evt.type, data);
                });
            } else {
                console.warn('Passport has already been initialized');
            }

            return this;
        },
        /**
         * Do login
         * @return {Object} this
         * @throws {Error} If not initialized
         */
        login: function() {
            if (!gPassport) {
                throw new Error(NOT_INITIALIZED_ERROR);
            }
            console.trace('logining with:' + Array.prototype.join.call(arguments));
            gPassport.login.apply(gPassport, arguments);
            return this;
        },
        /**
         * Do logout.
         * @return {Object} this
         * @throws {Error} If not initialized
         */
        logout: function() {
            if (!gPassport) {
                throw new Error(NOT_INITIALIZED_ERROR);
            }
            console.trace('logouting');
            gPassport.logout.apply(gPassport, arguments);
            return this;
        },
        /**
         * Get userid from cookie
         * @return {String} userid or empty string
         * @throws {Error} If not initialized
         */
        userid: function() {
            if (!gPassport) {
                throw new Error(NOT_INITIALIZED_ERROR);
            }
            gPassport.parsePassportCookie();
            return gPassport.cookie.userid || "";
        },
        /**
         * Login callback from iframe.
         * DO NOT call it directly.
         *
         * @param  {Object} data login result
         */
        _logincb: function(data) {
            if (gPassport) {
                gPassport.loginCallback(data);
            } else {
                console.trace('Login callback received but [Passport] has not been initialized');
            }
        },
        isInitialized: function() {
            return !!gPassport;
        },
        getOptions: function() {
            return gPassport.getOptions();
        },
        getSupportedEvents: function() {
            return EVENTS;
        }
    };

    UTILS.mixin(PassportProxy, new Event());

    //Sync loading supported
    if (window.PassportSC && strobject === typeof window.PassportSC) {
        UTILS.mixin(window.PassportSC, PassportProxy);
        if (strfunction === typeof window.PassportSC.onApiLoaded)
            window.PassportSC.onApiLoaded();
    } else {
        window.PassportSC = PassportProxy;
    }

    module.exports = PassportProxy;
})(window, document);
},{"./codes":2,"./console":3,"./event":5,"./utils":7}],5:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * event.js
 *
 * changelog
 * 2014-06-06[14:02:08]:authorized
 *
 * @info yinyong,osx-x64,UTF-8,10.129.169.219,js,/Volumes/yinyong/passport/src/js
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function() {
    "use strict";
    
    var UTILS = require('./utils');
    var console = require('./console');
    var array = require('./array');

    var EVT_TYPE_ERR = '"event" has to be a string';
    var FUN_TYPE_ERR = '"func" has to be a function';

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

            if (!UTILS.isString(event)) {
                throw new Error(EVT_TYPE_ERR);
            }
            if (!UTILS.isFunction(func)) {
                throw new Error(FUN_TYPE_ERR);
            }

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
         * remove event,multiple events split by space supported.
         * @param  {String} event
         * @param  {Function} func
         * @return {EventEmitter}     This event emitter
         */
        this.off = function(event, func) {
            var evtArr, objs;

            if (!UTILS.isString(event)) {
                throw new Error(EVT_TYPE_ERR);
            }
            if (func && !UTILS.isFunction(func)) {
                throw new Error(FUN_TYPE_ERR);
            }
            evtArr = UTILS.trim(event).split(/\s/);
            array.forEach(evtArr, function(evt) {
                if (!func) {
                    delete listeners[evt];
                    return this;
                } else {
                    objs = listeners[evt];
                    if (UTILS.isArray(objs)) {
                        listeners[evt] = array.filter(objs, function(obj) {
                            return obj.func !== func;
                        });
                    }
                }
            });


            return this;
        };

        /**
         * Emit events,multiple events split by space supported
         * @param  {String} event
         * @param  {Object} data
         * @return {EventEmitter}
         */
        this.emit = function(event, data) {
            var evtArr, objs;

            if (!UTILS.isString(event)) {
                throw new Error(EVT_TYPE_ERR);
            }

            evtArr = UTILS.trim(event).split(/\s/);

            array.forEach(evtArr, function(evt) {
                objs = listeners[evt];
                if (UTILS.isArray(objs)) {
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
},{"./array":1,"./console":3,"./utils":7}],6:[function(require,module,exports){
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

  var IE6 = UTILS.getIEVersion() == '6';

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
    this.options = {
      template: DEFAULT_HTML,
      style: null
    };

    UTILS.mixin(this.options, options);

    //FIXME by style
    //preload
    UTILS.insertLink('css/skin/default.css');

    var wrapper = this.wrapper = document.createElement('div');
    wrapper.id = wrapper.className = WRAPPER_ID;
    wrapper.innerHTML = this.options.template;
    document.body.appendChild(wrapper);

    this.initEvent();

    PassportSC.on('loginfailed',function(e){
      UTILS.id(ERROR_ID).innerHTML = '登录失败';
    }).on('loginsuccess',function(e){
      UTILS.id(ERROR_ID).innerHTML = '登录成功';
    });
  };

  PassportDialog.prototype = {
    initEvent: function() {
      var self = this;
      UTILS.bindEvent(document, 'submit', function(e) {
        var dom = UTILS.eventTarget(e);
        if (dom && dom.id === FORM_ID) {
          UTILS.preventDefault(e);
          console.trace('Passport form submitting');
          self.doPost();
        }
      });
    },
    doPost:function(){
      var user$, pass$, auto$;
      var user,pass,auto;
      if (!(user$ = UTILS.id(USER_ID))) {
        console.error('Element[#' + USER_ID + '] does not exist');
        return;
      }
      if (!(pass$ = UTILS.id(PASS_ID))) {
        console.error('Element[#' + PASS_ID + '] does not exist');
        return;
      }
      if (!(auto$ = UTILS.id(AUTO_ID))) {
        console.error('Element[#' + AUTO_ID + '] does not exist');
        return;
      }
      if(!(user = UTILS.trim(user$.value))){
        console.trace('user empty');
        return;
      }
      if(!(pass = UTILS.trim(pass$.value))){
        console.trace('user empty');
        return;
      }

      auto = auto$.checked;

      PassportSC.login(user,pass,auto);
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
},{"../console":3,"../core":4,"../utils":7}],7:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * utils.js
 *
 * changelog
 * 2014-05-24[23:06:31]:authorized
 * 2014-06-06[09:23:53]:getIEVersion
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */
(function(window, document, undefined) {
    "use strict";

    var hexcase = 0;
    var chrsz = 8;

    var utils = {
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
        addIframe: function(container, url, callback) {
            var iframe = window.document.createElement('iframe');
            iframe.style.height = '1px';
            iframe.style.width = '1px';
            iframe.style.visibility = 'hidden';
            iframe.src = url;

            if (iframe.attachEvent) {
                iframe.attachEvent("onload", function() {
                    if ('function' === typeof callback) callback();
                });
            } else {
                iframe.onload = function() {
                    if ('function' === typeof callback) callback();
                };
            }

            container.appendChild(iframe);
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
        },
        isArray: function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
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
        insertLink: function(src) {
            if (!src || 'string' !== typeof src) {
                return null;
            }
            var link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');
            link.setAttribute('href', src);
            document.getElementsByTagName('head')[0].appendChild(link);
            return link;
        },
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
        bindEvent: function(dom, evt, func) {
            if (document.addEventListener) {
                dom.addEventListener(evt, func, false);
            } else if (document.attachEvent) {
                dom.attachEvent('on' + evt, func);
            }
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
        id: function(id) {
            return document.getElementById(id);
        },
        trim: function(str) {
            if (!this.isString(str)) {
                return str;
            } else if (String.prototype.trim) {
                return str.trim();
            } else {
                return str.replace(/(^\s+)|(\s+$)/mg, '');
            }
        }
    };
    //is***
    var types = ['Arguments', 'RegExp', 'Date', 'String', 'Array', 'Boolean', 'Function', 'Number'];
    var createIs = function(type) {
        return function(variable) {
            return '[object ' + type + ']' === ({}).toString.apply(variable);
        };
    };
    for (var i = types.length - 1; i >= 0; --i) {
        utils['is' + types[i]] = createIs(types[i]);
    }
    module.exports = utils;
})(window, document);
},{}]},{},[1,2,3,4,5,6,7])