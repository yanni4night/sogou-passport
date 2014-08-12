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
var array = require('../array');

var pluginInit = function(core) {
    var PC = core.PassportSC;
    var evtPluginLoadedVal = 'pluginloaded';
    core.addSupportedEvent('plugin_loaded', evtPluginLoadedVal);

    //These are the plugins we created,you can create your own.
    var preDefinedPlugins = ['pop', 'jQuery'];

    //record which plugins have been loaded
    var LoaderHistory = {
        _pluginLoaded: {
            //sniff loaded jQuery library
            jQuery: !!(window.jQuery && (PC.jQuery = PC.$ = window.jQuery))
            },
        hasPluginLoaded: function(name) {
            return !!this._pluginLoaded[name];
        },
        setPluginLoaded: function(name) {
            this._pluginLoaded[name] = true;
        }
    };

    function loadPlugin(name) {
        var url = (UTILS.type.debug ? '/dist' : core.getFixedUrls().libprefix) + '/@version@/js/plugin/' + name + '.js';
        console.trace('loading plugin:', url);
        if (!LoaderHistory.hasPluginLoaded(name)) {
            UTILS.dom.addScript(url, function() {
                LoaderHistory.setPluginLoaded(name);
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
     * [requirePlugins description]
     *
     * @param  {Function} done [description]
     */
    PC.requirePlugins = function( /*names..,done*/ ) {
        if (arguments.length < 2) {
            throw Error('A "plugin name" and a callback function are required.');
        }

        if (!PC.utils.type.isFunction(arguments[arguments.length - 1])) {
            throw Error('A callback function is required.');
        }

        var done = arguments[arguments.length - 1];


        var names = array.filter(Array.prototype.slice.call(arguments, 0, arguments.length - 1), function(name) {
                return !LoaderHistory.hasPluginLoaded(name);
            }),
            nonLoadedPluginsCnt = names.length;

        console.debug('requiring:', names);

        if (!nonLoadedPluginsCnt) {
            done.call(this);
            return this;
        }
        //We just load the plugins that have not been loaded
        //
        //For the plugins that loaded with error(s),we can do nothing.
        //That is really fatal.

        this.on(this.getSupportedEvents().plugin_loaded, function(e, data) {
            //Just check the loading plugins
            if (~array.indexOf(names,data.plugin) && !--nonLoadedPluginsCnt) {
                done.call(this);
            }
        }, this);

        array.forEach(names, function(name) {
            loadPlugin(name);
        });

        return this;
    };

    UTILS.lone.hideSource('getPreDefinedPlugin', PC.getPreDefinedPlugin);
    UTILS.lone.hideSource('requirePlugins', PC.requirePlugins);
};

module.exports = pluginInit;