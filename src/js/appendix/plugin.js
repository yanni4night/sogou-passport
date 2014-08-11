/**
 * Copyright (C) 2014 yanni4night.com
 * plugin.js
 *
 * changelog
 * 2014-08-11[19:53:37]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
"use strict";

var UTILS = require('../utils');
var console = require('../console');

var pluginInit = function(core) {
    var PC = core.PassportSC;
    var evtPluginLoadedVal = 'pluginloaded';
    core.addSupportedEvent('plugin_loaded', evtPluginLoadedVal);

    //These are the plugins we created,you can create your own.
    var preDefinedPlugins = ['pop'];

    //record which plugins have been loaded
    var _pluginLoaded = {};

    function loadPlugin(url) {
        console.trace('loading plugin:', url);
        if (!_pluginLoaded[url]) {
            UTILS.dom.addScript(url, function() {
                _pluginLoaded[url] = true;
            });
        }
    }

    /**
     * Get pre-defined plugins' names.
     *
     * @return {Array}
     */
    PC.getPreDefinedPlugin = function() {
        return preDefinedPlugins.slice();
    };

    /**
     * Load a plugin by loading a javascript file.
     *
     * We do not add a callback here.
     * For each plugin,a 'pluginloaded' event must br emitted
     * when initialized.
     *
     * @param  {String} name    Plugin name
     * @param  {Object} options Options
     * @return {this}
     */
    PC.loadPlugin = function(name, options) {
        if (UTILS.type.isNonEmptyString(name)) {

            loadPlugin((UTILS.type.debug ? '/dist' : core.getFixedUrls().libprefix) + '/@version@/js/plugin/' + name + '.js');
        } else if (options && UTILS.type.isNonEmptyString(options.url)) {
            loadPlugin(options.url);
        } else {
            throw new Error('A plugin\'s "name" or "url" has to indicated.');
        }
        return this;
    };

    UTILS.lone.hideSource('getPreDefinedPlugin', PC.getPreDefinedPlugin);
    UTILS.lone.hideSource('loadPlugin', PC.loadPlugin);
};

module.exports = pluginInit;