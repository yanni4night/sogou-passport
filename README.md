passport
======

This is a tentative improvement for sogou passport javascript library.

Continuous developing is still on,see <http://passport.ufo.sogou-inc.com/>.

The version published will never change,if you need a continuous upgrading,'latest' version it is.

build
======

`grunt dist` or `grunt test`

test
======

`grunt karma` or `karma start`

history
======

- 0.2.0.141028:
    - fixed wrong string.trim
- 0.2.0.141023:
    - pop plugin support close on success
- 0.2.0.141016:
    - support immediate callback for 'login/'login3rd/logout'
    - 'vcode' cannot be void in 'login'
- 0.1.1.141015:
    - support mobile number
- 0.1.1.141014:
    - support third domain login(teemo.cn)
- 0.1.0.140917:
    - support pc token/cookie logining
- 0.0.9.140916:
    - rewrite sogou cookie parser,version 5 is supported
- 0.0.9.140822:
    - plugins supported;
    - pop function supported with jQuery sniffing;
- 0.0.8.140811-fix1:
    - Fixed crash about var undefined;
    - Fixed "far" submit button showed in IE7
- 0.0.8.140808-fixed3:
    - Moved utils.*hideSource/mixin/extend/getIEVersion* to lone;
    - Added a new `now` function in lone;
    - Export PassportSC.utils.*cookie*;
    - Get logined username in `email` cookie;
    - Fixed a bug when loading async;
    - Show required error message on dialog;
    - Fixed wrong submit bg on IE6;
- 0.0.8.140721:
    - Fixed css in draw plugin;
- 0.0.8.140709:
    - First beta version;

contact
======
 - <yinyong@sogou-inc.com>

license
======

![GPLv3](http://www.gnu.org/graphics/gplv3-88x31.png)
