/**
 * Copyright (C) 2014 yanni4night.com
 *
 * test-utils.js
 *
 * changelog
 * 2014-06-08[16:18:43]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function() {
    var assert = require('assert');
    var utils = require('../utils');
    var console = require('../console');
    
    describe('Utils', function() {
        it('#mixin()',function(){
            var src = {x:89},dest= {};
            assert.equal(89,utils.mixin(dest,src).x);
        });

        it('#trim()',function(){
            assert.equal(0,utils.trim('\x20\t\r\n\f').length);
        });

        it('#getIEVersion()',function(){
            var version = utils.getIEVersion();
            if(version)
            {   
                console.log('IE'+version);
                assert(version>4&&version<12&&utils.type.isInteger(version));
            }
        });

    }); //describe
})();