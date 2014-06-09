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
        version: '@version@', //see 'package.json'
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
            UTILS.hideSource(e,PassportSC[e]);
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

    module.exports = {
        PassportSC: PassportSC,
        addSupportedEvent: function(name, val) {
            type.assertNonEmptyString('name', name);
            type.assertNonEmptyString('val', val);
            EVENTS[name] = val;
            return EVENTS;
        },
        addFixedUrl: function(name, url) {
            type.assertNonEmptyString('name', name);
            type.assertNonEmptyString('url', url);
            FIXED_URLS[name] = url;
            return FIXED_URLS;
        }
    };
})(window, document);