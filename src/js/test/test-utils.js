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
        describe('#mixin()', function() {
            it('should mixin', function() {
                var src = {
                        x: 89
                    },
                    dest = {};
                assert.equal(89, utils.mixin(dest, src).x);
            })
        });

        describe('#getIEVersion()', function() {
            it('should get the version under Internet Explorer user agent', function() {
                var version = utils.getIEVersion();
                if (version) {
                    console.log('IE' + version);
                    assert(utils.type.isInteger(version) && version > 4 && version < 12);
                }
            })
        });

        describe('#hideSource()', function() {
            it('should modify function source', function() {
                var demo = {
                    say: function(a, b, c) {}
                };
                var funcstr = utils.hideSource('say', demo.say).call(demo.say);
                assert(/say\(\s*\w\s*,\s*\w\s*,\s*\w\s*\)/.test(funcstr));
            });
        });

    }); //describe
})();