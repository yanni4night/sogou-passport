/**
 * Copyright (C) 2014 yanni4night.com
 *
 * test-type.js
 *
 * changelog
 * 2014-06-08[14:05:22]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function(window, document, undefined) {

    var assert = require("assert");
    var type = require('../type');

    describe('Type', function() {

        var rules = {
            "RegExp": {
                nec: ['x', 0, false, {},
                    [], null, undefined, new Date(), type.noop
                ],
                pos: [/regexp/, new RegExp()]
            },
            "Date": {
                nec: [/x/, 'x', 0, false, {},
                    [], null, undefined, type.noop
                ],
                pos: [new Date()]
            },
            "String": {
                nec: [/x/, 0, false, {},
                    [], null, undefined, new Date(), type.noop
                ],
                pos: ['string', new String()]
            },
            "Array": {
                nec: [/x/, 'x', 0, false, {
                    length: 1
                }, , null, undefined, new Date(), type.noop],
                pos: [
                    [], Array()
                ]
            },
            "Boolean": {
                nec: [/x/, 'x', 0, {},
                    [], null, undefined, new Date(), type.noop
                ],
                pos: [true, new Boolean()]
            },
            "Function": {
                nec: [/x/, 'x', 0, false, {},
                    [], null, undefined, new Date()
                ],
                pos: [type.noop, new Function()]
            },
            "Number": {
                nec: [/x/, 'x', false, {},
                    [], null, undefined, new Date(), type.noop
                ],
                pos: [2.3, new Number(), -9e-8, NaN, Number.MAX_VALUE, Number.POSITIVE_INFINITY]
            },
            "Object": {
                nec: ['x', 1, false, undefined, type.noop],
                pos: [
                    [], {},
                    new Object(), null, window, new Date(), new String, new RegExp()
                ]
            },
            "Empty": {
                nec: [/x/, 'x', 1, false, {},
                    new Date(), type.noop
                ],
                pos: ['', [], null, undefined]
            },
            "HTMLElement": {
                nec: [/x/, 'x', 1, false, {},
                    [], null, undefined, new Date(), type.noop
                ],
                pos: [document.documentElement, document.createElement('p')]
            },
            "PlainObject": {
                nec: ['x', 1, false, [], null, undefined, type.noop, window],
                pos: [{},
                    new Object()
                ]
            },
            "Undefined": {
                nec: [/x/, 'x', 1, false, {},
                    [], null, new Date(), type.noop
                ],
                pos: [undefined, this.__no]
            },
            "Null": {
                nec: [/x/, 'x', 1, false, {},
                    [], undefined, new Date(), type.noop
                ],
                pos: [null]
            },
            "Integer": {
                nec: [/x/, '2.2', 2e-3, 2.2, false, {},
                    [], null, undefined, new Date(), type.noop
                ],
                pos: [6, 1e2, 2.0, 0x9]
            },
            "NullOrUndefined": {
                nec: [/x/, 'x', 1, false, {},
                    [], new Date(), type.noop
                ],
                pos: [null, undefined]
            },
            "NonNullOrUndefined": {
                nec: [null, undefined],
                pos: [{}, /x/, [], '', false]
            },
            "NonEmptyString": {
                nec: [/x/, false, {},
                    [], null, undefined, new Date(), type.noop
                ],
                pos: ['x', new String('y')]
            }
        };


        function makeIs(e, i) {
            return function(e, i) {
                return function() {
                    assert(type['is' + e](rules[e].pos[i]));
                };
            }(e, i);
        }

        function makeNot(e, i) {
            return function(e, i) {
                return function() {
                    assert(!type['is' + e](rules[e].nec[i]));
                };
            }(e, i);
        }

        function makeAssert(e, i) {
            return function(e, i) {
                return function() {
                    assert.throws(function() {
                        type['assert' + e](rules[e].nec[i]);
                    });
                };
            }(e, i);
        }

        for (var e in rules) {
            for (var i = 0; i < rules[e].pos.length; ++i) {
                it('expecting ' + rules[e].pos[i] + ' to be ' + e, makeIs(e, i));
            }
            for (i = 0; i < rules[e].nec.length; ++i) {
                it('unexpecting ' + rules[e].nec[i] + ' to be ' + e, makeNot(e, i));
                it('throwing when' + rules[e].nec[i] + ' to be ' + e, makeAssert(e, i));
            }

        }

    });
})(window, document);