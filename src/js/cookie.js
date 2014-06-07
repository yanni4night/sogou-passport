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