/**
 * Copyright (C) 2014 yanni4night.com
 *
 * test-math.js
 *
 * changelog
 * 2014-06-08[16:38:42]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function() {
    var assert = require('assert');
    var math = require('../math');
    var console = require('../console');
    
    describe('Math', function() {

        it('base64 decode', function() {
            assert.equal(escape('搜狗passport'), math.utf8to16(math.b64_decodex('JXU2NDFDJXU3MkQ3cGFzc3BvcnQ=')));
        });
        it('create 32 bytes uuid', function() {
            assert.equal(32, math.uuid().length);
        });
    }); //describe
})();