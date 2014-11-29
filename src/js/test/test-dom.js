/**
 * Copyright (C) 2014 yanni4night.com
 *
 * test-dom.js
 *
 * changelog
 * 2014-06-12[09:05:27]:authorized
 * 2014-06-16[10:21:22]:add testing siblings
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */
(function(window, document, undefined) {
    var assert = require('assert');
    var dom = require('../dom');
    var console = require('../console');

    describe('Dom', function() {
        describe('find by id', function() {
            var expando = 'sogou-passport-dom-test' + (+new Date());
            var input = document.createElement('input');
            input.name = expando;
            document.body.appendChild(input);
            var div = document.createElement('div');
            div.id = expando;
            document.body.appendChild(div);

            it('should find div by id', function() {
                var ta = dom.id(expando);
                assert(!!ta && ta.tagName === 'DIV');
            });

        });

        describe('#hasClass()', function() {
            var div = document.createElement('div');
            document.body.appendChild(div);
            var clazz = div.className = 'sogou-passport-dom-test-has-' + (+new Date());

            it('should has the class', function() {
                assert(dom.hasClass(div, clazz));
            });

        });

        describe('#addClass()', function() {
            var div = document.createElement('div');
            document.body.appendChild(div);
            var clazz = 'sogou-passport-dom-test-add-' + (+new Date());

            dom.addClass(div, clazz);

            it('should has the class after adding', function() {
                assert(dom.hasClass(div, clazz));
            });
        });

        describe('#removeClass()', function() {
            var div = document.createElement('div');
            document.body.appendChild(div);
            var clazz = div.className = 'sogou-passport-dom-test-remove-' + (+new Date());

            dom.removeClass(div, clazz);

            it('should has no class after removing', function() {
                assert(!dom.hasClass(div, clazz));
            });
        });

        describe('#matches()', function() {
            var div = document.createElement('div');
            document.body.appendChild(div);
            var expando = div.className = div.id = 'sogou-passport-dom-test-matches-' + (+new Date());

            it('should matches', function() {
                assert(dom.matches(div, 'div.' + expando + '#' + expando));
            });
        });

        describe('#parents()', function() {
            var div = document.createElement('div');
            var expando = div.className = div.id = 'sogou-passport-dom-test-parents-' + (+new Date());
            div.innerHTML = '<div class="mx"><div class="mk"><span></span></div></div>';
            document.body.appendChild(div);

            it('should find the parent', function() {
                assert(!!dom.parents(div.getElementsByTagName('span')[0], 'div.' + expando + '#' + expando));
            });
        });

        describe('#siblings()', function() {
            var div = document.createElement('div');
            div.innerHTML = '<div class="mx"></div><div class="mx"></div><div class="mx"></div><span></span>';
            document.body.appendChild(div);

            it('should find the siblings', function() {
                assert(3===dom.siblings(div.getElementsByTagName('span')[0], 'div.mx').length);
            });
        });
    });

})(window, document);