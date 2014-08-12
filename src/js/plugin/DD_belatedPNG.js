/**
 * Copyright (C) 2014 yanni4night.com
 * DD_belatedPNG.js
 *
 * changelog
 * 2014-08-12[17:37:04]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

"use strict";
var DD_belatedPNG = require('../lib/DD_belatedPNG');

var PC = window.PassportSC;

if (!PC || !PC.init || !PC._logincb) {
    throw new Error('You have to load PassportSC first!');
}

var _pluginName = 'DD_belatedPNG';
var evts = PC.getSupportedEvents();

PC[_pluginName] = DD_belatedPNG;

//!This event has to be emitted.
PC.emit(evts.plugin_loaded, {
    plugin: _pluginName
});