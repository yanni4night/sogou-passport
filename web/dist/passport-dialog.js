!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){!function(){"use strict";var c=a("./type"),d={};d.indexOf=function(a,b,c){var d,e;if(!a||!b)return-1;if(c=0|c,isNaN(c)&&(c=0),c>=a.length)return-1;if(0>c&&(c=a.length+c,0>c&&(c=0)),Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b,c);for(d=c,e=a.length;e>d;++d)if(b===a[d])return d;return-1},d.forEach=function(a,b,d){var e,f;if(c.assertNonNullOrUndefined("arr",a),c.assertFunction("callbackfn",b),Array.prototype.forEach)return Array.prototype.forEach.call(a,b,d);for(e=0,f=a.length;f>e;++e)b.call(d,a[e],e,a)},d.each=d.every=function(a,b,d){var e,f;if(c.assertNonNullOrUndefined("arr",a),c.assertFunction("callbackfn",b),Array.prototype.every)return Array.prototype.every.call(a,b,d);for(e=0,f=a.length;f>e;++e)if(!b.call(d,a[e],e,a))return!1;return!0},d.some=function(a,b,d){var e,f;if(c.assertNonNullOrUndefined("arr",a),c.assertFunction("callbackfn",b),Array.prototype.some)return Array.prototype.some.call(a,b,d);for(e=0,f=a.length;f>e;++e)if(!0===b.call(d,a[e],e,a))return!0;return!1},d.filter=function(a,b,e){var f=[];return c.assertNonNullOrUndefined("arr",a),c.assertFunction("callbackfn",b),Array.prototype.filter?Array.prototype.filter.call(a,b,e):(d.forEach(a,function(c,d){b.call(e,c,d,a)&&f.push(c)}),f)},b.exports=d}()},{"./type":11}],2:[function(a,b){!function(c,d){"use strict";var e=a("./type").expando,f={getElementById:function(a){var b=a.createElement("div");a.documentElement.appendChild(b).setAttribute("id",e);var c=a.getElementsByName&&a.getElementsByName(e).length;return a.documentElement.removeChild(b),b=null,!!c}(d)};b.exports=f}(window,document)},{"./type":11}],3:[function(a,b){!function(){"use strict";var c=a("./utils"),d={SYSTEM_ERROR:{code:10001,info:"未知错误"},PARAM_ERROR:{code:10002,info:"参数错误"},CAPTCHA_FAILED:{code:20221,info:"验证码验证失败 "},ACCOUNT_NOT_EXIST:{code:20205,info:"帐号不存在"},ACCOUNT_NOT_EXIST_1:{code:10009,info:"帐号不存在"},ACCOUNT_NOT_ACTIVED:{code:20231,info:"登陆账号未激活"},ACCOUNT_KILLED:{code:20232,info:"登陆账号被封杀"},ACCOUNT_PWD_WRONG:{code:20206,info:"账号或密码错误"},LOGIN_TIME_OUT:{code:1e5,info:"登录超时"},NEED_USERNAME:{code:100001,info:"请输入通行证用户名"},NEED_PASSWORD:{code:100002,info:"请输入通行证密码"}};c.freeze(d),b.exports=d}(window,document)},{"./utils":12}],4:[function(a,b){!function(c){"use strict";var d=a("./type"),e=c.console;e&&d.strobject===typeof e||(e={});for(var f="trace,info,log,debug,warn,error".split(","),g=f.length-1;g>=0;g--)e[f[g]]=e[f[g]]||d.noop;b.exports=e}(window)},{"./type":11}],5:[function(a,b){!function(c,d){"use strict";var e=a("./utils"),f={cookie:{},getCookie:function(){return this.cookie},parsePassportCookie:function(){var a,b,f,g;if(!0!==(c.navigator&&navigator.cookieEnabled))return this;this.cookie={};var h=d.cookie.split("; ");for(b=0;b<h.length;++b)if(g=h[b].match(/^p(?:pinf|pinfo|assport)=(.+)$/),g&&g[1]){a=g[1];break}if(!a)return this;try{f=unescape(a).split("|"),("1"==f[0]||"2"==f[0]&&f[3])&&this._parsePassportCookie(e.math.utf8to16(e.math.b64_decodex(f[3])))}catch(i){}return this},_parsePassportCookie:function(a){for(var b,c,d,e,f=0,g=a.indexOf(":",f);-1!=g&&(b=a.substring(f,g),e=a.indexOf(":",g+1),-1!=e)&&(c=parseInt(a.substring(g+1,e)),d=a.substr(e+1,c),"|"==a.charAt(e+1+c));)this.cookie[b]=d,f=e+2+c,g=a.indexOf(":",f);return this}};b.exports={PassportCookieParser:{parse:function(){return f.parsePassportCookie().getCookie()}}}}(window,document)},{"./utils":12}],6:[function(a,b){!function(c,d,e){"use strict";function f(a){var b=x;return b&&m.strobject===typeof b&&m.strundefined!==typeof b.appendChild&&b.parentNode||(b=x=d.createElement("div"),b.style.cssText=p,b.className=b.id=o,d.body.appendChild(b)),m.isFunction(a)&&a(b),b}function g(a){var b,c,d,e,f;for(f=v={},m.assertPlainObject("options",a),i.mixin(f,y),i.mixin(f,a),b=u.length-1;b>=0;--b)for(d=u[b],c=d.name.length-1;c>=0;--c)if(e=d.name[c],!d.validate(e,f[e]))throw new Error(m.strfunction===typeof d.errmsg?d.errmsg(e,f[e]):d.errmsg);f._token=i.math.uuid()}function h(a,b){return a.replace(/<%=([\w\-]+?)%>/g,function(a,c){var d=b[c];return e===d?"":d})}var i=a("./utils"),j=a("./codes"),k=a("./console"),l=a("./event"),m=i.type,n=a("./cookie").PassportCookieParser,o=m.expando,p="width:1px;height:1px;position:absolute;left:-100000px;display:block;",q={login_success:"loginsuccess",login_failed:"loginfailed",logout_success:"logoutsuccess",need_captcha:"needcaptcha",third_party_login_complete:"3rdlogincomplete"},r={login:"https://account.sogou.com/web/login",logout:"https://account.sogou.com/web/logout_js",captcha:"https://account.sogou.com/captcha",trdparty:"http://account.sogou.com/connect/login"},s={size:{renren:[880,620],sina:[780,640],qq:[500,300]}},t='<form method="post" action="'+r.login+'" target="'+o+'"><input type="hidden" name="username" value="<%=username%>"><input type="hidden" name="password" value="<%=password%>"><input type="hidden" name="captcha" value="<%=vcode%>"><input type="hidden" name="autoLogin" value="<%=autoLogin%>"><input type="hidden" name="client_id" value="<%=appid%>"><input type="hidden" name="xd" value="<%=redirectUrl%>"><input type="hidden" name="token" value="<%=token%>"></form><iframe name="'+o+'" src="about:blank" style="'+p+'"></iframe>',u=[{name:["appid"],validate:function(a,b){return b&&(m.strstr===typeof b||m.strnumber===typeof b)},errmsg:function(a){return'"'+a+'" SHOULD be a string or a number'}},{name:["redirectUrl"],validate:function(a,b){return b&&m.strstr===typeof b&&new RegExp("^"+location.protocol+"//"+location.host,"i").test(b)},errmsg:function(a){return'"'+a+'" SHOULD be a URL which has the some domain as the current page'}}],v=null,w=null,x=null,y={appid:null,redirectUrl:null},z="Passport has not been initialized yet",A={version:"0.1.7",init:function(a){return this.isInitialized()?k.warn("Passport has already been initialized"):(k.trace("Initialize passport"),g(a)),w},login:function(a,b,c,d){if(!this.isInitialized())throw new Error(z);k.trace("logining with:"+Array.prototype.join.call(arguments));var e;arguments.length<4&&(d=c,c=""),m.assertNonEmptyString("username",a),m.assertNonEmptyString("password",b),e={username:a,password:b,vcode:c||"",autoLogin:+!!d,appid:v.appid,redirectUrl:v.redirectUrl,token:v._token},f(function(a){a.innerHTML=h(t,e),a.getElementsByTagName("form")[0].submit()})},login3rd:function(a,b,d){if(!this.isInitialized())throw new Error(z);m.assertNonEmptyString("provider",a);var e=s.size[a];if(!e)throw new Error('provider:"'+a+'" is not supported in  third party login');"popup"===b?m.assertNonEmptyString("redirectUrl",d):m.isUndefined(b)?(b="page",d=location.href):d=d||location.href;var f=r.trdparty+"?client_id="+v.appid+"&provider="+a+"&ru="+encodeURIComponent(d);if("popup"===b){var g=(c.screen.availWidth-e[0])/2;c.open(f,"","height="+e[1]+",width="+e[0]+",top=80,left="+g+",toolbar=no,menubar=no")}else{if("page"!==b)throw new Error('display:"'+b+'" is not supported in third party login');location.href=f}},logout:function(){if(!this.isInitialized())throw new Error(z);k.trace("logouting");var a=this,b=r.logout+"?client_id="+v.appid;f(function(c){i.dom.addIframe(c,b,function(){a.emit(q.logout_success)})})},userid:function(){if(!this.isInitialized())throw new Error(z);return n.parse().userid||""},_logincb:function(a){if(!this.isInitialized())return void k.trace("Login callback received but [Passport] has not been initialized");if(a&&m.strobject===typeof a)if(0===+a.status)this.emit(q.login_success,a);else if(+a.needcaptcha)a.captchaimg=r.captcha+"?token="+v._token+"&t="+ +new Date,this.emit(q.need_captcha,a);else{for(var b in j)if(j[b].code==a.status){a.msg=j[b].info;break}a.msg=a.msg||"Unknown error",this.emit(q.login_failed,a)}else k.error("Nothing callback received"),this.emit(q.login_failed,a)},_logincb3rd:function(){return this.isInitialized()?void this.emit(q.third_party_login_complete):void k.trace("Login3rd callback received but [Passport] has not been initialized")},isInitialized:function(){return!!v},getOptions:function(){var a={};return i.mixin(a,v)},getSupportedEvents:function(){var a={};return i.mixin(a,q)}};w=function(){return A.init.apply(A,arguments)},i.mixin(w,A),i.mixin(w,new l),c.PassportSC&&m.strobject===typeof c.PassportSC?(i.mixin(c.PassportSC,w),strfunction===typeof c.PassportSC.onApiLoaded&&c.PassportSC.onApiLoaded()):c.PassportSC=w,b.exports=w}(window,document)},{"./codes":3,"./console":4,"./cookie":5,"./event":8,"./utils":12}],7:[function(a,b){!function(c,d){"use strict";var e=a("./type"),f=a("./buggy");if(!c||!d||!d.documentElement||"HTML"!==d.documentElement.nodeName)throw new Error("It's only for HTML document");var g={addLink:function(a){e.assertNonEmptyString("src",a);var b=d.createElement("link");return b.rel="stylesheet",b.type="text/css",b.href=a,d.getElementsByTagName("head")[0].appendChild(b),b},addIframe:function(a,b,c){e.assertHTMLElement("container",a),e.assertNonEmptyString("url",b);var f=d.createElement("iframe");f.style.cssText="height:1px;width:1px;visibility:hidden;",f.src=b,f.attachEvent?f.attachEvent("onload",function(){e.isFunction(c)&&c()}):f.onload=function(){e.isFunction(c)&&c()},a.appendChild(f)},bindEvent:function(a,b,c){return e.assertHTMLElement("ele",a),e.assertNonEmptyString("evt",b),e.assertFunction("func",c),d.addEventListener?a.addEventListener(b,c,!1):d.attachEvent&&a.attachEvent("on"+b,c),this},stopPropagation:function(a){a.stopPropagation?a.stopPropagation():a.cancelBubble=!0},preventDefault:function(a){a.preventDefault?a.preventDefault():a.returnValue=!1},eventTarget:function(a){return a=a||c.event,a.target||a.srcElement},id:function(a){e.assertNonEmptyString("id",a);var b,c,g=d.getElementById(a);return f.getElementById?g&&(c=typeof g.getAttributeNode!==e.strundefined&&g.getAttributeNode("id"),c&&c.value===a)?g:(b=d.getElementsByTagName("*"),array.some(b,function(b){return b&&1===b.nodeType&&b.id===a?!0:void 0}),g&&g.id===a?g:null):g&&g.parentNode?g:null}};b.exports=g}(window,document)},{"./buggy":2,"./type":11}],8:[function(a,b){!function(){"use strict";var c=a("./utils"),d=a("./console"),e=c.array,f=c.type,g=function(){var a={};this.on=function(b,d,g){var h;return f.assertNonEmptyString("event",b),f.assertFunction("func",d),h=c.trim(b).split(/\s/),e.forEach(h,function(b){a[b]=a[b]||[],a[b].push({type:b,func:d,thisArg:g})}),this},this.off=function(b,d){var g,h;return f.assertNonEmptyString("event",b),f.assertFunction("func",d),g=c.trim(b).split(/\s/),e.forEach(g,function(b){return d?(h=a[b],void(f.isArray(h)&&(a[b]=e.filter(h,function(a){return a.func!==d})))):(delete a[b],this)}),this},this.emit=function(b,g){var h,i;return f.assertNonEmptyString("event",b),h=c.trim(b).split(/\s/),e.forEach(h,function(b){i=a[b],f.isArray(i)&&e.forEach(i,function(a){a.timestamp=+new Date,a.func.call(a.thisArg||null,a,g)})}),d.trace("emitting "+h.join()),this}};b.exports=g}()},{"./console":4,"./utils":12}],9:[function(a,b){!function(){"use strict";var a=0,c=8,d={b64_423:function(a){for(var b=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","-","_"],c="",d=0;d<a.length;d++){for(var e=0;64>e;e++)if(a.charAt(d)==b[e]){var f=e.toString(2);c+=("000000"+f).substr(f.length);break}if(64==e)return 2==d?c.substr(0,8):c.substr(0,16)}return c},b2i:function(a){for(var b=0,c=128,d=0;8>d;d++,c/=2)"1"==a.charAt(d)&&(b+=c);return String.fromCharCode(b)},b64_decodex:function(a){var b,c=[],d="";for(b=0;b<a.length;b+=4)d+=this.b64_423(a.substr(b,4));for(b=0;b<d.length;b+=8)c+=this.b2i(d.substr(b,8));return c},hex_md5:function(a){return this.binl2hex(this.core_md5(this.str2binl(a),a.length*c))},core_md5:function(a,b){a[b>>5]|=128<<b%32,a[(b+64>>>9<<4)+14]=b;for(var c=1732584193,d=-271733879,e=-1732584194,f=271733878,g=this.md5_ff,h=this.md5_gg,i=this.md5_hh,j=this.md5_ii,k=0;k<a.length;k+=16){var l=c,m=d,n=e,o=f;c=g(c,d,e,f,a[k+0],7,-680876936),f=g(f,c,d,e,a[k+1],12,-389564586),e=g(e,f,c,d,a[k+2],17,606105819),d=g(d,e,f,c,a[k+3],22,-1044525330),c=g(c,d,e,f,a[k+4],7,-176418897),f=g(f,c,d,e,a[k+5],12,1200080426),e=g(e,f,c,d,a[k+6],17,-1473231341),d=g(d,e,f,c,a[k+7],22,-45705983),c=g(c,d,e,f,a[k+8],7,1770035416),f=g(f,c,d,e,a[k+9],12,-1958414417),e=g(e,f,c,d,a[k+10],17,-42063),d=g(d,e,f,c,a[k+11],22,-1990404162),c=g(c,d,e,f,a[k+12],7,1804603682),f=g(f,c,d,e,a[k+13],12,-40341101),e=g(e,f,c,d,a[k+14],17,-1502002290),d=g(d,e,f,c,a[k+15],22,1236535329),c=h(c,d,e,f,a[k+1],5,-165796510),f=h(f,c,d,e,a[k+6],9,-1069501632),e=h(e,f,c,d,a[k+11],14,643717713),d=h(d,e,f,c,a[k+0],20,-373897302),c=h(c,d,e,f,a[k+5],5,-701558691),f=h(f,c,d,e,a[k+10],9,38016083),e=h(e,f,c,d,a[k+15],14,-660478335),d=h(d,e,f,c,a[k+4],20,-405537848),c=h(c,d,e,f,a[k+9],5,568446438),f=h(f,c,d,e,a[k+14],9,-1019803690),e=h(e,f,c,d,a[k+3],14,-187363961),d=h(d,e,f,c,a[k+8],20,1163531501),c=h(c,d,e,f,a[k+13],5,-1444681467),f=h(f,c,d,e,a[k+2],9,-51403784),e=h(e,f,c,d,a[k+7],14,1735328473),d=h(d,e,f,c,a[k+12],20,-1926607734),c=i(c,d,e,f,a[k+5],4,-378558),f=i(f,c,d,e,a[k+8],11,-2022574463),e=i(e,f,c,d,a[k+11],16,1839030562),d=i(d,e,f,c,a[k+14],23,-35309556),c=i(c,d,e,f,a[k+1],4,-1530992060),f=i(f,c,d,e,a[k+4],11,1272893353),e=i(e,f,c,d,a[k+7],16,-155497632),d=i(d,e,f,c,a[k+10],23,-1094730640),c=i(c,d,e,f,a[k+13],4,681279174),f=i(f,c,d,e,a[k+0],11,-358537222),e=i(e,f,c,d,a[k+3],16,-722521979),d=i(d,e,f,c,a[k+6],23,76029189),c=i(c,d,e,f,a[k+9],4,-640364487),f=i(f,c,d,e,a[k+12],11,-421815835),e=i(e,f,c,d,a[k+15],16,530742520),d=i(d,e,f,c,a[k+2],23,-995338651),c=j(c,d,e,f,a[k+0],6,-198630844),f=j(f,c,d,e,a[k+7],10,1126891415),e=j(e,f,c,d,a[k+14],15,-1416354905),d=j(d,e,f,c,a[k+5],21,-57434055),c=j(c,d,e,f,a[k+12],6,1700485571),f=j(f,c,d,e,a[k+3],10,-1894986606),e=j(e,f,c,d,a[k+10],15,-1051523),d=j(d,e,f,c,a[k+1],21,-2054922799),c=j(c,d,e,f,a[k+8],6,1873313359),f=j(f,c,d,e,a[k+15],10,-30611744),e=j(e,f,c,d,a[k+6],15,-1560198380),d=j(d,e,f,c,a[k+13],21,1309151649),c=j(c,d,e,f,a[k+4],6,-145523070),f=j(f,c,d,e,a[k+11],10,-1120210379),e=j(e,f,c,d,a[k+2],15,718787259),d=j(d,e,f,c,a[k+9],21,-343485551),c=this.safe_add(c,l),d=this.safe_add(d,m),e=this.safe_add(e,n),f=this.safe_add(f,o)}return[c,d,e,f]},md5_cmn:function(a,b,c,d,e,f){return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(b,a),this.safe_add(d,f)),e),c)},md5_ff:function(a,b,c,d,e,f,g){return this.md5_cmn(b&c|~b&d,a,b,e,f,g)},md5_gg:function(a,b,c,d,e,f,g){return this.md5_cmn(b&d|c&~d,a,b,e,f,g)},md5_hh:function(a,b,c,d,e,f,g){return this.md5_cmn(b^c^d,a,b,e,f,g)},md5_ii:function(a,b,c,d,e,f,g){return this.md5_cmn(c^(b|~d),a,b,e,f,g)},safe_add:function(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c},bit_rol:function(a,b){return a<<b|a>>>32-b},binl2hex:function(b){for(var c=a?"0123456789ABCDEF":"0123456789abcdef",d="",e=0;e<4*b.length;e++)d+=c.charAt(b[e>>2]>>e%4*8+4&15)+c.charAt(b[e>>2]>>e%4*8&15);return d},str2binl:function(a){for(var b=[],d=(1<<c)-1,e=0;e<a.length*c;e+=c)b[e>>5]|=(a.charCodeAt(e/c)&d)<<e%32;return b},utf8to16:function(a){var b,c,d,e,f,g,h,i,j;for(b=[],e=a.length,c=d=0;e>c;){switch(f=a.charCodeAt(c++),f>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:b[d++]=a.charAt(c-1);break;case 12:case 13:g=a.charCodeAt(c++),b[d++]=String.fromCharCode((31&f)<<6|63&g);break;case 14:g=a.charCodeAt(c++),h=a.charCodeAt(c++),b[d++]=String.fromCharCode((15&f)<<12|(63&g)<<6|63&h);break;case 15:switch(15&f){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:g=a.charCodeAt(c++),h=a.charCodeAt(c++),i=a.charCodeAt(c++),j=(7&f)<<18|(63&g)<<12|(63&h)<<6|(63&i)-65536,b[d]=j>=0&&1048575>=j?String.fromCharCode(j>>>10&1023|55296,1023&j|56320):"?";break;case 8:case 9:case 10:case 11:c+=4,b[d]="?";break;case 12:case 13:c+=5,b[d]="?"}}d++}return b.join("")},s4:function(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)},uuid:function(){var a=this.s4;return a()+a()+a()+a()+a()+a()+a()+a()}};b.exports=d}()},{}],10:[function(a){!function(b,c){"use strict";var d=a("../core"),e=a("../utils"),f=a("../console"),g="sogou-passport-pop",h="sogou-passport-form",i="sogou-passport-user",j="sogou-passport-pass",k="sogou-passport-auto",l="sogou-passport-error",m='<div class="sogou-passport-caption">搜狗帐号登录</div><form id="'+h+'" action="#" autocomplete="off" type="post"><div id="sogou-passport-error" class="sogou-passport-error"></div><div class="sogou-passport-row re"><input type="text" class="sogou-passport-input" id="'+i+'" placeholder="手机/邮箱/用户名"/></div><div class="sogou-passport-row re"><input type="password" class="sogou-passport-input" id="'+j+'" placeholder="密码"/></div><div class="sogou-passport-row sogou-passport-autologin"><input type="checkbox" id="'+k+'"/><label for="sogou-passport-auto">下次自动登录</label><a href="#" class="fr" target="_blank">找回密码</a></div><div class="sogou-passport-row sogou-passport-submitwrapper"><input id="sogou-passport-submit" type="submit" value="登录" class="sogou-passport-submit"></div></form>',n=function(a){var b;this.options={template:m,style:null},e.mixin(this.options,a),e.dom.addLink("css/skin/default.css");var f=this.wrapper=c.createElement("div");f.id=f.className=g,f.innerHTML=this.options.template,c.body.appendChild(f),this.initEvent(),(b=d.userid())&&(e.dom.id(i).value=b),d.on("loginfailed",function(a,b){e.dom.id(l).innerHTML=b.msg||"登录失败"}).on("loginsuccess",function(){e.dom.id(l).innerHTML="登录成功"}).on("needcaptcha",function(){e.dom.id(l).innerHTML="需要验证码"}).on("3rdlogincomplete",function(){e.dom.id(l).innerHTML="第三方登录完成"})};n.prototype={initEvent:function(){var a=this;e.dom.bindEvent(e.dom.id(h),"submit",function(b){e.dom.eventTarget(b);return e.dom.preventDefault(b),f.trace("Passport form submitting"),a.doPost(),!1})},doPost:function(){var a,b,c,g,h,l;return(a=e.dom.id(i))?(b=e.dom.id(j))?(c=e.dom.id(k))?(g=e.trim(a.value))&&(h=e.trim(b.value))?(l=c.checked,void d.login(g,h,l)):void f.trace("user empty"):void f.error("Element[#"+k+"] does not exist"):void f.error("Element[#"+j+"] does not exist"):void f.error("Element[#"+i+"] does not exist")},show:function(){this.wrapper.style.display="block"},hide:function(){this.wrapper.style.display="none"}};var o=null;d.pop=function(a){if(!this.isInitialized())throw new Error("You have to initialize passport before pop");o||(o=new n(a)),o.show()}}(window,document)},{"../console":4,"../core":6,"../utils":12}],11:[function(a,b){!function(){"use strict";function a(a){return function(a){return function(b){return"[object "+a+"]"==={}.toString.apply(b)}}(a)}function c(a){return function(a){return function(b,c){if(arguments.length<2&&(c=b,b=String(c)),!e["is"+a](c))throw new Error('"'+b+'" has to be a(n) '+a)}}(a)}for(var d=function(){},e={expando:"sogou-passport-"+ +new Date,noop:d,strundefined:"undefined",strstr:"string",strobject:typeof{},strnumber:"number",strfunction:typeof d,isNullOrUndefined:function(a){return this.isNull(a)||this.isUndefined(a)},isNonNullOrUndefined:function(a){return!this.isNullOrUndefined(a)},isInteger:function(a){return this.isNumber(a)&&/^(\-|\+)?\d+?$/i.test(a)},isNull:function(a){return null===a},isUndefined:function(a){return void 0===a},isPlainObject:function(a){return this.isObject(a)&&!this.isNull(a)},isNonEmptyString:function(a){return a&&this.isString(a)},isHTMLElement:function(a){return a&&a.childNodes&&a.tagName&&a.appendChild},isEmpty:function(a){return this.isNullOrUndefined(a)||this.isArray(a)&&!a.length||""===a},isGeneralizedObject:function(a){return this.strobject===typeof a}},f="Arguments,RegExp,Date,String,Array,Boolean,Function,Number,Object".split(","),g=f.length-1;g>=0;--g)e["is"+f[g]]=a(f[g]),e["assert"+f[g]]=c(f[g]);var h="Empty,HTMLElement,PlainObject,Undefined,Null,Integer,NullOrUndefined,NonNullOrUndefined,NonEmptyString,GeneralizedObject".split(",");for(g=h.length;g>=0;--g)e["assert"+h[g]]=c(h[g]);b.exports=e}()},{}],12:[function(a,b){!function(){"use strict";var c=a("./array"),d=a("./math"),e=a("./type"),f=a("./dom"),g="[\\x20\\t\\r\\n\\f]",h=new RegExp("^"+g+"+|((?:^|[^\\\\])(?:\\\\.)*)"+g+"+$","g"),i={math:d,array:c,dom:f,type:e,mixin:function(a,b){b=b||{},e.assertNonNullOrUndefined("dest",a);for(var c in b)b.hasOwnProperty&&b.hasOwnProperty(c)&&(a[c]=b[c]);return a},getIEVersion:function(){var a,b=navigator.userAgent,c={4:8,5:9,6:10,7:11};return a=b.match(/MSIE (\d+)/i),a&&a[1]?+a[1]:(a=b.match(/Trident\/(\d+)/i),a&&a[1]?c[a[1]]||null:null)},trim:function(a){return String.prototype.trim?String.prototype.trim.call(String(a)):String(a).replace(h,"")},freeze:function(a){return e.assertNonNullOrUndefined("obj",a),e.assertGeneralizedObject("obj",a),e.strundefined!==typeof Object&&e.strfunction===typeof Object.freeze&&Object.freeze(a),a}};i.freeze(d),i.freeze(f),i.freeze(e),i.freeze(c),b.exports=i}()},{"./array":1,"./dom":7,"./math":9,"./type":11}]},{},[1,2,3,4,5,6,7,8,9,10,11,12]);