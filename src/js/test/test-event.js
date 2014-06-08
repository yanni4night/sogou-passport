/**
 * Copyright (C) 2014 yanni4night.com
 *
 * test-event.js
 *
 * changelog
 * 2014-06-08[17:07:12]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function() {
    var assert = require('assert');
    var Event = require('../event');

    describe('Event', function() {

        it('event emit', function() {
            var e = new Event(),
                cnt = 0,
                evtName = 'tick';
            var listener = function(evt, data) {
                ++cnt;
            };
            e.on(evtName, listener);
            e.emit(evtName);
            assert.equal(1, cnt);
            e.off(evtName, listener);
            e.emit(evtName);
            assert.equal(1, cnt);
        });
    }); //describe
})();