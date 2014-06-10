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
  //
  var placeholderSupported = 'placeholder' in document.createElement('input');

  var WRAPPER_ID = 'sogou-passport-pop';
  var FORM_ID = 'sogou-passport-form';
  var USER_ID = 'sogou-passport-user';
  var PASS_ID = 'sogou-passport-pass';
  var CAPTCHA_WRAPPER_ID = 'sogou-passport-captcha-wrapper';
  var CAPTCHA_IMG_ID = 'sogou-passport-captchaimg';
  var CAPTCHA_ID = 'sogou-passport-captcha';
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
    '<div class="sogou-passport-row re sogou-passport-captcha-wrapper" id="' + CAPTCHA_WRAPPER_ID + '">' +
    '<input type="text" class="fl sogou-passport-input" id="' + CAPTCHA_ID + '" placeholder="验证码"/>' +
    '<img src="about:blank" id="' + CAPTCHA_IMG_ID + '" alt="验证码" class="fl sogou-passport-captcha-img" border="0"/>' +
    '<a href="#" class="fl h-fil">换一换</a>' +
    '<div class="clearfix"></div>' +
    '</div>' +
    '<div class="sogou-passport-row sogou-passport-autologin">' +
    '<input type="checkbox" id="' + AUTO_ID + '"/>' +
    '<label for="sogou-passport-auto">下次自动登录</label>' +
    '</div>' +
    '<div class="re sogou-passport-row sogou-passport-submitwrapper">' +
    '<input id="sogou-passport-submit" type="submit" value="登录" class="sogou-passport-submit">' +
    '<a href="#" class="ab sogou-passport-findpwd" target="_blank">找回密码</a>' +
    '<a href="#" class="ab sogou-passport-register" target="_blank">立即注册</a>' +
    '</div>' +
    '</form>' +
    '<div class="sogou-passport-3rd">' +
    '<p class="sogou-passport-3rd-title">可以使用以下方式登录</p>' +
    '</div>' +
    '';
  var gPassportCanvas = null;
  var defaultOptions = {
    container: null,
    style: null,
    template: DEFAULT_HTML
  };
  var gOptions = null;

  core.addSupportedEvent('draw_complete', 'drawcomplete');

  /**
   * Compute css url.
   * 
   * @param  {String} name
   * @return {String} url
   */
  function getCssHref(name){
    return(UTILS.type.debug ? '/dist' : 'http://s.account.sogoucdn.com/u/api') +'/@version@/css/skin/'+ name+'.css';
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
        src = getCssHref('default');
        break;
      case UTILS.type.isNonEmptyString(style) && /\.css/i.test(style):
        src = style;
        break;
      case UTILS.type.isFunction(style):
        src = style.call(null);
      default:
        throw new Error('Unrecognized style: [' + style + ']');;
    }

    return src;
  }

  var PassportCanvas = function() {

    PassportSC.on('loginfailed loginsuccess 3rdlogincomplete paramerror', function(e, data) {

      var needcaptcha = !!data.captchaimg;

      UTILS.dom.id(CAPTCHA_WRAPPER_ID).style.display = (needcaptcha || ('paramerror' === e.type && 'captcha' === data.name) ? 'block' : 'none');

      if (needcaptcha) {
        UTILS.dom.id(CAPTCHA_IMG_ID).src = data.captchaimg;
        UTILS.dom.id(CAPTCHA_ID).focus();
      }

      switch (e.type) {
        case 'loginfailed':
          UTILS.dom.id(PASS_ID).value = '';
          UTILS.dom.id(CAPTCHA_ID).value = '';
          UTILS.dom.id(PASS_ID).focus();
          break;
        case 'paramerror':
          if ('username' === data.name) {
            UTILS.dom.id(USER_ID).focus();
            UTILS.dom.id(USER_ID).select();
          } else if ('password' === data.name) {
            UTILS.dom.id(PASS_ID).focus();
            UTILS.dom.id(PASS_ID).select();
          } else if ('captcha' === data.name) {
            UTILS.dom.id(CAPTCHA_ID).focus();
            UTILS.dom.id(CAPTCHA_ID).select();
          }
          break;
          break;
        default:
          ;
      }

      UTILS.dom.id(ERROR_ID).innerHTML = data.msg;
    });

    this.render();
  };

  PassportCanvas.prototype = {
    render: function() {
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

      PassportSC.login(user, pass, UTILS.dom.id(CAPTCHA_ID).value, auto);
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

    if (gPassportCanvas) {
      return this;
    }
    gOptions = UTILS.mixin(defaultOptions, options)

    UTILS.type.assertHTMLElement('options.container', options.container);

    gPassportCanvas = new PassportCanvas();

    return this;
  };

  UTILS.hideSource('draw', PassportSC.draw);

  module.exports = {
    PassportSC: PassportSC
  };
})(window, document);