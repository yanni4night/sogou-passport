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
 *
 * @author yanni4night@gmail.com
 * @version 0.1.2
 * @since 0.1.0
 */
(function(window, document, undefined) {
  "use strict";

  var core = require('./core');
  var PassportSC = core.PassportSC;
  var UTILS = require('./utils');
  var console = require('./console');
  var cookie = require('./cookie');

  var domainList = ["sohu.com", "chinaren.com", "sogou.com", "vip.sohu.com", "17173.com", "focus.cn", "game.sohu.com", "37wanwan.com"];


  core.addSupportedEvent('draw_complete', 'drawcomplete');
  core.addFixedUrl('register', 'https://account.sogou.com/web/reg/email'); //ru&client_id
  core.addFixedUrl('recover', 'https://passport.sohu.com/web/RecoverPwdInput.action'); //ru


  //default options
  var defaultOptions = {
    container: null,
    skin: 'default',
    skinCssUrl:null,
    skinJsUrl:null
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
   * Parse a link src by style parameter.
   *
   * @param  {String|Function} style
   * @return {String} Parsed link src
   * @throws {Error} If parsed failed
   */
  function styleParser(style) {
    var src;
    switch (true) {
      case UTILS.type.isNullOrUndefined(style):
      case 'default' === style:
        src = getSkinCssHref('default');
        break;
      case UTILS.type.isNonEmptyString(style) && /\.css/i.test(style):
        src = style;
        break;
      case UTILS.type.isFunction(style):
        src = style.call(null);
        break;
      default:
        throw new Error('Unrecognized style: [' + style + ']');
    }

    return src;
  }

  function loadSkin(){
    UTILS.dom.addLink(gOptions.skinCssUrl, function(){
      UTILS.dom.addScript(gOptions.skinJsUrl,function(){

      });
    });
  }

  PassportSC.on('skin_loaded',function(){
    PassportSC.initSkin();
  });
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


    gOptions = UTILS.mixin({}, defaultOptions, options);

    UTILS.type.assertHTMLElement('options.container', gOptions.container);
    // UTILS.type.assertNonEmptyString('options.skin', gOptions.skin);
    
    gOptions.skinJsUrl = gOptions.skinJsUrl || getSkinJsHref(gOptions.skin);
    gOptions.skinCssUrl = gOptions.skinCssUrl || getSkinCssHref(gOptions.skin);
      

    this.setPayload('contrib-skin',{container:gOptions.container});

    loadSkin();
    //UTILS.type.assertNonEmptyString('options.trdRedirectUrl', gOptions.trdRedirectUrl);

    /*if (UTILS.type.isNullOrUndefined(gOptions.template)) {
      gOptions.template = getDefaultHTML();
    } else if (UTILS.type.isFunction(gOptions.template)) {
      gOptions.template = gOptions.template.call(null);
    } else {
      UTILS.type.assertNonEmptyString('options.template', gOptions.template);
    }

    gPassportCanvas = new PassportCanvas();*/

    return this;
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