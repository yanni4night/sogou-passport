/**
 * Copyright (C) 2014 yanni4night.com
 *
 * statistic.js
 *
 * changelog
 * 2014-06-16[11:11:22]:authorized
 * 2014-06-22[16:31:49]:fixed bugs
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */
"use strict";

var core = require('../core');
var PassportSC = core.PassportSC;
var UTILS = require('../utils');
var type = UTILS.type;
var console = UTILS.console;
var array = UTILS.array;

var STATISTIC_UTL = 'https://account.sogou.com/web/slowinfo';
var loginThreshold = +PassportSC.getOptions().loginThreshold || 6e3;

var loginOverInter, loginStartTime;

var commonPingData = [
    'pt=' + document.domain,
    'path=' + encodeURIComponent(location.pathname),
    'fr=' + encodeURIComponent(document.referrer),
    'ua=' + encodeURIComponent(navigator.userAgent),
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
        for (var e in data) {
            parameters.push(e + '=' + encodeURIComponent(data[e]));
        }
    } else {
        console.warn('UnSupported data format:', data);
        //other data format is ignored.
        return false;
    }

    parameters = parameters.concat('_=' + UTILS.now(),
        'appid=' +
        PassportSC.getOptions().appid).concat(commonPingData);

    try {
        new Image().src = STATISTIC_UTL + '?' + parameters.join('&');
    } catch (e) {
        console.error('Create image failed:' + e);
    }

    return true;
}

function reportLogin(status) {
    report({
        status: status || -1, //meaning over time
        api: encodeURIComponent('/web/login'),
        cost: UTILS.now() - loginStartTime,
        limit: loginThreshold
    });
}

function overLogin() {
    clearTimeout(loginOverInter);
    loginOverInter = setTimeout(function() {
        reportLogin(-1);
    }, loginThreshold);
}
var events = PassportSC.getSupportedEvents();


//create a timeout when start
PassportSC.on(events.login_start, function(e) {
    loginStartTime = UTILS.now();
    overLogin();
}, PassportSC);

//clear timeout when callback during it
PassportSC.on([events.login_success, events.login_failed].join(' '), function(e, data) {
    clearTimeout(loginOverInter);
    reportLogin(data.status);
}, PassportSC);