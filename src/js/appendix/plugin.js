/**
 * Copyright (C) 2014 yanni4night.com
 * plugin.js
 *
 * changelog
 * 2014-08-11[19:53:37]:authorized
 * 2014-08-15[11:52:06]:fixed no response when loading dumplicated plugins
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
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
    var preDefinedPlugins = ['pop', 'jQuery', 'DD_belatedPNG'];

    //record which plugins have been loaded or are still been loading
    var LoaderHistory = {
        _pluginLoaded: {
            //sniff loaded jQuery library
            jQuery: !!(window.jQuery && (PC.jQuery = PC.$ = window.jQuery)),
            DD_belatedPNG: !!(window.DD_belatedPNG && (PC.DD_belatedPNG = window.DD_belatedPNG))
        },
        _pluginLoading: {},
        hasPluginLoaded: function(name) {
            return !!this._pluginLoaded[name];
        },
        setPluginLoaded: function(name) {
            this._pluginLoaded[name] = true;
            return this;
        },
        isPluginLoading: function(name) {
            return !!this._pluginLoading[name];
        },
        setPluginLoading: function(name) {
            this._pluginLoading[name] = true;
            return this;
        },
        resetPluginLoading: function(name) {
            delete this._pluginLoading[name];
            return this;
        }
    };

    /**
     * Load a plugin.
     * If the plugin is already loading or has been loaded,do nothing.
     *
     * @param  {String} name Plugin name
     * @since 0.0.9
     * @ignore
     */
    function loadPlugin(name) {
        var url;
        if (LoaderHistory.isPluginLoading(name) || LoaderHistory.hasPluginLoaded(name)) {
            console.debug(name + ' is loaded or loading.');
            return;
        }

        url = (UTILS.type.debug ? '/dist' : core.getFixedUrls().libprefix) + '/@version@/js/plugin/' + name + '.js';
        console.debug('loading plugin:', url);

        LoaderHistory.setPluginLoading(name);
        UTILS.dom.addScript(url, function() {
            LoaderHistory.setPluginLoaded(name).resetPluginLoading(name);
        });
    }

    /**
     * Get pre-defined plugins' names.
     *
     * @return {Array} The pre-defined plugins.
     * @class PassportSC
     * @since 0.0.9
     */
    PC.getPreDefinedPlugin = function() {
        return preDefinedPlugins.slice();
    };

    /**
     * Loas a series of plugins.
     *
     * This function accept multiple plugin names and a callback function.
     * Only all the plugins loaded successfully,the callback could be called.
     *
     * eg.
     * PassportSC.requirePlugins('pop','jQuery',function(){});
     *
     * @param {String} names... Plugin name.
     * @param  {Function} done Plugins loaded callback.
     * @class PassportSC
     * @return {this}
     * @throws {Error} If the plugin is unknown
     * @since 0.0.9
     */
    PC.requirePlugins = function( /*names..,done*/ ) {

        var done, names, nonLoadedPluginsCnt;
        if (arguments.length < 2) {
            throw Error('A "plugin name" and a callback function are required.');
        }

        done = arguments[arguments.length - 1];

        if (!PC.utils.type.isFunction(done)) {
            throw Error('A callback function is required.');
        }


        names = Array.prototype.slice.call(arguments, 0, arguments.length - 1);

        console.debug('requiring:', names);

        names = array.filter(names, function(name) {
            if (!~array.indexOf(preDefinedPlugins, name)) {
                throw new Error('Unknown plugin "' + name + '"');
            }
            return !LoaderHistory.hasPluginLoaded(name);
        });

        nonLoadedPluginsCnt = names.length;

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
            if (~array.indexOf(names, data.plugin)) {
                //Avoid dumplicated names in requirement.
                names = array.filter(names, function(name) {
                    return name !== data.plugin;
                });
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