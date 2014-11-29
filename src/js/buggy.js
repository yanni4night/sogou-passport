/**
 * Copyright (C) 2014 yanni4night.com
 *
 * buggy.js
 *
 * changelog
 * 2014-06-07[10:08:13]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

"use strict";

var expando = require('./type').expando;

var Buggy = {
    /**
     * "getElementById" is buggy on IE6/7.
     *
     * @ignore
     * @see  https://github.com/jquery/sizzle/blob/96728dd43c62dd5e94452f18564a888e7115f936/src/sizzle.js#L528
     * @property
     */
    getElementById: (function(document) {
        var div = document.createElement('div');

        //document.body is null here
        document.documentElement.appendChild(div).setAttribute('id', expando);

        var buggy = document.getElementsByName && document.getElementsByName(expando).length;

        document.documentElement.removeChild(div);

        div = null;

        return !!buggy;
    })(document)
};

module.exports = Buggy;