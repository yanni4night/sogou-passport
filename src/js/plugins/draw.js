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
 *
 * @author yanni4night@gmail.com
 * @version 0.1.2
 * @since 0.1.0
 */
(function(window, document, undefined) {
  "use strict";

  var core = require('../core');
  var PassportSC = core.PassportSC;
  var UTILS = require('../utils');
  var console = require('../console');
  var async = require('../async');
  var cookie = require('../cookie');

  var domainList = ["sohu.com", "chinaren.com", "sogou.com", "vip.sohu.com", "17173.com", "focus.cn", "game.sohu.com", "37wanwan.com"];

  core.addFixedUrl('register', 'https://account.sogou.com/web/reg/email'); //ru&client_id
  core.addFixedUrl('recover', 'https://passport.sohu.com/web/RecoverPwdInput.action'); //ru


  //default options
  var defaultOptions = {
    container: null,
    skin: 'default',
    skinCssUrl:null,
    skinJsUrl:null,
    trdRedirectUrl:null
  };

  var gOptions = null;


  /**
   * Compute css url.
   *
   * @param  {String} name
   * @return {String} url
   */
  function getSkinCssHref(name) {
    return (UTILS.type.debug ? '/dist' : 'http://s.account.sogoucdn.com/u/api') + '/@version@/skin/css/' + name + '/style.css';
  }

  /**
   * Compute js url
   * @param  {String} name
   * @return {String}
   */
  function getSkinJsHref(name) {
    return (UTILS.type.debug ? '/dist' : 'http://s.account.sogoucdn.com/u/api') + '/@version@/skin/js/' + name + '.js';
  }

  /**
   * Load skin by loading css&js.
   */
  function loadSkin() {
    async.parallel([
      function(callback) {
        UTILS.dom.addLink(gOptions.skinCssUrl, callback);
      },
      function(callback) {
        UTILS.dom.addScript(gOptions.skinJsUrl, callback);
      }
    ], function() {
      PassportSC.initSkin();
    });
  }

  /**
   * Draw a passport login canvas on a HTMLElement.
   *
   * @param  {Object} options
   * @return {this}
   */
  PassportSC.draw = function(options) {

    if (!this.isInitialized()) {
      throw new Error('You have to initialize passport before draw');
    }

    gOptions = UTILS.mixin({}, defaultOptions, options||{});

    UTILS.type.assertHTMLElement('options.container', gOptions.container);
    
    gOptions.skinJsUrl = gOptions.skinJsUrl || getSkinJsHref(gOptions.skin);
    gOptions.skinCssUrl = gOptions.skinCssUrl || getSkinCssHref(gOptions.skin);

    this.setPayload('contrib-skin',gOptions);

    loadSkin();

    return this;
  };

  PassportSC.initSkin = function(){
    throw new Error('You should load a skin to override this function');
  };

  /**
   * Get a copy of suggestion domain list.
   * @return {Array}
   */
  PassportSC.getSuggestDomain = function() {
    return domainList.slice();
  };

  UTILS.hideSource('draw', PassportSC.draw);
  UTILS.hideSource('getSuggestDomain', PassportSC.getSuggestDomain);

  module.exports = {
    PassportSC: PassportSC
  };
})(window, document);