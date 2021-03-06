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
 * 2014-06-13[10:01:30]:transplanted jquery.cookie
 * 2014-09-02[21:10:35]:rewrite cookie parser
 * 2014-09-03[18:06:00]:modified exports
 *
 * @author yanni4night@gmail.com
 * @version 0.1.4
 * @since 0.1.0
 */
"use strict";

var math = require('./math');
var type = require('./type');
var lone = require('./lone');
var array = require('./array');


var exports = module.exports;
//jquery.cookie
(function($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return type.isFunction(converter) ? converter(value) : value;
    }

    /**
     * Get a cookie value.
     *
     * @param  {String} key
     * @param  {String} value
     * @param  {Object} options
     * @return {String}
     * @see {#https://github.com/carhartl/jquery-cookie}
     * @class Cookie
     * @since 0.0.8
     */
    var config = $.cookie = function(key, value, options) {

        // Write

        if (value !== undefined && !type.isFunction(value)) {
            options = lone.mixin({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};
    /**
     * Remove a cookie.
     *
     * @param  {String} key
     * @param  {Object} options
     * @return {Boolean}
     * @see {#https://github.com/carhartl/jquery-cookie}
     * @class Cookie
     * @since 0.0.8
     */
    $.removeCookie = function(key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', lone.mixin({}, options, {
            expires: -1
        }));
        return !$.cookie(key);
    };
})(exports);

exports.PassportCookieParser = {
    cookie: {},
    version: null,
    getCookie: function() {
        return this.cookie;
    },
    /**
     * Parse information from cookie ppinf|ppinfo|passport under sogou.com domain.
     *
     * @ignore
     * @return {this}
     */
    parsePassportCookie: function() {
        var ppinf, parsedArray, payload;

        if (true !== (window.navigator && navigator.cookieEnabled)) {
            return this;
        }
        //clear
        this.cookie = {};

        //No cookie read
        if (!(ppinf = (exports.cookie('ppinf') || exports.cookie('ppinfo') || exports.cookie('passport')))) {
            return this;
        }

        try {
            parsedArray = unescape(ppinf).split("|");
            this.version = parseInt(parsedArray[0]);
            payload = parsedArray[3];
            if (/*!!~array.indexOf([1, 2, 5], this.version) &&*/ payload) {
                this._parsePassportCookie(math.utf8to16(math.b64_decodex(payload)));
            }
        } catch (e) {}

        return this;
    },
    /**
     *
     * Parse payload:
     *
     * SH:
     * loginid:0:|userid:44:BF56C74E50C5295E4600B4A444AC31A0@qq.sohu.com|serviceuse:30:000000000000000000000000000000|crt:0:|emt:1:0|appid:4:1120|trust:1:1|partnerid:1:0|relation:0:|uuid:16:c07af282ae5b427x|uid:16:c07af282ae5b427x|uniqname:43:NightingaleY1361%E5%9C%A8%E6%90%9C%E7%8B%90|refuserid:32:BF56C74E50C5295E4600B4A444AC31A0|refnick:13:Nightingale.Y|
     * SG:
     * clientid:4:2002|crt:10:1409662939|refnick:0:|trust:1:1|userid:16:lovemd@sogou.com|uniqname:0:|
     * 
     * @ignore
     */
    _parsePassportCookie: function(payload) {
        var segments = payload.split('|'),
            segarr, key, len, val;
        array.forEach(segments, function(segment) {
            segarr = segment.split(':');
            if (3 !== segarr.length || !(key = segarr[0]) || !(len = segarr[1])) return;
            val = segarr[2];
            //validate length
            if (len != val.length) {
                return;
            }
            this.cookie[key] = val;
        }, this);
        return this;
    }
};
