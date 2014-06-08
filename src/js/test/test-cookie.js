/**
 * Copyright (C) 2014 yanni4night.com
 *
 * test-cookie.js
 *
 * changelog
 * 2014-06-08[16:55:18]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function(window, document, undefined) {
    var assert = require('assert');
    var PassportCookieParser = require('../cookie').PassportCookieParser;
    var console = require('../console');

    describe('Cookie', function() {

        it('userid parse', function() {
            if (navigator.cookieEnabled) {
                document.cookie = 'ppinf=2|1402199707|1403409307|bG9naW5pZDowOnx1c2VyaWQ6NDQ6QkY1NkM3NEU1MEM1Mjk1RTQ2MDBCNEE0NDRBQzMxQTBAcXEuc29odS5jb218c2VydmljZXVzZTozMDowMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDB8Y3J0OjA6fGVtdDoxOjB8YXBwaWQ6NDoxMTIwfHRydXN0OjE6MXxwYXJ0bmVyaWQ6MTowfHJlbGF0aW9uOjA6fHV1aWQ6MTY6YzA3YWYyODJhZTViNDI3eHx1aWQ6MTY6YzA3YWYyODJhZTViNDI3eHx1bmlxbmFtZTo0MzpOaWdodGluZ2FsZVkxMzYxJUU1JTlDJUE4JUU2JTkwJTlDJUU3JThCJTkwfHJlZnVzZXJpZDozMjpCRjU2Qzc0RTUwQzUyOTVFNDYwMEI0QTQ0NEFDMzFBMHxyZWZuaWNrOjEzOk5pZ2h0aW5nYWxlLll8';
                assert.equal('BF56C74E50C5295E4600B4A444AC31A0@qq.sohu.com', PassportCookieParser.parse().userid);
            }
        });
    }); //describe
})(window, document);