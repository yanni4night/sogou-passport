/**
 * Copyright (C) 2014 yanni4night.com
 *
 * core.js
 *
 * Passport for sogou.com Ltd.
 
 * This is the core of sogou passport.
 *
 * Compared to previous sogou.js,we removed the
 * HTML dialog part,and export the least number
 * of interfaces.
 *
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
 * 2014-06-10[12:32:02]:get 'msg' from _logincb
 * 2014-06-10[13:30:08]:'param_error'&'notactive' supported
 * 2014-06-10[14:39:15]:merge events into 'login_failed'
 * 2014-06-11[21:52:05]:callback default msg when third party login
 * 2014-06-12[13:24:21]:exports 'getFixedUrl'&'getSupportedEvents'
 * 2014-06-14[12:15:01]:exports utils,add 'setPayload'&'getPayload'
 * 2014-06-24[10:16:46]:add 'getNewCaptcha'
 * 2014-08-08[11:05:06]:initialized plugins here
 * 2014-09-13[01:31:04]:support pc roam checking
 * 2014-09-16[23:59:28]:add 'loginPcroam',rename 'checkPCToken'
 * 2014-10-14[15:48:14]:support third domain login (eg. teemo.cn)
 * 2014-10-15[12:07:28]:support phone number
 * 2014-10-15[20:47:02]:support instant-defined callback for login/login3rd/logout
 * 2014-10-23[22:16:56]:comments
 *
 * @author yanni4night@gmail.com
 * @version 0.2.9
 * @since 0.1.0
 */

"use strict";

var UTILS = require('./utils');
var CODES = require('./codes');
var drawAppendix = require('./appendix/draw');
var statisticAppendix = require('./appendix/statistic');
var pluginAppendix = require('./appendix/plugin');
//These appendixes should be initialized ar last but before merge window.PassportSC

var type = UTILS.type;
var console = UTILS.console;
var XEvent = UTILS.event;

var PassportCookieParser = UTILS.cookie.PassportCookieParser;

var EXPANDO = type.expando;
var HIDDEN_CSS = 'width:1px;height:1px;position:absolute;left:-10000px;display:block;visibility:hidden;';

var EVENTS = {
    login_start: 'loginstart',
    login_success: 'loginsuccess',
    login_failed: 'loginfailed',
    logout_success: 'logoutsuccess',
    third_party_login_complete: '3rdlogincomplete', //popup only
    param_error: 'paramerror',
    pc_roam_success: 'pcroamsuccess',
    pc_roam_failed: 'pcroamfailed'
};

var FIXED_URLS = {
    login: 'https://account.sogou.com/web/login',
    logout: 'https://account.sogou.com/web/logout_js',
    active: 'https://account.sogou.com/web/remindActivate',
    captcha: 'https://account.sogou.com/captcha',
    trdparty: 'http://account.sogou.com/connect/login',
    libprefix: 'http://s.account.sogoucdn.com/u/api',
    pcroam: 'https://account.sogou.com/sso/pc_roam_go' //validate if a cookie or token from PC client is avaliable
};

var THIRD_PARTY_SIZE = {
    size: {
        renren: [880, 620],
        sina: [780, 640],
        qq: [500, 300]
    }
};

var e; //for element
var gLastLoginName; //for not active

var gPayload = {};

var gAppendixes = [drawAppendix, statisticAppendix, pluginAppendix];

var expandoLogin = EXPANDO + '_login';
var expandoRoam = EXPANDO + '_roam';
var expandoRoamLogin = EXPANDO + '_roam_login';

var HTML_FRAME_LOGIN = '<form method="post" action="' + FIXED_URLS.login + '" target="' + expandoLogin + '">' + '<input type="hidden" name="username" value="<%=username%>">' + '<input type="hidden" name="password" value="<%=password%>">' + '<input type="hidden" name="captcha" value="<%=vcode%>">' + '<input type="hidden" name="autoLogin" value="<%=autoLogin%>">' + '<input type="hidden" name="client_id" value="<%=appid%>">' + '<input type="hidden" name="domain" value="<%=domain%>">' + '<input type="hidden" name="xd" value="<%=redirectUrl%>">' + '<input type="hidden" name="token" value="<%=token%>"></form>' + '<iframe name="' + expandoLogin + '" src="about:blank" style="' + HIDDEN_CSS + '"></iframe>';
var HTML_PC_ROAM = '<form method="post" action="' + FIXED_URLS.pcroam + '" target="' + expandoRoam + '">' + '<input type="hidden" name="type" value="<%=type%>">' + '<input type="hidden" name="s" value="<%=s%>">' + '<input type="hidden" name="client_id" value="<%=appid%>">' + '<input type="hidden" name="xd" value="<%=redirectUrl%>">' + '</form>' + '<iframe name="' + expandoRoam + '" src="about:blank" style="' + HIDDEN_CSS + '"></iframe>';
var HTML_PC_ROAM_LOGIN = '<form method="post" action="' + FIXED_URLS.login + '" target="' + expandoRoamLogin + '">' + '<input type="hidden" name="module" value="<%=module%>">' + '<input type="hidden" name="key" value="<%=key%>">' + '<input type="hidden" name="client_id" value="<%=appid%>">' + '<input type="hidden" name="xd" value="<%=redirectUrl%>">' + '</form>' + '<iframe name="' + expandoRoamLogin + '" src="about:blank" style="' + HIDDEN_CSS + '"></iframe>';

//For validations of options in bulk
var VALIDATORS = [{
    name: ['appid'],
    validate: function(name, value) {
        return type.isString(value) || type.isNumber(value);
    },
    errmsg: function(name, value) {
        return '"' + name + '" SHOULD be a string or a number';
    }
}, {
    name: ['redirectUrl'],
    validate: function(name, value) {
        return type.isNonEmptyString(value) && new RegExp('^' + location.protocol + "//" + location.host, 'i').test(value);
    },
    errmsg: function(name, value) {
        return '"' + name + '" SHOULD be a URL which has the some domain as the current page';
    }
}, {
    name: ['pcroamRedirectUrl'],
    validate: function(name, value) {
        return type.isNullOrUndefined(value) || new RegExp('^' + location.protocol + "//" + location.host, 'i').test(value);
    },
    errmsg: function(name, value) {
        return '"' + name + '" SHOULD be a URL which has the some domain as the current page';
    }
}, {
    name: ['domain'],
    validate: function(name, value) {
        return type.isNullOrUndefined(value) || type.isNonEmptyString(value);
    },
    errmsg: function(name, value) {
        return '"' + name + '" SHOULD be undefined or non-empty string';
    }
}];

var gOptions = null;
var PassportSC = null;
var gFrameWrapper = null;
var defaultOptions = {
    appid: null,
    redirectUrl: null,
    domain: null,
    pcroamRedirectUrl: null
};

var NOT_INITIALIZED_ERROR = 'Passport has not been initialized yet';

/**
 * Create gFrameWrapper if it not exists.
 *
 * @param {Function}
 * @ignore
 * @return {HTMLElement} gFrameWrapper
 */
function assertgFrameWrapper(callback) {
    var c = gFrameWrapper;
    if (!type.isHTMLElement(c) || !c.parentNode) {
        c = gFrameWrapper = document.createElement('div');
        c.style.cssText = HIDDEN_CSS;
        c.className = EXPANDO;
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
 * @ignore
 * @throws {Error} If any validation failed
 */
function validateOptions(options) {
    var i, j, validator, name;

    type.assertPlainObject('options', options);

    UTILS.lone.mixin(gOptions = {}, {
        _token: UTILS.math.uuid()
    }, defaultOptions, options);

    for (i = VALIDATORS.length - 1; i >= 0; --i) {
        validator = VALIDATORS[i];
        for (j = validator.name.length - 1; j >= 0; --j) {
            name = validator.name[j];
            if (!validator.validate(name, gOptions[name])) {
                throw new Error(type.strfunction === typeof validator.errmsg ?
                    validator.errmsg(name, gOptions[name]) : validator.errmsg
                );
            }
        }
    }
}

/**
 * Simple template replacer.
 *
 * @ignore
 * @param  {String} tpl
 * @param  {Object} data
 * @return {String}
 */
function template(tpl, data) {
    return tpl.replace(/<%=([\w-]+?)%>/g, function(k, n) {
        var key = data[n];
        return type.isNullOrUndefined(key) ? "" : key;
    });
}

var Tools = {
    /**
     * Validate username.
     *
     * @param  {String} username
     * @return {Boolean}
     * @class Tools
     * @since 0.0.8
     */
    validateUsername: function(username) {
        return type.isNonEmptyString(username) && /^([a-zA-Z0-9_@\.-]{4,})$/.test(username);
    },
    /**
     * Validate password.
     *
     * @param  {String} password
     * @return {Boolean}
     * @class Tools
     * @since 0.0.8
     */
    validatePassword: function(password) {
        return type.isNonEmptyString(password) && /^\S{6,16}$/.test(password);
    },
    /**
     * Validtae captcha.
     *
     * @param  {String} captcha
     * @return {Boolean}
     * @class Tools
     * @since 0.0.8
     */
    validateCaptcha: function(captcha) {
        return type.isNonEmptyString(captcha) && /^[a-zA-Z0-9]+$/.test(captcha);
    }
};

/**
 * Hide source of tools.
 */
for (e in Tools) {
    if (type.isFunction(Tools[e])) {
        UTILS.lone.hideSource(e, Tools[e], 'PassportSC.tools.');
    }
}

//Some instant callback
var alwaysLoginSuccessCb = type.noop,
    alwaysLoginFailureCb = type.noop,
    alwaysTrdLoginCompleteCb = type.noop,
    alwaysLogoutSuccessCb = type.noop;

/**
 * Core passport object.
 *
 * This will be merged into PassportSC.
 * @ignore
 */
var Passport = {
    /**
     * The current version of passport library.
     *
     * @type {String}
     * @class PassportSC
     * @since 0.0.8
     */
    version: '@version@', //see 'package.json'
    /**
     * Commaon passport tools.
     *
     * @class PassportSC
     * @since 0.0.8
     * @see  {#Tools}
     */
    tools: Tools,
    /**
     * Passport utils.
     *
     * @class PassportSC
     * @since 0.0.8
     * @see  {#Utils}
     */
    utils: UTILS,
    /**
     * Initialize.
     * This must be called at first before
     * any other operations.
     *
     * The following options must be set in options:
     * 1.appid -- Integer of ID,it depends on the product line;
     * 2.redirectUrl -- A same domain page url for cross-domain;
     * 3.pcroamRedirectUrl -- A same domain page url for pc roam cross-domain;
     * 4.domain -- A third domain that requires login(eg. teemo.cn);
     *
     * @param  {Object} options Required options
     * @class PassportSC
     * @return {this}
     * @since 0.0.8
     */
    init: function(options) {
        if (!this.isInitialized()) {
            console.debug('Initializing passport');
            validateOptions(options);
        } else {
            console.warn('Passport has already been initialized');
        }
        //support both PassportSC() and PassportSC.init()
        return window.PassportSC;
    },
    /**
     * Do login action.It's an async function.
     *
     * @class PassportSC
     * @param  {String} username
     * @param  {String} password
     * @param  {String} vcode captcha
     * @param  {Boolean} autoLogin
     * @param  {Function} successcb Success callback
     * @param  {Function} failurecb Failure callback
     * @return {Boolean} If login action is executed
     * @throws {Error} If not initialized
     * @since 0.0.8
     */
    login: function(username, password, vcode, autoLogin, successcb, failurecb) {
        if (!this.isInitialized()) {
            throw new Error(NOT_INITIALIZED_ERROR);
        }

        console.debug('logining with:' + Array.prototype.join.call(arguments));

        var payload;

        this.off(EVENTS.login_failed, alwaysLoginFailureCb);
        if (failurecb) {
            type.assertFunction('failurecb', failurecb);
            this.on(EVENTS.login_failed, alwaysLoginFailureCb = failurecb);
        }

        this.off(EVENTS.login_success, alwaysLoginSuccessCb);
        if (successcb) {
            type.assertFunction('successcb', successcb);
            this.on(EVENTS.login_success, alwaysLoginSuccessCb = successcb);
        }

        if (!Tools.validateUsername(username)) {
            this.emit(EVENTS.param_error, {
                name: 'username',
                value: username,
                msg: "账号格式不正确"
            });
            return false;
        } else if (!Tools.validatePassword(password)) {
            this.emit(EVENTS.param_error, {
                name: 'password',
                value: password,
                msg: "密码格式不正确"
            });
            return false;
        } else if (vcode && !Tools.validateCaptcha(vcode)) {
            this.emit(EVENTS.param_error, {
                name: 'captcha',
                value: vcode,
                msg: "验证码格式不正确"
            });
            return false;
        }

        gLastLoginName = username;

        payload = {
            username: username,
            password: password,
            domain: gOptions.domain || "",
            vcode: vcode || "",
            autoLogin: +(!!autoLogin), //:0/1
            appid: gOptions.appid,
            redirectUrl: gOptions.redirectUrl,
            token: gOptions._token
        };

        this.emit(EVENTS.login_start, {});

        assertgFrameWrapper(function(container) {
            container.innerHTML = template(HTML_FRAME_LOGIN, payload);
            container.getElementsByTagName('form')[0].submit();
        });

        return true;
    },
    /**
     * Login by r_key,which is a string exchanged by iet/etc/gpbtok.
     * 
     * @param  {String} key r_key
     * @return {this}
     * @throws {Error} If key is not a non-empty string.
     */
    loginPcroam: function(key) {
        type.assertNonEmptyString('key', key);
        var payload = {
            module: 'quicklogin',//never changed
            key: key,
            appid: gOptions.appid,
            redirectUrl: gOptions.redirectUrl
        };
        assertgFrameWrapper(function(container) {
            container.innerHTML = template(HTML_PC_ROAM_LOGIN, payload);
            container.getElementsByTagName('form')[0].submit();
        });

        return this;
    },
    /**
     * Check if a token is avaliable in pc roam login.
     *
     * A pc_roam_success/pc_roam_failed event will be emmited.
     *
     * @param  {String} ctype  Token ctype,exp:iet,iec,pinyint
     * @param  {String} token  A token from PC client.
     * @return {this}
     * @class PassportSC
     * @throws {Error} If ctype/token is not validated.
     * @since 0.0.9
     */
    checkPcroamToken: function(ctype, token) {
        type.assertNonEmptyString('ctype', ctype);
        type.assertNonEmptyString('token', token);

        assertgFrameWrapper(function(container) {
            container.innerHTML = template(HTML_PC_ROAM, {
                type: ctype,
                s: token,
                redirectUrl: gOptions.pcroamRedirectUrl,
                appid: gOptions.appid
            });
            container.getElementsByTagName('form')[0].submit();
        });

        return this;
    },
    /**
     * Third party login.
     *
     * @class PassportSC
     * @param  {String} provider qq|sina|renren
     * @param  {String} display page|popup
     * @param  {String} redirectUrl
     * @param  {Function} completecb Login 3rd complete callback
     * @return {this}
     * @throws {Error} If any parameter failed
     * @since 0.0.8
     */
    login3rd: function(provider, display, redirectUrl, completecb) {
        if (!this.isInitialized()) {
            throw new Error(NOT_INITIALIZED_ERROR);
        }

        type.assertNonEmptyString('provider', provider);

        var size = THIRD_PARTY_SIZE.size[provider];
        if (!size) {
            throw new Error('provider:"' + provider + '" is not supported in  third party login');
        }

        this.off(EVENTS.third_party_login_complete, alwaysTrdLoginCompleteCb);
        if (completecb) {
            type.assertFunction('completecb', completecb);
            this.on(EVENTS.third_party_login_complete, alwaysTrdLoginCompleteCb = completecb);
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

        return this;
    },
    /**
     * Do logout.
     * 
     * A 'loginoutsuccess' event will be emmited.
     *
     * Alert:we cannot get the logout failure callback.
     *
     * @param {Function} successcb Logout success callback
     * @class PassportSC
     * @return {this}
     * @throws {Error} If not initialized
     * @since 0.0.8
     */
    logout: function(successcb) {
        if (!this.isInitialized()) {
            throw new Error(NOT_INITIALIZED_ERROR);
        }

        this.off(EVENTS.logout_success, alwaysLogoutSuccessCb);
        if (successcb) {
            type.assertFunction('successcb', successcb);
            this.on(EVENTS.logout_success, alwaysLogoutSuccessCb = successcb);
        }

        console.debug('logouting');
        var self = this;
        var url = FIXED_URLS.logout + '?client_id=' + gOptions.appid;

        assertgFrameWrapper(function(container) {
            UTILS.dom.addIframe(container, url, function() {
                self.emit(EVENTS.logout_success, {});
            });
        });

    },
    /**
     * Get userid from 'ppinf' cookie.
     *
     * @class PassportSC
     * @return {String} userid or empty string
     * @throws {Error} If not initialized
     * @since 0.0.8
     */
    userid: function() {
        if (!this.isInitialized()) {
            throw new Error(NOT_INITIALIZED_ERROR);
        }

        return PassportCookieParser.parsePassportCookie().getCookie().userid || "";
    },
    /**
     * Login callback from iframe.
     *
     * DO NOT call it directly.
     *
     * @param {Object} data login result
     * @throws {Error} If not initialized
     * @class PassportSC
     * @since 0.0.8
     */
    _logincb: function(data) {
        if (!this.isInitialized()) {
            console.debug('Login callback received but [Passport] has not been initialized');
            return;
        }

        if (!type.isPlainObject(data)) {
            console.error('Nothing callback received');
            data.msg = '登录失败';
            this.emit(EVENTS.login_failed, data);
            return;
        } else if (type.isNonEmptyString(data.msg)) {
            data.msg = decodeURIComponent(data.msg);
        }

        if (0 === +data.status) {
            data.msg = data.msg || '登录成功';
            this.emit(EVENTS.login_success, data);
        } else if (+data.status === 20231) {
            data.activeurl = FIXED_URLS.active + '?email=' + encodeURIComponent(gLastLoginName || "") + '&client_id=' + gOptions.appid + '&ru=' + encodeURIComponent(location.href);
            data.msg = data.msg || '账号未激活';
            this.emit(EVENTS.login_failed, data);
        } else if (+data.needcaptcha) {
            data.captchaimg = this.getNewCaptcha();
            data.msg = data.msg || '需要验证码';
            this.emit(EVENTS.login_failed, data);
        } else {

            if (!data.msg) {
                for (var e in CODES) {
                    if (CODES[e].code == data.status) {
                        data.msg = CODES[e].info;
                        break;
                    }
                }
            }

            data.msg = data.msg || "未知错误";
            this.emit(EVENTS.login_failed, data);
        }
    },
    /**
     * Pc roam checking callback.
     *
     * DO NOT call it directly.
     *
     * @param  {Object} token checking result
     * @class PassportSC
     * @since 0.0.9
     */
    _pcroamcb: function(data) {
        if (data && 0 === +data.status && data.r_key) {
            this.emit(EVENTS.pc_roam_success, data);
        } else {
            this.emit(EVENTS.pc_roam_failed, data);
        }
    },
    /**
     * Third party login callback from 'popup' window.
     * DO NOT call it directly.
     *
     * Callback with 'page' display is not supported.
     *
     * @class PassportSC
     * @since 0.0.8
     */
    _logincb3rd: function() {
        if (!this.isInitialized()) {
            console.debug('Login3rd callback received but [Passport] has not been initialized');
            return;
        }
        this.emit(EVENTS.third_party_login_complete, {
            msg: '登录成功'
        });
    },
    /**
     * If passport has been initialized.
     *
     * @return {Boolean} Initialized
     * @class PassportSC
     * @since 0.0.8
     */
    isInitialized: function() {
        return !!gOptions;
    },
    /**
     * Get a copy of options.
     *
     * @return {Object} Options
     * @class PassportSC
     * @since 0.0.8
     */
    getOptions: function() {
        return UTILS.lone.mixin({}, gOptions);
    },
    /**
     * Set passport option.If the value is illegal,it will be ignored.
     *
     * @param {String} key   Options key
     * @param {Mixed} value Options value
     * @class PassportSC
     * @since 0.1.1
     * @return {Mixed} New option value.
     * @todo  validation
     */
    setOption: function(key, value) {
        if (type.isNullOrUndefined(key)) {
            return key;
        }
        gOptions[key] = value;
        return gOptions[key];
    },
    /**
     * Get a copy of events which passport supports.
     *
     * @return {Object} Supported events
     * @class PassportSC
     * @since 0.0.8
     */
    getSupportedEvents: function() {
        return UTILS.lone.mixin({}, EVENTS);
    },
    /**
     * Get a copy urls relative to passsport.
     *
     * @return {Object} Map of urls.
     * @class PassportSC
     * @since 0.0.8
     */
    getPassportUrls: function() {
        return UTILS.lone.mixin({}, FIXED_URLS);
    },
    /**
     * Set a payload.The payload is used for communicating among
     * plugins or something.
     *
     * @param {String} key
     * @param {Object} value
     * @class PassportSC
     * @since 0.0.8
     */
    setPayload: function(key, value) {
        type.assertNonEmptyString('key', key);
        gPayload[key] = value;
        return value;
    },
    /**
     * Get a payload.
     *
     * @param {String} key
     * @return {Object} The payload
     * @class PassportSC
     * @since 0.0.8
     */
    getPayload: function(key) {
        type.assertNonEmptyString('key', key);
        return gPayload[key];
    },
    /**
     * Generate a new captcha image.
     *
     * @return {String} New captcha image url
     * @class PassportSC
     * @since 0.0.8
     */
    getNewCaptcha: function() {
        return FIXED_URLS.captcha + '?token=' + gOptions._token + '&t=' + (+new Date());
    }
};

//Hide implementation for beauty.
PassportSC = function() {
    return Passport.init.apply(Passport, arguments);
};

UTILS.lone.mixin(PassportSC, Passport, new XEvent());

//PassportSC is shy.
//We do this for hiding source of its function members,
//which may show up in chrome/firefox/opera console.
for (e in PassportSC) {
    if (type.isFunction(PassportSC[e])) {
        UTILS.lone.hideSource(e, PassportSC[e]);
    }
}


var core = {
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
    },
    getFixedUrls: function() {
        return FIXED_URLS;
    },
    getSupportedEvents: function() {
        return EVENTS;
    }
};

//Merge appendixes
//We have to initialize plugins because 'onApiLoaded'
UTILS.array.forEach(gAppendixes, function(appendixInit, idx) {
    appendixInit(core);
});

//Sync loading supported
if (window.PassportSC) {
    UTILS.lone.mixin(window.PassportSC, PassportSC);
    if (type.isFunction(window.PassportSC.onApiLoaded)) {
        window.PassportSC.onApiLoaded();
    }
} else {
    window.PassportSC = PassportSC;
}