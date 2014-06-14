/**
  * Copyright (C) 2014 yanni4night.com
  *
  * test-async.js
  *
  * changelog
  * 2014-06-14[21:38:22]:authorized
  *
  * @author yanni4night@gmail.com
  * @version 0.1.0
  * @since 0.1.0
  */
(function(){
    var assert = require('assert');
    var async = require('../async');

    describe('Async',function(){
        describe('#parallel()',function(){
            it('should callback when all sucess',function(done){
                async.parallel([function(callback){
                    setTimeout(function(){callback();},100);
                },function(callback){
                    setTimeout(function(){callback();},200);
                }],function(){
                    done();
                });
            });
        })
    });

})();