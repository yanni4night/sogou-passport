/**
 * Copyright (C) 2014 yanni4night.com
 *
 * draw.js
 *
 * We attempt to show a login dialog in HTML.
 *
 * changelog
 * 2014-06-04[23:14:19]:authorized
 * 2014-06-08[21:25:34]:rename to draw.js
 * 2014-06-11[21:11:06]:change skin css path
 * 2014-06-14[22:12:48]:split out skin
 * 2014-06-15[10:50:32]:define 'getPredefinedSkin'
 * 2014-08-08[11:03:42]:plugin initialized inside core
 *
 * @author yanni4night@gmail.com
 * @version 0.1.4
 * @since 0.1.0
 */
"use strict";

var UTILS = require('../utils');
var console = require('../console');
var async = require('../async');
var array = require('../array');
var cookie = require('../cookie');

var pluginInit = function(core) {
  var PassportSC = core.PassportSC;
  var evtSkinLoadedVal = 'skinloaded';
  var evtSkinDrawComplete = 'drawcomplete';
  var domainList = ["sohu.com", "chinaren.com", "sogou.com", "vip.sohu.com", "17173.com", "focus.cn", "game.sohu.com", "37wanwan.com"];

  core.addFixedUrl('register', 'https://account.sogou.com/web/reg/email'); //ru&client_id
  core.addFixedUrl('recover', 'https://account.sogou.com/web/findpwd'); //ru&client_id
  core.addSupportedEvent('skin_loaded', evtSkinLoadedVal);
  core.addSupportedEvent('draw_complete', evtSkinDrawComplete);

  var preDefinedSkinNames = ['default', 'wan'];

  //default options
  var defaultOptions = {
    container: null,
    skin: preDefinedSkinNames[0],
    skinCssUrl: null,
    skinJsUrl: null,
    trdRedirectUrl: null
  };

  var gOptions = null;

  /**
   * Compute css url.
   *
   * @param  {String} name
   * @return {String} url
   */
  function getSkinCssHref(name) {
    if (!UTILS.type.isNonEmptyString(name) || !~array.indexOf(preDefinedSkinNames, name)) {
      return null;
    }
    return (UTILS.type.debug ? '/dist' : core.getFixedUrls().libprefix) + '/@version@/skin/css/' + name + '/style.css';
  }

  /**
   * Compute js url
   * @param  {String} name
   * @return {String}
   */
  function getSkinJsHref(name) {
    if (!UTILS.type.isNonEmptyString(name) || !~array.indexOf(preDefinedSkinNames, name)) {
      return null;
    }
    return (UTILS.type.debug ? '/dist' : core.getFixedUrls().libprefix) + '/@version@/skin/js/' + name + '.js';
  }

  /**
   * Load skin by loading css&js.
   * Once called,never call again.
   */
  function loadSkin() {
    var skinInitFunc;

    return async.parallel([

      function(cb) {
        PassportSC.on(evtSkinLoadedVal, function(evt, data) {
          cb((data && UTILS.type.isFunction(skinInitFunc = data.init)) ? null : new Error('Init of skin has to be defined'));
        });
      },
      function(cb) {
        //We do not listen javascript loaded
        //because it's ugliy
        UTILS.dom.addScript(gOptions.skinJsUrl);
        //But we hava to wait for css loaded
        //We have no idea if css loading fails
        UTILS.dom.addLink(gOptions.skinCssUrl, cb);
      }
    ], function(err) {
      if (!err) {
        skinInitFunc.call(PassportSC);
        PassportSC.emit(evtSkinDrawComplete, {});
      } else {
        throw err;
      }
    });
  }

  /**
   * Draw a passport login canvas on a HTMLElement.
   * This function cannot be called more than once.
   *
   * @param  {Object} options
   * @return {this}
   */
  PassportSC.draw = function(options) {

    if (!this.isInitialized()) {
      throw new Error('You have to initialize passport before draw');
    }

    //Avoid draw twice
    if (gOptions) {
      throw new Error('You can draw only once');
    }

    gOptions = UTILS.lone.mixin({}, defaultOptions, options || {});

    UTILS.type.assertHTMLElement('options.container', gOptions.container);
    UTILS.type.assertNonEmptyString('options.trdRedirectUrl', gOptions.trdRedirectUrl);

    gOptions.skinJsUrl = gOptions.skinJsUrl || getSkinJsHref(gOptions.skin);
    if (!gOptions.skinJsUrl) {
      throw new Error('You have to define a skin name or skinJsUrl');
    }

    gOptions.skinCssUrl = gOptions.skinCssUrl || getSkinCssHref(gOptions.skin);
    if (!gOptions.skinCssUrl) {
      throw new Error('You have to define a skin name or skinCssUrl');
    }

    this.setPayload('contrib-skin', UTILS.lone.extend({}, gOptions));

    loadSkin();

    return this;
  };

  /**
   * Get a copy of suggestion domain list.
   * @return {Array}
   */
  PassportSC.getSuggestDomain = function() {
    return domainList.slice();
  };

  /**
   * Get a copy array of pre-defined skin names.
   * @return {Array} Skin names array
   */
  PassportSC.getPredefinedSkin = function() {
    return preDefinedSkinNames.slice();
  };

  UTILS.lone.hideSource('draw', PassportSC.draw);
  UTILS.lone.hideSource('getSuggestDomain', PassportSC.getSuggestDomain);
  UTILS.lone.hideSource('getPredefinedSkin', PassportSC.getPredefinedSkin);
}; //pluginInit
module.exports = pluginInit;