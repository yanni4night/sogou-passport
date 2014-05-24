/**
 * Copyright (C) 2014 yanni4night.com sogou.com
 *
 * sogou.js
 *
 * Passport for sogou.com Ltd.
 *
 * changelog
 * 2014-05-24[20:43:42]:authorized
 *
 * TODO:return code matching.
 *
 * @info yinyong,osx-x64,UTF-8,192.168.1.101,js,/Volumes/yinyong/sogou-passport-fe/static/js
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
var UTILS = require('./utils');
var CODES = require('./codes');
(function(window, document, undefined) {
    "use strict";
    var console = window.console;
    var noop = function() {};

    var strundefined = typeof undefined;
    var strstr = typeof '';
    var strobject = typeof {};
    var strnumber = typeof 0;
    var strfunction = typeof noop;

    if (strundefined === typeof console) {
        console = {
            trace: noop,
            info: noop,
            log: noop,
            debug: noop,
            warn: noop,
            error: noop
        };
    }

    var _passhtml = '<form method="post" action="https://account.sogou.com/web/login" target="_PassportIframe">' + '<input type="hidden" name="username" value="<%=username%>">' + '<input type="hidden" name="password" value="<%=password%>">' + '<input type="hidden" name="captcha" value="<%=vcode%>">' + '<input type="hidden" name="autoLogin" value="<%=autoLogin%>">' + '<input type="hidden" name="client_id" value="<%=appid%>">' + '<input type="hidden" name="xd" value="<%=redirectUrl%>">' + '<input type="hidden" name="token" value="<%=token%>"></form>' + '<iframe id="_PassportIframe" name="_PassportIframe" src="about:blank" style="width：1px;height:1px;position:absolute;left:-1000px;"></iframe>';

    var defaultOptions = {
        appid: null,
        redirectUrl: null,
        container: null,
        onLoginSuccess: noop,
        onLoginFailed: noop,
        onLogoutSuccess: noop
    };

    //For validations of options in bulk
    var validators = [{
        name: ['appid'],
        validate: function(name, value) {
            return value && (strstr === typeof value || strnumber === typeof value);
        },
        errmsg: function(name, value) {
            return '"' + name + '" SHOULD be set as a string or a number';
        }
    }, {
        name: ['redirectUrl'],
        validate: function(name, value) {
            return value && strstr === typeof value && new RegExp('^' + location.protocol + "//" + location.host, 'i').test(value);
        },
        errmsg: function(name, value) {
            return '"' + name + '" SHOULD be set as a URL which has the some domain as the current page';
        }
    }, {
        name: ['container'],
        validate: function(name, value) {
            return value && strobject === typeof value && value.appendChild && strstr === typeof value.innerHTML && !value.childNodes.length;
        },
        errmsg: function(name, value) {
            return '"' + name + '" SHOULD to be an empty HTMLElement';
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

    function Passport(options) {
        var i, j, validator, name;
        //This constructor will be called less then twice,
        //whatever even 'defaultOptions' changed...
        var opt = this.opt = defaultOptions;

        if (!options || strobject !== typeof options) {
            throw new Error('"options" MUST be set as a plain object');
        }

        UTILS.mixin(opt, options);

        for (i = validators.length - 1; i >= 0; --i) {
            validator = validators[i];
            for (j = validator.name.length - 1; j >= 0; --j) {
                name = validator.name[j];
                if (!validator.validate(name, opt[name])) {
                    throw new Error(strfunction === typeof validator.errmsg ?
                        validator.errmsg(name, opt[name]) : validator.errmsg
                    );
                }
            }
        }

        opt._token = UTILS.uuid();
    }

    Passport.prototype = {
        login: function(username, password, vcode, autoLogin) {
            var payload;

            if (arguments.length < 4) {
                autoLogin = vcode;
                vcode = '';
            }

            //FIXME
            this._currentUname = username;

            payload = {
                username: username,
                password: password,
                vcode: vcode,
                autoLogin: +(!!autoLogin),
                appid: this.opt.appid,
                redirectUrl: this.opt.redirectUrl,
                token: this.opt._token
            };

            this.opt.container.innerHTML = _passhtml.replace(/<%=(\w+?)%>/g, function(key) {
                return undefined === payload[RegExp.$1] ? "" : payload[RegExp.$1];
            });

            this.opt.container.getElementsByTagName('form')[0].submit();
        },
        logout: function() {
            var self = this;
            var url = 'https://account.sogou.com/web/logout_js?client_id=' + this.opt.appid;
            UTILS.addIframe(this.opt.container, url, function() {
                self.onLogoutSuccess();
            });
        },
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
        _parsePassportCookie: function(F) {
            var J = 0;
            var C = F.indexOf(":", J);
            var D;
            var B;
            var A;
            var I;
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

        },
        /**
         * [loginCallback description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        loginCallback: function(data) {
            if (!data || strobject !== typeof data) {
                console.error('Nothing callback received');
                this.opt.onLoginFailed(data);
            } else if (0 === +data.status) {
                this.opt.onLogoutSuccess(data);
            } else if (+data.status === 20231) {
                location.href = 'https://account.sogou.com/web/remindActivate?email=' + encodeURIComponent(this._currentUname) + '&client_id=' + this.opt.appid + '&ru=' + encodeURIComponent(location.href);
            } else if (+data.needcaptcha) {
                data.captchaimg = 'https://account.sogou.com/captcha?token=' + this.opt._token + '&t=' + (+new Date());
                this.opt.onLoginFailed(data);
            } else {
                this.opt.onLoginFailed(data);
            }
        }
    };

    //Singleton inner object
    var gPassport = null;
    var NOT_INITIALIZED_ERROR = 'Passport has not been initialized yet';

    //Expose few interfaces
    var PassportSC = {
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