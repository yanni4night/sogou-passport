/**
 * Copyright (C) 2014 yanni4night.com
 *
 * dialog.js
 *
 * We attempt to show a login dialog in HTML.
 *
 * changelog
 * 2014-06-04[23:14:19]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
(function(window, document, undefined) {
  "use strict";

  var PassportSC = require('../core');
  var UTILS = require('../utils');
  var console = require('../console');

  //var IE6 = UTILS.getIEVersion() == '6';

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

  var PassportDialog = function(options) {
    var userid;
    this.options = {
      template: DEFAULT_HTML,
      style: null
    };

    UTILS.mixin(this.options, options);

    //FIXME by style
    //preload
    UTILS.dom.addLink('css/skin/default.css');

    var wrapper = this.wrapper = document.createElement('div');
    wrapper.id = wrapper.className = WRAPPER_ID;
    wrapper.innerHTML = this.options.template;
    document.body.appendChild(wrapper);

    this.initEvent();

    if (!!(userid = PassportSC.userid())) {
      UTILS.dom.id(USER_ID).value = userid;
    }

    PassportSC.on('loginfailed', function(e,data) {
      UTILS.dom.id(ERROR_ID).innerHTML = data.msg||'登录失败';
    }).on('loginsuccess', function(e,data) {
      UTILS.dom.id(ERROR_ID).innerHTML = '登录成功';
    }).on('needcaptcha', function(e,data) {
      UTILS.dom.id(ERROR_ID).innerHTML = '需要验证码';
    }).on('3rdlogincomplete', function(e,data) {
      UTILS.dom.id(ERROR_ID).innerHTML = '第三方登录完成';
    });
  };

  PassportDialog.prototype = {
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
        console.trace('user empty');
        return;
      }

      auto = auto$.checked;

      PassportSC.login(user, pass, auto);
    },
    show: function() {
      this.wrapper.style.display = 'block';
    },
    hide: function() {
      this.wrapper.style.display = 'none';
    }
  };

  var gPassportDialog = null;
  /**
   * [pop description]
   * @param  {Object} options
   * @return {this}
   */
  PassportSC.pop = function(options) {

    if (!this.isInitialized()) {
      throw new Error('You have to initialize passport before pop');
    }

    if (!gPassportDialog) {
      gPassportDialog = new PassportDialog(options);
    }
    gPassportDialog.show();
  };

})(window, document);