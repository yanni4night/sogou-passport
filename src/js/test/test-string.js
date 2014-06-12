/**
  * Copyright (C) 2014 yanni4night.com
  *
  * test-string.js
  *
  * changelog
  * 2014-06-12[11:14:05]:authorized
  *
  * @author yanni4night@gmail.com
  * @version 0.1.0
  * @since 0.1.0
  */
(function(){
    var assert = require('assert');
    var string = require('../string');

    describe('String',function(){

        describe('#startsWith()',function(){
            it('should return true if startsWith',function(){
                assert(string.startsWith('String','Str'));
            });
            it('should return false if not startsWith',function(){
                assert(!string.startsWith('String','Std'));
            });
        });

        describe('#endsWith()',function(){
            it('should return true if endsWith',function(){
                assert(string.endsWith('String','ing'));
            });
            it('should return false if not endsWith',function(){
                assert(!string.endsWith('String','xng'));
            });
        });

        describe('#trim()',function(){
            it('should return 0 if all empty', function() {
                assert.equal(0, string.trim('\x20\t\r\n\f').length);
            });
        });

    });

})();