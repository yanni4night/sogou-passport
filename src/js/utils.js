/**
 * Copyright (C) 2014 yanni4night.com
 *
 * utils.js
 *
 * changelog
 * 2014-05-24[23:06:31]:authorized
 * 2014-06-06[09:23:53]:getIEVersion
 * 2014-06-07[15:30:38]:clean by split in 'math','dom' etc
 * 2014-06-07[16:39:34]:remove 'dom' module
 * 2014-06-09[11:05:06]:define 'hideSource' function
 * 2014-06-12[09:23:30]:remove 'trim'
 * 2014-06-13[09:48:40]:as freeze does not throw errors,we removed it
 * 2014-06-13[10:27:27]:redesigned 'mixin' to support multiple sources;defined 'extend' as an alias of 'mixin'
 * 2014-06-14[12:16:03]:event included
 * 2014-06-14[21:43:05]:async included
 * 2014-08-06[11:15:06]:split out lone module;merge cookie
 *
 * @author yanni4night@gmail.com
 * @version 0.1.10
 * @since 0.1.0
 */

"use strict";

var array = require('./array');
var math = require('./math');
var type = require('./type');
var dom = require('./dom');
var string = require('./string');
var xevent = require('./event');
var async = require('./async');
var console = require('./console');
var lone = require('./lone');
var cookie = require('./cookie');

module.exports = {
    math: math,
    array: array,
    dom: dom,
    type: type,
    string: string,
    event: xevent,
    async: async,
    console: console,
    lone: lone,
    cookie: cookie

};