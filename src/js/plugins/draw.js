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
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */
(function(window, document, undefined) {
  "use strict";

  var core = require('../core');
  var PassportSC = core.PassportSC;
  var UTILS = require('../utils');
  var console = require('../console');

  //var IE6 = UTILS.getIEVersion() === 6;

  var WRAPPER_ID = 'sogou-passport-pop';
  var FORM_ID = 'sogou-passport-form';
  var USER_ID = 'sogou-passport-user';
  var PASS_ID = 'sogou-passport-pass';
  var AUTO_ID = 'sogou-passport-auto';
  var ERROR_ID = 'sogou-passport-error';

  var DEFAULT_HTML = '' +
    '<div class="sogou-passport-caption">搜狗帐号登录</div>' +
    '<form id="' + FORM_ID + '" action="#" autocomplete="off" type="post">' +
    '<div id="sogou-passport-error" class="sogou-passport-error"></div>' +
    '<div class="sogou-passport-row re">' +
    '<input type="text" class="sogou-passport-input" id="' + USER_ID + '" placeholder="手机/邮箱/用户名"/>' +
    '</div>' +
    '<div class="sogou-passport-row re">' +
    '<input type="password" class="sogou-passport-input" id="' + PASS_ID + '" placeholder="密码"/>' +
    '</div>' +
    '<div class="sogou-passport-row sogou-passport-autologin">' +
    '<input type="checkbox" id="' + AUTO_ID + '"/>' +
    '<label for="sogou-passport-auto">下次自动登录</label>' +
    '<a href="#" class="fr" target="_blank">找回密码</a>' +
    '</div>' +
    '<div class="sogou-passport-row sogou-passport-submitwrapper">' +
    '<input id="sogou-passport-submit" type="submit" value="登录" class="sogou-passport-submit">' +
    '</div>' +
    '</form>';
    var gPassportCanvas = null;
    var defaultOptions = {
      container:null,
      style:null,
      template:DEFAULT_HTML
    };
    var gOptions = null;

    core.addSupportedEvent('draw_complete','drawcomplete');

    /**
     * Parse a link src by style parameter.
     * 
     * @param  {String|Function} style
     * @return {String} Parsed link src
     * @throws {Error} If parsed failed
     */
    function styleParser (style) {
      var src;
      switch(true){
        case UTILS.type.isNullOrUndefined(style):
        case 'default' === style:
          src =  'css/skin/default.css'
          break;
        case UTILS.type.isNonEmptyString(style)&&/\.css$/i.test(style):
          src = style;
          break;
        case UTILS.type.isFunction(style):
          src = style.call(null);
        default:
          throw new Error('Unrecognized style: [' + style + ']');
        ;
      }

      return src;
    }

  var PassportCanvas = function() {

    PassportSC.on('loginfailed', function(e, data) {
      UTILS.dom.id(ERROR_ID).innerHTML = data.msg || '登录失败';
    }).on('loginsuccess', function(e, data) {
      UTILS.dom.id(ERROR_ID).innerHTML = '登录成功';
    }).on('needcaptcha', function(e, data) {
      UTILS.dom.id(ERROR_ID).innerHTML = '需要验证码';
    }).on('3rdlogincomplete', function(e, data) {
      UTILS.dom.id(ERROR_ID).innerHTML = '第三方登录完成';
    });

    this.render();
  };

  PassportCanvas.prototype = {
    render:function(){
      var self = this;
      var userid;

      var src = styleParser(gOptions.style);

      UTILS.dom.addLink(src, function() {
        var wrapper = self.wrapper = document.createElement('div');
        wrapper.id = wrapper.className = WRAPPER_ID;
        wrapper.innerHTML = gOptions.template;
        gOptions.container.appendChild(wrapper);

        PassportSC.emit('draw_complete');

        self.initEvent();
        if (!!(userid = PassportSC.userid())) {
          UTILS.dom.id(USER_ID).value = userid;
        }
      });
    },
    initEvent: function() {
      var self = this;
      UTILS.dom.bindEvent(UTILS.dom.id(FORM_ID), 'submit', function(e) {
        var dom = UTILS.dom.eventTarget(e);
        UTILS.dom.preventDefault(e);
        console.trace('Passport form submitting');
        self.doPost();
        return false;
      });
    },
    doPost: function() {
      var user$, pass$, auto$;
      var user, pass, auto;
      if (!(user$ = UTILS.dom.id(USER_ID))) {
        console.error('Element[#' + USER_ID + '] does not exist');
        return;
      }
      if (!(pass$ = UTILS.dom.id(PASS_ID))) {
        console.error('Element[#' + PASS_ID + '] does not exist');
        return;
      }
      if (!(auto$ = UTILS.dom.id(AUTO_ID))) {
        console.error('Element[#' + AUTO_ID + '] does not exist');
        return;
      }
      if (!(user = UTILS.trim(user$.value))) {
        console.trace('user empty');
        return;
      }
      if (!(pass = UTILS.trim(pass$.value))) {
        console.trace('pass empty');
        return;
      }

      auto = auto$.checked;

      PassportSC.login(user, pass, auto);
    }
  };

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

    if(gPassportCanvas){
      return this;
    }
    gOptions = UTILS.mixin(defaultOptions,options)

    UTILS.type.assertHTMLElement('options.container',options.container);

    gPassportCanvas = new PassportCanvas();

    return this;
  };

  UTILS.hideSource('draw',PassportSC.draw);

  module.exports = {
    PassportSC:PassportSC
  };
})(window, document);