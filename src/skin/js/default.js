/**
 * Copyright (C) 2014 yanni4night.com
 *
 * default.js
 *
 * changelog
 * 2014-06-13[17:58:50]:authorized
 * 2014-06-15[11:30:42]:emit 'skin_loaded' instead of initSkin
 * 2014-06-24[10:28:01]:enabled placeholder polyfil;fixed captcha refresh
 * 2014-08-05[18:45:20]:add client_id for recover url
 * 2014-08-08[11:13:53]:show error message when user/pwd empty
 * 2014-08-08[20:53:09]:hide placeholder when auto username is set;auto focus
 *
 * @author yanni4night@gmail.com
 * @version 0.1.5
 * @since 0.1.0
 */

(function(window, document, undefined) {
  "use strict";

  var WRAPPER_ID = 'sogou-passport-pop';
  var USER_ID = 'sogou-passport-user';
  var PASS_ID = 'sogou-passport-pass';
  var CAPTCHA_WRAPPER_ID = 'sogou-passport-captcha-wrapper';
  var CAPTCHA_IMG_ID = 'sogou-passport-captchaimg';
  var CAPTCHA_ID = 'sogou-passport-captcha';
  var CHANGE_ID = 'sogou-passport-change';
  var AUTO_ID = 'sogou-passport-auto';
  var ERROR_ID = 'sogou-passport-error';
  var CLOSE_ID = 'sogou-passport-close';

  var PassportSC = window.PassportSC;
  var options = PassportSC.getOptions();
  var urls = PassportSC.getPassportUrls();
  var UTILS = PassportSC.utils;
  var type = UTILS.type;
  var array = UTILS.array;
  var console = UTILS.console;
  var cookie = UTILS.cookie;

  var errClearInter;

  var placeholderSupported = 'placeholder' in document.createElement('input');

  function getDefaultHTML() {
    var captionHTML = '<div class="sogou-passport-caption re">搜狗帐号登录' +
      '<a href="#" id="' + CLOSE_ID + '" class="ab sogou-passport-icon sogou-passport-icon-bx sogou-passport-close"></a>' +
      '</div>';
    var formHTML = '<form action="#" autocomplete="off" type="post">' +
      '<div id="sogou-passport-error" class="sogou-passport-error"></div>' +
      '<div class="sogou-passport-row re">' +
      (placeholderSupported ? '' : '<div class="sogou-passport-place ab">手机/邮箱/用户名</div>') +
      '<input type="text" class="sogou-passport-input" id="' + USER_ID + '" ' + (placeholderSupported ? 'placeholder="手机/邮箱/用户名"' : '') + '/>' +
      '<div class="sogou-passport-icon sogou-passport-icon-user ab"></div>' +
      '</div>' +
      '<div class="sogou-passport-row re">' +
      (placeholderSupported ? '' : '<div class="sogou-passport-place ab">密码</div>') +
      '<input type="password" class="sogou-passport-input" id="' + PASS_ID + '" ' + (placeholderSupported ? 'placeholder="密码"' : '') + '/>' +
      '<div class="sogou-passport-icon-lock sogou-passport-icon ab"></div>' +
      '</div>' +
      '<div class="sogou-passport-row re sogou-passport-captcha-wrapper" id="' + CAPTCHA_WRAPPER_ID + '">' +
      (placeholderSupported ? '' : '<div class="sogou-passport-place sogou-passport-place-captcha ab">验证码</div>') +
      '<input type="text" class="fl sogou-passport-input" id="' + CAPTCHA_ID + '" ' + (placeholderSupported ? 'placeholder="验证码"' : '') + '/>' +
      '<img src="about:blank" id="' + CAPTCHA_IMG_ID + '" alt="验证码" class="fl sogou-passport-captcha-img" border="0" title="点击切换"/>' +
      '<a id="' + CHANGE_ID + '" href="#" class="fl sogou-passport-change" title="点击切换">换一换</a>' +
      '<div class="clearfix"></div>' +
      '</div>' +
      '<div class="sogou-passport-row sogou-passport-autologin">' +
      '<input type="checkbox" id="' + AUTO_ID + '"/>' +
      '<label for="sogou-passport-auto">下次自动登录</label>' +
      '</div>' +
      '<div class="re sogou-passport-row sogou-passport-submitwrapper">' +
      '<input id="sogou-passport-submit" type="submit" value="登录" class="sogou-passport-submit">' +
      '<a href="' + (urls.recover + "?client_id=" + options.appid + "&ru=" + encodeURIComponent(location.href)) + '" class="ab sogou-passport-findpwd" target="_blank">找回密码</a>' +
      '<a href="' + (urls.register + "?client_id=" + options.appid + "&ru=" + encodeURIComponent(location.href) + '&client_id=' + options.appid) + '" class="ab sogou-passport-register" target="_blank">立即注册</a>' +
      '</div>' +
      '</form>';
    var trdHTML = '<div id="sogou-passport-3rd" class="sogou-passport-3rd">' +
      '<p class="sogou-passport-3rd-title">可以使用以下方式登录</p>' +
      '<div class="sogou-passport-3rd-icons">' +
      '<a href="#" data-provider="qq" class="fl sogou-passport-icon3rd sogou-passport-icon3rd-qq" title="QQ登录"></a>' +
      '<a href="#" data-provider="sina" class="fl sogou-passport-icon3rd sogou-passport-icon3rd-sina" title="微博登录"></a>' +
      '<a href="#" data-provider="renren" class="fl sogou-passport-icon3rd sogou-passport-icon3rd-renren" title="人人登录"></a>' +
      '</div>' +
      '</div>';
    return captionHTML + formHTML + trdHTML;
  }

  /**
   * show error message
   * @param  {[type]} msg [description]
   * @return {[type]}     [description]
   */
  var showErrMsg = function(msg) {
    clearTimeout(errClearInter);
    UTILS.dom.id(ERROR_ID).innerHTML = msg;
    setTimeout(function() {
      UTILS.dom.id(ERROR_ID).innerHTML = '';
    }, 5e3);
  };

  var PassportCanvas = function(options) {

    var events = PassportSC.getSupportedEvents();

    this.options = options;

    //listen
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
          data.msg = data.msg;
          break;
        default:
          ;
      }

      UTILS.dom.id(ERROR_ID).innerHTML = data.msg;
    });

    this.render();
  };

  function hidePlaceholder(input, silent) {
    var row = UTILS.dom.parents(input, '.sogou-passport-row'),
      placeholder = UTILS.dom.siblings(input, '.sogou-passport-place');
    if (row && !silent) {
      UTILS.dom.addClass(row, 'sogou-passport-hover');
    }
    array.forEach(placeholder, function(item) {
      item.style.display = 'none';
    });
  }

  function showPlaceholder(input, silent) {
    var row = UTILS.dom.parents(input, '.sogou-passport-row'),
      placeholder = UTILS.dom.siblings(input, '.sogou-passport-place');;
    if (row && !silent) {
      UTILS.dom.removeClass(row, 'sogou-passport-hover');
    }
    array.forEach(placeholder, function(item) {
      if (!input.value) {
        item.style.display = 'block';
      }
    });
  }

  //Hide placeholder polyfil;show border
  function focus(e) {
    var t = UTILS.dom.eventTarget(e);
    hidePlaceholder(t);
  }

  //Show placeholder polyfil;hide border
  function blur(e) {
    var t = UTILS.dom.eventTarget(e);
    showPlaceholder(t);
  }

  PassportCanvas.prototype = {
    render: function() {
      var self = this;
      var userid, $user, $pass;

      var wrapper = self.wrapper = document.createElement('div');
      wrapper.id = wrapper.className = WRAPPER_ID;
      wrapper.innerHTML = this.options.template;
      this.options.container.appendChild(wrapper);

      self.initEvent();

      $user = UTILS.dom.id(USER_ID);
      $pass = UTILS.dom.id(PASS_ID);

      userid = PassportSC.userid() || cookie.cookie('email');

      if (userid && /@so(?:hu|gou)\.com$/.test(userid)) {
        $user.value = userid;
        hidePlaceholder($user, true);
        $pass.focus();
      } else {
        $user.focus();
      }
    },
    initEvent: function() {
      var self = this;
      var $form = self.wrapper.getElementsByTagName('form')[0];
      //listen form submit
      UTILS.dom.bindEvent($form, 'submit', function(e) {
        var dom = UTILS.dom.eventTarget(e);
        UTILS.dom.preventDefault(e);
        console.trace('Passport form submitting');
        self.doPost();
        return false;
      });

      UTILS.dom.bindEvent(UTILS.dom.id(CLOSE_ID), 'click', function(e) {
        UTILS.dom.preventDefault(e);
        PassportSC.emit('canvasclosing', {});
      });

      var trdLoginArea = UTILS.dom.id('sogou-passport-3rd');
      if (trdLoginArea) {
        UTILS.dom.bindEvent(trdLoginArea, 'click', function(e) {
          var dom = UTILS.dom.eventTarget(e);
          UTILS.dom.preventDefault(e);
          var target = UTILS.dom.eventTarget(e);
          var provider;
          if (target && target.tagName.toUpperCase() === 'A' && (provider = target.getAttribute('data-provider'))) {
            return PassportSC.login3rd(provider, 'popup', self.options.trdRedirectUrl);
          }
        });
      }

      UTILS.dom.bindEvent(UTILS.dom.id(USER_ID), 'focus', focus);
      UTILS.dom.bindEvent(UTILS.dom.id(USER_ID), 'blur', blur);
      UTILS.dom.bindEvent(UTILS.dom.id(PASS_ID), 'focus', focus);
      UTILS.dom.bindEvent(UTILS.dom.id(PASS_ID), 'blur', blur);
      UTILS.dom.bindEvent(UTILS.dom.id(CAPTCHA_ID), 'focus', focus);
      UTILS.dom.bindEvent(UTILS.dom.id(CAPTCHA_ID), 'blur', blur);

      //Refresh captcha
      var change = function(e) {
        UTILS.dom.preventDefault(e);
        UTILS.dom.id(CAPTCHA_IMG_ID).src = PassportSC.getNewCaptcha();
      };
      UTILS.dom.bindEvent(UTILS.dom.id(CAPTCHA_IMG_ID), 'click', change);
      UTILS.dom.bindEvent(UTILS.dom.id(CHANGE_ID), 'click', change);
    },
    doPost: function() {
      var user$ = UTILS.dom.id(USER_ID),
        pass$ = UTILS.dom.id(PASS_ID),
        auto$ = UTILS.dom.id(AUTO_ID);
      var user, pass, auto;
      if (!(user = UTILS.string.trim(user$.value))) {
        showErrMsg('请输入用户名');
        return;
      } else if (!PassportSC.tools.validateUsername(user)) {
        showErrMsg('请填写正确格式的用户名');
        return;
      }

      if (!(pass = UTILS.string.trim(pass$.value))) {
        showErrMsg('请输入密码');
        return;
      } else if (!PassportSC.tools.validatePassword(pass)) {
        showErrMsg('请填写正确格式的密码');
        return;
      }

      auto = auto$.checked;

      PassportSC.login(user, pass, UTILS.dom.id(CAPTCHA_ID).value, auto);
    }
  };

  var evtLoaded = PassportSC.getSupportedEvents().skin_loaded;

  //This has to be emited to indicate skin loaded.
  PassportSC.emit(evtLoaded, {
    init: function() {
      var skinOptions = this.getPayload('contrib-skin');
      if (!skinOptions) {
        throw new Error('Skin initializing need a skinOption,make sure you never clear "contrib-skin" payload');
      }
      type.assertHTMLElement('container', skinOptions.container);

      skinOptions.template = getDefaultHTML();

      new PassportCanvas(skinOptions);
    }
  });

})(window, document);