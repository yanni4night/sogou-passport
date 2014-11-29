/**
 * Copyright (C) 2014 yanni4night.com
 *
 * test-array.js
 *
 * changelog
 * 2014-06-08[13:27:08]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function() {
    "use strict";
    var assert = require("assert");
    var array = require('../array');
    describe('Array', function() {
        describe('#indexOf()', function() {
            it('should find the correct index', function() {
                assert.equal(2, array.indexOf([1, 2, 3], 3));
            });
            it('should return -1 when the value is not present', function() {
                assert.equal(-1, array.indexOf([1, 2, 3], 5));
                assert.equal(-1, array.indexOf([1, 2, 3, 4], 1, 1));
            });
        });

        describe('#forEach()', function() {
            it('should for each all', function() {
                var arr = [1, 2, 3, 4, 5, 6],
                    i = 0;
                array.forEach(arr, function() {
                    ++i;
                });
                assert.equal(i, arr.length);
            });
        });

        describe('#every()', function() {
            it('should return true when all elements gt 0', function() {
                assert.equal(true, array.every([1, 3, 4, 7], function(e) {
                    return e >= 0;
                }));
            });

            it('should return false when one element lnt 1', function() {
                assert.equal(false, array.every([1, 3, 4, 7], function(e) {
                    return e > 1;
                }));
            });
        });

        describe('#some()', function() {
            it('should return true when one element lt 2', function() {
                assert.equal(true, array.some([1, 3, 4, 7], function(e) {
                    return e < 2;
                }));
            });

            it('should return false when all element lnt 10', function() {
                assert.equal(false, array.some([1, 3, 4, 7], function(e) {
                    return e > 10;
                }));
            });
        });

        describe('#filter()', function() {
            it('should only one element left', function() {
                assert.equal(1, array.filter([1, 3, 4, 7], function(e) {
                    return e < 2;
                }).length);
            });
        });
    });
})();