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
 *
 * @author yanni4night@gmail.com
 * @version 0.1.2
 * @since 0.1.0
 */
"use strict";

var math = require('./math');
var type = require('./type');
var utils = require('./utils');

var PassportCookieParser = {
    cookie: {},
    getCookie: function() {
        return this.cookie;
    },
    parsePassportCookie: function() {
        var value, i, parsedArray, matches;

        if (true !== (window.navigator && navigator.cookieEnabled)) {
            return this;
        }
        //clear
        this.cookie = {};

        var cookieArray = document.cookie.split("; ");
        for (i = 0; i < cookieArray.length; ++i) {
            matches = cookieArray[i].match(/^p(?:pinf|pinfo|assport)=(.+)$/);
            if (matches && matches[1]) {
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
                this._parsePassportCookie(math.utf8to16(math.b64_decodex(parsedArray[3])));
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

    var config = $.cookie = function(key, value, options) {

        // Write

        if (value !== undefined && !type.isFunction(value)) {
            options = utils.extend({}, config.defaults, options);

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

    $.removeCookie = function(key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', utils.extend({}, options, {
            expires: -1
        }));
        return !$.cookie(key);
    };
})(module.exports);