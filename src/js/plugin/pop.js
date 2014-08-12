/**
 * Copyright (C) 2014 yanni4night.com
 * pop.js
 *
 * changelog
 * 2014-08-11[18:03:19]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

"use strict";
var $ = require('../lib/jquery-1.11.1');

var PC = window.PassportSC;

var _pluginName = 'pop';
var evts = PC.getSupportedEvents();

var $dialog;
PC[_pluginName] = function(conf) {
    conf = conf || {};
    if (!$dialog) {
        $dialog = $('<div/>').css({
            position: "fixed",
            left: "50%",
            top: "50%",
            "margin-top": "-200px",
            "margin-left": "-200px"
        }).appendTo($(document.body));

        conf.container = $dialog[0];

        this.on(evts.draw_complete, function(e) {
            var w = $dialog.width();
            var h = $dialog.height();
            $dialog.css({
                width: w + 'px',
                height: h + 'px',
                "margin-top": -h / 2 + 'px',
                "margin-left": -w / 2 + 'px'
            }).show();
        }).on('canvasclosing', function(e) {
            $dialog.hide();
        }).draw(conf);
    } else {
        $dialog.show();
    }

    return this;
};

PC.emit(evts.plugin_loaded, {
    plugin: _pluginName
});