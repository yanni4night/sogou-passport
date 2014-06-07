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
 *
 * @author yanni4night@gmail.com
 * @version 0.1.5
 * @since 0.1.0
 */

(function(window, document, undefined) {
    "use strict";

    var UTILS = require('./utils');
    var CODES = require('./codes');
    var console = require('./console');
    var Event = require('./event');
    var type = require('./type');
    var PassportCookieParser = require('./cookie').PassportCookieParser;

    var EXPANDO = "sogou-passport-" + (+new Date());
    var HIDDEN_CSS = 'width:1px;height:1px;position:absolute;left:-100000px;';

    var EVENTS = {
        LOGINSUCCESS: 'loginsuccess',
        LOGINFAILED: 'loginfailed',
        LOGOUTSUCCESS: 'logoutsuccess',
        NEEDCAPTCHA: 'needcaptcha'
    };

    var FIXED_URLS = {
        login: 'https://account.sogou.com/web/login',
        logout: 'https://account.sogou.com/web/logout_js',
        //active: 'https://account.sogou.com/web/remindActivate',
        captcha: 'https://account.sogou.com/captcha'
    };

    var _passhtml = '<form method="post" action="' + FIXED_URLS.login + '" target="' + EXPANDO + '">' + '<input type="hidden" name="username" value="<%=username%>">' + '<input type="hidden" name="password" value="<%=password%>">' + '<input type="hidden" name="captcha" value="<%=vcode%>">' + '<input type="hidden" name="autoLogin" value="<%=autoLogin%>">' + '<input type="hidden" name="client_id" value="<%=appid%>">' + '<input type="hidden" name="xd" value="<%=redirectUrl%>">' + '<input type="hidden" name="token" value="<%=token%>"></form>' + '<iframe name="' + EXPANDO + '" src="about:blank" style="' + HIDDEN_CSS + '"></iframe>';

    var defaultOptions = {
        appid: null,
        redirectUrl: null
    };

    //Singleton inner object
    var gPassport = null;
    var NOT_INITIALIZED_ERROR = 'Passport has not been initialized yet';

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

    /**
     * This is the inner PASSPORT constructor.
     * As the instance could not be more then one,
     * it may be called only once.
     *
     * @param {Object} options
     * @class
     */
    function Passport(options) {
        var i, j, validator, name, opt;

        opt = this.opt = {};

        type.assertPlainObject('options',options);

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

        //we make it an event emitter
        UTILS.mixin(this, new Event());
    }

    /**
     * Passport prototype.
     *
     * @class
     */
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

            type.assertNonEmptyString('username',username);
            type.assertNonEmptyString('password',password);

            payload = {
                username: username,
                password: password,
                vcode: vcode || "",
                autoLogin: +(!!autoLogin), //:0/1
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
            UTILS.dom.addIframe(this.mHTMLContainer, url, function() {
                self.emit(EVENTS.LOGOUTSUCCESS);
            });
        },
        /**
         * Callback with result from iframe.
         * @param  {Object} data Should inclding status&needcaptcha at least
         */
        loginCallback: function(data) {
            var e;
            if (!data || type.strobject !== typeof data) {
                console.error('Nothing callback received');
                this.emit(EVENTS.LOGINFAILED, data);
            } else if (0 === +data.status) {
                this.emit(EVENTS.LOGINSUCCESS, data);
            }
            /* else if (+data.status === 20231) {
                location.href = FIXED_URLS.active + '?email=' + encodeURIComponent(this._currentUname) + '&client_id=' + this.opt.appid + '&ru=' + encodeURIComponent(location.href);
            }*/
            else if (+data.needcaptcha) {
                data.captchaimg = FIXED_URLS.captcha + '?token=' + this.opt._token + '&t=' + (+new Date());
                this.emit(EVENTS.NEEDCAPTCHA, data);
            } else {
                for (e in CODES) {
                    if (CODES[e].code == data.status) {
                        data.msg = CODES[e].info;
                        break;
                    }
                }
                data.msg = data.msg || "Unknown error";
                this.emit(EVENTS.LOGINFAILED, data);
            }
        },
        /**
         * Get options.
         *
         * @return {Object}
         */
        getOptions: function() {
            return this.opt;
        },
        /**
         * Assert mHTMLContainer,create it if not exists.
         * @return {HTMLElement} mHTMLContainer
         */
        _assertContainer: function() {
            var container = this.mHTMLContainer;
            if (!container || (type.strobject !== typeof container) || (type.strundefined === typeof container.appendChild) || !container.parentNode) {
                container = this.mHTMLContainer = document.createElement('div');
                container.style.cssText = HIDDEN_CSS;
                container.className = container.id = EXPANDO;
                document.body.appendChild(container);
            }

            return container;
        }
    };

    //Expose few interfaces
    var PassportProxy = {
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
                gPassport.on([EVENTS.LOGINSUCCESS, EVENTS.LOGINFAILED, EVENTS.LOGOUTSUCCESS, EVENTS.NEEDCAPTCHA].join(' '), function(evt, data) {
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
            var cookie = PassportCookieParser.parse();
            return cookie.userid || "";
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
        /**
         * If passport has been initialized.
         *
         * @return {Boolean}
         */
        isInitialized: function() {
            return !!gPassport;
        },
        /**
         * Get a copy of options.
         *
         * @return {Object}
         */
        getOptions: function() {
            var opts = {};
            return UTILS.mixin(opts, gPassport.getOptions());
        },
        /**
         * Get events which passport supports.
         * @return {Object}
         */
        getSupportedEvents: function() {
            return EVENTS;
        }
    };


    //Make proxy an event emitter too.
    UTILS.mixin(PassportProxy, new Event());

    //Sync loading supported
    if (window.PassportSC && type.strobject === typeof window.PassportSC) {
        UTILS.mixin(window.PassportSC, PassportProxy);
        if (strfunction === typeof window.PassportSC.onApiLoaded)
            window.PassportSC.onApiLoaded();
    } else {
        window.PassportSC = PassportProxy;
    }

    module.exports = PassportProxy;
})(window, document);