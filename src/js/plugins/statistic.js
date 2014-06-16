/**
 * Copyright (C) 2014 yanni4night.com
 *
 * statistic.js
 *
 * changelog
 * 2014-06-16[11:11:22]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
(function(window, document, undefined) {
    "use strict";

    var core = require('../core');
    var PassportSC = core.PassportSC;
    var UTILS = require('../utils');
    var type = UTILS.type;
    var console = UTILS.console;
    var array = UTILS.array;

    var STATISTIC_UTL = 'https://account.sogou.com/web/slowinfo';
    var loginThreshold = 6e3;

    var commonPingData = [
        'pt=' + document.domain,
        'path=' + encodeURIComponent(location.pathname),
        'ls=' + +navigator.cookieEnabled + '_' + +('localStorage' in window && window.localStorage !== null)
    ];

    function report(data) {
        var parameters = [];

        if (type.isArray(data)) {
            //when data is an array,we have to assume that value have been
            //uri-encoded.
            array.forEach(function(item) {
                if (type.isNonEmptyString(item) && /^[^\s=&\?#]+=[^\s=&\?#]+$/.test(item)) {
                    parameters.push(item);
                }
            });
        } else if (type.isPlainObject(data)) {
            //when data is a object,we encode each value in uri format.
            parameters = [];
            for (var e in data) {
                //empty space should not exist in key
                if (!/[\s=&\?#]/.test(e)) {
                    parameters.push(e + '=' + encodeURIComponent(data[e]));
                }
            }
        } else {
            console.warn('UnSupported data format:', data);
            //other data format is ignored.
            return false;
        }

        UTILS.mixin(parameters, commonPingData, {
            '_': +new Date(),
            'appid': PassportSC.getOptions().appid
        });

        new Image().src = STATISTIC_UTL + '?' + parameters.join('&');

        return true;
    }
    var loginOverInter, loginStartTime;

    function reportLogin(status) {
        report({
            status: status || -1, //meaning over time
            api: encodeURIComponent('/web/login'),
            cost: +new Date() - loginStartTime,
            limit: loginThreshold
        });
    }

    function overLogin() {
        clearTimeout(loginOverInter);
        loginOverInter = setTimeout(function() {
            reportLogin();
        }, loginThreshold);
    }
    var events = PassportSC.getSupportedEvents();

    PassportSC.on(events.login_start, function(e) {
        loginStartTime = +new Date();
    }, PassportSC);

    PassportSC.on([events.login_success, events.login_failed].join(' '), function(e, data) {
        clearTimeout(loginOverInter);
        reportLogin(data.status);
    }, PassportSC);

})(window, document);