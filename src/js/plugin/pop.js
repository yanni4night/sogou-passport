/**
 * Copyright (C) 2014 yanni4night.com
 * pop.js
 *
 * changelog
 * 2014-08-11[18:03:19]:authorized
 * 2014-08-12[10:23:00]:fixed IE6 
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */

"use strict";
var $ = require('../lib/jquery-1.11.1');

var PC = window.PassportSC;

var fixedPositionSupported = !(document.all&&!window.XMLHttpRequest);

var _pluginName = 'pop';
var evts = PC.getSupportedEvents();

var $dialog;
PC[_pluginName] = function(conf) {
    conf = conf || {};
    if (!$dialog) {
        $dialog = $('<div/>').css({
            position: fixedPositionSupported ? "fixed" : "absolute",
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
                "margin-top": fixedPositionSupported ? (-h / 2 + 'px') : 0,
                "margin-left": -w / 2 + 'px',
                'z-index':100000
            }).show();
            //draw complete will be emitted only once
            if (!fixedPositionSupported) {
                $(window).on('scroll resize', function(e) {
                    if ($dialog.is(':visible')) {
                        $dialog.css({
                            top: $(document).scrollTop() + ($(window).height() - $dialog.height()) / 2 + 'px'
                        });
                    }
                }).trigger('scroll')
            }
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