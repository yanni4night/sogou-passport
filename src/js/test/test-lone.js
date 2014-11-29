/**
 * Copyright (C) 2014 yanni4night.com
 *
 * test-lone.js
 *
 * changelog
 * 2014-06-08[16:18:43]:authorized
 * 2014-08-05[18:33:24]:add test for lone.now
 * 2014-08-06[11:03:40]:rename to 'test-lone'
 *
 * @author yanni4night@gmail.com
 * @version 0.1.2
 * @since 0.1.0
 */

(function() {
    var assert = require('assert');
    var type = require('../type');
    var lone = require('../lone');
    var console = require('../console');

    describe('Lone', function() {
        describe('#mixin()', function() {
            it('should mixin', function() {
                var src = {
                        x: 89
                    },
                    dest = {};
                assert.equal(89, lone.mixin(dest, src).x);
            })
        });

        describe('#getIEVersion()', function() {
            it('should get the version under Internet Explorer user agent', function() {
                var version = lone.getIEVersion();
                if (version) {
                    console.log('IE' + version);
                    assert(type.isInteger(version) && version > 4 && version < 12);
                }
            })
        });

        describe('#hideSource()', function() {
            it('should modify function source', function() {
                var demo = {
                    say: function(a, b, c) {}
                };
                var funcstr = lone.hideSource('say', demo.say).call(demo.say);
                assert(/say\(\s*\w\s*,\s*\w\s*,\s*\w\s*\)/.test(funcstr));
            });
        });

        describe('#now()', function() {
            it('should return UNIX timestamp', function() {
                assert(/\d{13}/.test(lone.now()));
            });
        });

    }); //describe
})();