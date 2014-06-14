/**
 * Copyright (C) 2014 yanni4night.com
 *
 * async.js
 *
 * changelog
 * 2014-06-14[21:24:08]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
(function(undefined) {
  "use strict";
  
  var type = require('./type');
  var array = require('./array');
  var async = {
    /**
     * 
     * @param  {Array}   tasks
     * @param  {Function} callback
     */
    parallel: function(tasks, callback) {
      type.assertArray('tasks', tasks);
      type.assertFunction('callback', callback);

      var returned = false;
      var total = tasks.length;
      var count = 0;

      if(!total){
        return callback.call(null,null);
      }

      array.forEach(tasks, function(task) {
        task.call(null, function(err) {
          if (err && !returned) {
            callback.call(null, err);
            returned = true;
          } else {
            if (++count === total) {
              callback.call(null, null);
            }
          }
        });
      });
    }
  };

  module.exports = async;
})();