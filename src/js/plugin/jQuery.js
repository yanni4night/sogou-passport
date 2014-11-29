/**
 * Copyright (C) 2014 yanni4night.com
 * jquery.js
 *
 * changelog
 * 2014-08-12[14:19:28]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
"use strict";
var $ = require('../lib/jquery-1.11.1');

var PC = window.PassportSC;
var evts = PC.getSupportedEvents();

if (!PC || !PC.init || !PC._logincb) {
    throw new Error('You have to load PassportSC first!');
}

var _pluginName = 'jQuery';

PC.$ = PC[_pluginName] = $;

//!This event has to be emitted.
PC.emit(evts.plugin_loaded, {
    plugin: _pluginName
});