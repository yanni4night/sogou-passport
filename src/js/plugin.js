/**
 * Copyright (C) 2014 yanni4night.com
 *
 * plugin.js
 *
 * changelog
 * 2014-06-14[11:29:10]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
(function(undefined) {
    "use strict";
    var core = require('./core');
    var UITLS = require('./utils');
    var PassportSC = core.PassportSC;
    var type = UITLS.type;

    var predefindedPlugins = {
        'draw': 'draw'
    };


    function getComputedPlugins() {
        var s = {};
        for (var e in predefindedPlugins) {
            s[e] = (type.debug ? '/dist' : 'http://s.account.sogoucdn.com/u/api') + '/@version@/plugins/' + predefindedPlugins[e] + '.js';
        }
        return s;
    }
    /**
     * [loadPlugin description]
     * @param  {String}   pluginName
     * @param  {Function} callback
     * @return {this}
     */
    PassportSC.loadPlugin = function(pluginName, callback) {
        type.assertNonEmptyString('pluginName', pluginName);
        if (callback) {
            type.assertFunction('callback', callback);
        }
        var plugin = getComputedPlugins()[pluginName.toLowerCase()];
        if (!plugin) {
            throw new Error('Plugin named "' + pluginName + '" not found!');
        }
        UITLS.dom.addScript(plugin, callback);
        return this;
    };

    /**
     * [getPredefinedPlugins description]
     * @return {Object} Plugins name-url map
     */
    PassportSC.getPredefinedPlugins = function() {
        return getComputedPlugins();
    };

    UITLS.hideSource('loadPlugin', PassportSC.loadPlugin);
    UITLS.hideSource('getPredefinedPlugins', PassportSC.getPredefinedPlugins);

})();