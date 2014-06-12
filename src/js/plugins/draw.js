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

  var core = require('../core');
  var PassportSC = core.PassportSC;
  var UTILS = require('../utils');
  var console = require('../console');

  var placeholderSupported = 'placeholder' in document.createElement('input');
  var domainList = ["sohu.com", "chinaren.com", "sogou.com", "vip.sohu.com", "17173.com", "focus.cn", "game.sohu.com", "37wanwan.com"];
  var WRAPPER_ID = 'sogou-passport-pop';
  var FORM_ID = 'sogou-passport-form';
  var USER_ID = 'sogou-passport-user';
  var PASS_ID = 'sogou-passport-pass';
  var CAPTCHA_WRAPPER_ID = 'sogou-passport-captcha-wrapper';
  var CAPTCHA_IMG_ID = 'sogou-passport-captchaimg';
  var CAPTCHA_ID = 'sogou-passport-captcha';
  var AUTO_ID = 'sogou-passport-auto';
  var ERROR_ID = 'sogou-passport-error';
  core.addSupportedEvent('draw_complete', 'drawcomplete');
  core.addFixedUrl('register', 'https://account.sogou.com/web/reg/email'); //ru&client_id
  core.addFixedUrl('recover', 'https://passport.sohu.com/web/RecoverPwdInput.action'); //ru

  function getDefaultHTML() {
    return '' +
      '<div class="sogou-passport-caption">搜狗帐号登录' +
      '<a href="#" class="ab sogou-passport-icon sogou-passport-icon-bx sogou-passport-close"></a>' +
      '</div>' +
      '<form id="' + FORM_ID + '" action="#" autocomplete="off" type="post">' +
      '<div id="sogou-passport-error" class="sogou-passport-error"></div>' +
      '<div class="sogou-passport-row re">' +
      '<input type="text" class="sogou-passport-input" id="' + USER_ID + '" placeholder="手机/邮箱/用户名"/>' +
      '<div class="sogou-passport-icon sogou-passport-icon-user ab"></div>' +
      '</div>' +
      '<div class="sogou-passport-row re">' +
      '<input type="password" class="sogou-passport-input" id="' + PASS_ID + '" placeholder="密码"/>' +
      '<div class="sogou-passport-icon-lock sogou-passport-icon ab"></div>' +
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
      '<a href="' + core.getFixedUrls().recover + "?ru=" + encodeURIComponent(location.href) + '" class="ab sogou-passport-findpwd" target="_blank">找回密码</a>' +
      '<a href="' + (core.getFixedUrls().register + "?ru=" + encodeURIComponent(location.href) + '&client_id=' + PassportSC.getOptions().appid) + '" class="ab sogou-passport-register" target="_blank">立即注册</a>' +
      '</div>' +
      '</form>' +
      '<div id="sogou-passport-3rd" class="sogou-passport-3rd">' +
      '<p class="sogou-passport-3rd-title">可以使用以下方式登录</p>' +
      '<div class="sogou-passport-3rd-icons">' +
      '<a href="#" data-provider="qq" class="fl sogou-passport-icon3rd sogou-passport-icon3rd-qq" title="QQ登录"></a>' +
      '<a href="#" data-provider="sina" class="fl sogou-passport-icon3rd sogou-passport-icon3rd-sina" title="微博登录"></a>' +
      '<a href="#" data-provider="renren" class="fl sogou-passport-icon3rd sogou-passport-icon3rd-renren" title="人人登录"></a>' +
      '</div>' +
      '</div>';
  }
  var gPassportCanvas = null;
  var defaultOptions = {
    container: null,
    style: null,
    trdRedirectUrl: null,
    template: null
  };
  var gOptions = null;

  /**
   * Compute css url.
   *
   * @param  {String} name
   * @return {String} url
   */
  function getCssHref(name) {
    return (UTILS.type.debug ? '/dist' : 'http://s.account.sogoucdn.com/u/api') + '/@version@/css/skin/' + name + '/style.css';
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
        throw new Error('Unrecognized style: [' + style + ']');
    }

    return src;
  }

  var PassportCanvas = function() {

    var events = core.getSupportedEvents();

    PassportSC.on([events.login_failed, events.login_success, events.third_party_login_complete, events.param_error].join(' '), function(e, data) {

      data = data || {};
      var needcaptcha = !!data.captchaimg;

      var $captcha = UTILS.dom.id(CAPTCHA_ID);
      var $user = UTILS.dom.id(USER_ID);
      var $pass = UTILS.dom.id(PASS_ID);

      UTILS.dom.id(CAPTCHA_WRAPPER_ID).style.display = (needcaptcha || ('paramerror' === e.type && 'captcha' === data.name) ? 'block' : 'none');

      if (needcaptcha) {
        UTILS.dom.id(CAPTCHA_IMG_ID).src = data.captchaimg;
        $captcha.focus();
      }

      switch (e.type) {
        case events.login_failed:
          $pass.value = '';
          $captcha.value = '';
          $pass.focus();
          break;
        case events.param_error:
          if ('username' === data.name) {
            $user.focus();
            $user.select();
          } else if ('password' === data.name) {
            $pass.focus();
            $pass.select();
          } else if ('captcha' === data.name) {
            $captcha.focus();
            $captcha.select();
          }
          break;
        case events.third_party_login_complete:
          data.msg = data.msg || '第三方登录成功';
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

        self.initEvent();
        PassportSC.emit('draw_complete');
        if (!!(userid = PassportSC.userid()) && /@so(?:hu|gou)\.com$/.test(userid)) {
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

      var trdLoginArea = UTILS.dom.id('sogou-passport-3rd');
      if (trdLoginArea) {
        UTILS.dom.bindEvent(trdLoginArea, 'click', function(e) {
          var dom = UTILS.dom.eventTarget(e);
          UTILS.dom.preventDefault(e);
          var target = UTILS.dom.eventTarget(e);
          var provider;
          if (target && target.tagName.toUpperCase() === 'A' && (provider = target.getAttribute('data-provider'))) {
            return PassportSC.login3rd(provider, 'popup', gOptions.trdRedirectUrl);
          }
        });
      }

      var focus = function(e) {
        var t = UTILS.dom.eventTarget(e);
        var row = UTILS.dom.parents(t, '.sogou-passport-row');
        if (row) {
          UTILS.dom.addClass(row, 'sogou-passport-hover');
        }
      };

      var blur = function(e) {
        var t = UTILS.dom.eventTarget(e);
        var row = UTILS.dom.parents(t, '.sogou-passport-row');
        if (row) {
          UTILS.dom.removeClass(row, 'sogou-passport-hover');
        }
      };

      UTILS.dom.bindEvent(UTILS.dom.id(USER_ID), 'focus', focus);
      UTILS.dom.bindEvent(UTILS.dom.id(USER_ID), 'blur', blur);
      UTILS.dom.bindEvent(UTILS.dom.id(PASS_ID), 'focus', focus);
      UTILS.dom.bindEvent(UTILS.dom.id(PASS_ID), 'blur', blur);
      UTILS.dom.bindEvent(UTILS.dom.id(CAPTCHA_ID), 'focus', focus);
      UTILS.dom.bindEvent(UTILS.dom.id(CAPTCHA_ID), 'blur', blur);

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
      if (!(user = UTILS.string.trim(user$.value))) {
        console.trace('user empty');
        return;
      }
      if (!(pass = UTILS.string.trim(pass$.value))) {
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

    UTILS.type.assertHTMLElement('options.container', gOptions.container);
    UTILS.type.assertNonEmptyString('options.trdRedirectUrl', gOptions.trdRedirectUrl);

    if (UTILS.type.isNullOrUndefined(gOptions.template)) {
      gOptions.template = getDefaultHTML();
    } else if (UTILS.tyep.isFunction(gOptions.template)) {
      gOptions.template = gOptions.template.call(null);
    } else {
      type.assertNonEmptyString('options.template', gOptions.template);
    }

    gPassportCanvas = new PassportCanvas();

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