/**
 * Copyright (C) 2014 yanni4night.com
 *
 * codes.js
 *
 * changelog
 * 2014-05-24[23:06:47]:authorized
 * 2014-06-13[09:44:05]:removed freeze;removed dependence of window&document
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */

(function(undefined) {
    "use strict";
    
    var codes = {
        SYSTEM_ERROR: {
            code: 10001,
            info: "未知错误"
        },
        PARAM_ERROR: {
            code: 10002,
            info: "参数错误"
        },
        CAPTCHA_FAILED: {
            code: 20221,
            info: "验证码验证失败 "
        },
        ACCOUNT_NOT_EXIST: {
            code: 20205,
            info: "帐号不存在"
        },
        ACCOUNT_NOT_EXIST_1: {
            code: 10009,
            info: "帐号不存在"
        },
        ACCOUNT_NOT_ACTIVED: {
            code: 20231,
            info: "登陆账号未激活"
        },
        ACCOUNT_KILLED: {
            code: 20232,
            info: "登陆账号被封杀"
        },
        ACCOUNT_PWD_WRONG: {
            code: 20206,
            info: "账号或密码错误"
        },
        LOGIN_TIME_OUT: {
            code: 100000,
            info: "登录超时"
        },
        NEED_USERNAME: {
            code: 100001,
            info: "请输入通行证用户名"
        },
        NEED_PASSWORD: {
            code: 100002,
            info: "请输入通行证密码"
        }
    };

    module.exports = codes;

})();