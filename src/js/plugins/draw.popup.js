/**
  * Copyright (C) 2014 yanni4night.com
  *
  * draw.popup.js
  *
  * changelog
  * 2014-06-09[17:24:41]:authorized
  *
  * @author yanni4night@gmail.com
  * @version 0.1.0
  * @since 0.1.0
  */
(function(window, document, undefined) {
    "use strict";
    var draw = require('./draw');
    var UTILS = require('../utils');
    var PassportSC = draw.PassportSC;
    
    //TODO:create a mask and a fixed dialog
    
    PassportSC.popup = function (options) {
        //options
        return this.draw(options);
    };
    
    UTILS.hideSource('popup',PassportSC.popup);

    module.exports = {
        PassportSC : PassportSC
    };
})(window,document);