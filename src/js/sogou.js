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
 *
 * @author yanni4night@gmail.com
 * @version 0.1.3
 * @since 0.1.0
 */
var UTILS = require('./utils');
var CODES = require('./codes');
(function(window, document, undefined) {
    "use strict";

    var FILE_NAME = 'sogou.js';
    var EXPANDO = "sogou-passport-" + (+new Date());
    var HIDDEN_CSS = 'width：1px;height:1px;position:absolute;left:-100000px;';

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

    var console = window.console;

    if (strundefined === typeof console) {
        console = {};
    }
    (function() {
        var keys = 'trace,info,log,debug,warn,error'.split(','),
            i;
        for (i = keys.length - 1; i >= 0; i--) {
            console[keys[i]] = console[keys[i]] || noop;
        }
    })();
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
    }, {
        name: ['onLoginSuccess', 'onLoginFailed', 'onLogoutSuccess'],
        validate: function(name, value) {
            return strfunction === typeof value;
        },
        errmsg: function(name, value) {
            return '"' + name + '" SHOULD to be a function';
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
            this.mHTMLContainer.innerHTML = _passhtml.replace(/<%=(\w+?)%>/g, function(k,n) {
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
                self.opt.onLogoutSuccess();
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
                this.opt.onLoginFailed(data);
            } else if (0 === +data.status) {
                this.opt.onLoginSuccess(data);
            }
            /* else if (+data.status === 20231) {
                location.href = FIXED_URLS.active + '?email=' + encodeURIComponent(this._currentUname) + '&client_id=' + this.opt.appid + '&ru=' + encodeURIComponent(location.href);
            }*/
            else if (+data.needcaptcha) {
                data.captchaimg = FIXED_URLS.captcha + '?token=' + this.opt._token + '&t=' + (+new Date());
                this.opt.onLoginFailed(data);
            } else {
                for (e in CODES) {
                    if (CODES[e].code == data.status) {
                        data.msg = CODES[e].info;
                        break;
                    }
                }
                data.msg = data.msg || "Unknown error";
                this.opt.onLoginFailed(data);
            }
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
    var PassportSC = {
        version: '@version@', //from 'package.json'
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
        }
    };
    //Sync loading supported
    if (window.PassportSC && strobject === typeof window.PassportSC) {
        UTILS.mixin(window.PassportSC, PassportSC);
        if (strfunction === typeof window.PassportSC.onApiLoaded)
            window.PassportSC.onApiLoaded();
    } else {
        window.PassportSC = PassportSC;
    }

})(window, document);