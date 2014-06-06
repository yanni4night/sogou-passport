/**
 * Copyright (C) 2014 yanni4night.com
 *
 * array.js
 *
 * changelog
 * 2014-06-06[14:11:09]:authorized
 *
 * @info yinyong,osx-x64,UTF-8,10.129.169.219,js,/Volumes/yinyong/passport/src/js
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
(function() {
  "use strict";
  var UTILS = require('./utils');
  var array = {};

  /**
   * [indexOf description]
   * @param  {Array} arr
   * @param  {Object} ele
   * @param  {Integer} fromIndex
   * @return {Boolean}
   */
  array.indexOf = function(arr, ele, fromIndex) {
    if (!arr || !ele) {
      return -1;
    }

    fromIndex = fromIndex | 0;
    if (isNaN(fromIndex)) {
      fromIndex = 0;
    }
    if (fromIndex >= arr.length) {
      return -1;
    }
    if (fromIndex < 0) {
      fromIndex = arr.length + fromIndex;
      if (fromIndex < 0) {
        fromIndex = 0;
      }
    }

    if (Array.prototype.indexOf) {
      return Array.prototype.indexOf.call(arr, ele, fromIndex);
    } else {
      for (var i = fromIndex, len = arr.length; i < len; ++i) {
        if (ele === arr[i]) {
          return i;
        }
      }
    }

    return -1;
  };

  /**
   * [forEach description]
   * @param  {Array} arr
   * @param  {Function} callbackfn
   * @param  {Object} thisArg
   * @return {Undefined}
   */
  array.forEach = function(arr, callbackfn, thisArg) {
    if (!UTILS.isFunction(callbackfn)) return;

    if (Array.prototype.forEach) {
      return Array.prototype.forEach.call(arr, callbackfn, thisArg);
    }

    for (var i = 0, len = arr.length; i < len; ++i) {
      callbackfn.call(thisArg, arr[i], i, arr);
    }

  };
  /**
   * [every description]
   * @param  {Array} arr
   * @param  {Function} func
   * @return {Boolean}
   */
  array.each = array.every = function(arr, callbackfn, thisArg) {
    if (!arr || !UTILS.isFunction(callbackfn)) {
      return false;
    }

    //ES5
    if (Array.prototype.every) {
      return Array.prototype.every.call(arr, callbackfn, thisArg);
    } else {
      for (var i = 0, len = arr.length; i < len; ++i) {
        if (!callbackfn.call(thisArg, arr[i], i, arr)) {
          return false;
        }
      }
    }

    return true;
  };

  /**
   * [some description]
   * @param  {Array} arr
   * @param  {Function} callbackfn
   * @param  {Object} thisArg
   * @return {Boolean}
   */
  array.some = function(arr, callbackfn, thisArg) {
    if (!arr || !UTILS.isFunction(callbackfn)) {
      return false;
    }

    //ES5
    if (Array.prototype.some) {
      return Array.prototype.some.call(arr, callbackfn, thisArg);
    } else {
      for (var i = 0, len = arr.length; i < len; ++i) {
        if (true === callbackfn.call(thisArg, arr[i], i, arr)) {
          return true;
        }
      }
    }

    return false;
  };

  /**
   * [filter description]
   * @param  {Array} arr
   * @param  {Function} callbackfn
   * @param  {Object} thisArg
   * @return {Array}
   */
  array.filter = function(arr, callbackfn, thisArg) {
    if (!arr || arguments.length < 2) {
      return arr;
    }

    if (Array.prototype.filter) {
      return Array.prototype.filter.call(arr, callbackfn, thisArg);
    }

    var ret = [];
    array.forEach(arr, function(val, index) {
      if (callbackfn.call(thisArg, val, index, arr)) {
        ret.push(val);
      }
    });
    return ret;
  };
  module.exports = array;
})();