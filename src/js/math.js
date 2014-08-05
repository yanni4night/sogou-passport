/**
 * Copyright (C) 2014 yanni4night.com
 *
 * math.js
 *
 * Some legacy functions here,we reserve them all but not modify.
 *
 * changelog
 * 2014-06-07[15:36:34]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
"use strict";

//They seem to be const
var hexcase = 0;
var chrsz = 8;

var math = {
    b64_423: function(E) {
        var D = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"];
        var F = '';
        for (var C = 0; C < E.length; C++) {
            for (var A = 0; A < 64; A++) {
                if (E.charAt(C) == D[A]) {
                    var B = A.toString(2);
                    F += ("000000" + B).substr(B.length);
                    break;
                }
            }
            if (A == 64) {
                if (C == 2) {
                    return F.substr(0, 8);
                } else {
                    return F.substr(0, 16);
                }
            }
        }
        return F;
    },
    b2i: function(D) {
        var A = 0;
        var B = 128;
        for (var C = 0; C < 8; C++, B = B / 2) {
            if (D.charAt(C) == "1") {
                A += B;
            }
        }
        return String.fromCharCode(A);
    },
    b64_decodex: function(D) {
        var B = [];
        var C;
        var A = "";
        for (C = 0; C < D.length; C += 4) {
            A += this.b64_423(D.substr(C, 4));
        }
        for (C = 0; C < A.length; C += 8) {
            B += this.b2i(A.substr(C, 8));
        }
        return B;
    },
    hex_md5: function(A) {
        return this.binl2hex(this.core_md5(this.str2binl(A), A.length * chrsz));
    },
    core_md5: function(K, F) {
        K[F >> 5] |= 128 << ((F) % 32);
        K[(((F + 64) >>> 9) << 4) + 14] = F;
        var J = 1732584193;
        var I = -271733879;
        var H = -1732584194;
        var G = 271733878;
        var md5_ff = this.md5_ff;
        var md5_gg = this.md5_gg;
        var md5_hh = this.md5_hh;
        var md5_ii = this.md5_ii;
        for (var C = 0; C < K.length; C += 16) {
            var E = J;
            var D = I;
            var B = H;
            var A = G;
            J = md5_ff(J, I, H, G, K[C + 0], 7, -680876936);
            G = md5_ff(G, J, I, H, K[C + 1], 12, -389564586);
            H = md5_ff(H, G, J, I, K[C + 2], 17, 606105819);
            I = md5_ff(I, H, G, J, K[C + 3], 22, -1044525330);
            J = md5_ff(J, I, H, G, K[C + 4], 7, -176418897);
            G = md5_ff(G, J, I, H, K[C + 5], 12, 1200080426);
            H = md5_ff(H, G, J, I, K[C + 6], 17, -1473231341);
            I = md5_ff(I, H, G, J, K[C + 7], 22, -45705983);
            J = md5_ff(J, I, H, G, K[C + 8], 7, 1770035416);
            G = md5_ff(G, J, I, H, K[C + 9], 12, -1958414417);
            H = md5_ff(H, G, J, I, K[C + 10], 17, -42063);
            I = md5_ff(I, H, G, J, K[C + 11], 22, -1990404162);
            J = md5_ff(J, I, H, G, K[C + 12], 7, 1804603682);
            G = md5_ff(G, J, I, H, K[C + 13], 12, -40341101);
            H = md5_ff(H, G, J, I, K[C + 14], 17, -1502002290);
            I = md5_ff(I, H, G, J, K[C + 15], 22, 1236535329);
            J = md5_gg(J, I, H, G, K[C + 1], 5, -165796510);
            G = md5_gg(G, J, I, H, K[C + 6], 9, -1069501632);
            H = md5_gg(H, G, J, I, K[C + 11], 14, 643717713);
            I = md5_gg(I, H, G, J, K[C + 0], 20, -373897302);
            J = md5_gg(J, I, H, G, K[C + 5], 5, -701558691);
            G = md5_gg(G, J, I, H, K[C + 10], 9, 38016083);
            H = md5_gg(H, G, J, I, K[C + 15], 14, -660478335);
            I = md5_gg(I, H, G, J, K[C + 4], 20, -405537848);
            J = md5_gg(J, I, H, G, K[C + 9], 5, 568446438);
            G = md5_gg(G, J, I, H, K[C + 14], 9, -1019803690);
            H = md5_gg(H, G, J, I, K[C + 3], 14, -187363961);
            I = md5_gg(I, H, G, J, K[C + 8], 20, 1163531501);
            J = md5_gg(J, I, H, G, K[C + 13], 5, -1444681467);
            G = md5_gg(G, J, I, H, K[C + 2], 9, -51403784);
            H = md5_gg(H, G, J, I, K[C + 7], 14, 1735328473);
            I = md5_gg(I, H, G, J, K[C + 12], 20, -1926607734);
            J = md5_hh(J, I, H, G, K[C + 5], 4, -378558);
            G = md5_hh(G, J, I, H, K[C + 8], 11, -2022574463);
            H = md5_hh(H, G, J, I, K[C + 11], 16, 1839030562);
            I = md5_hh(I, H, G, J, K[C + 14], 23, -35309556);
            J = md5_hh(J, I, H, G, K[C + 1], 4, -1530992060);
            G = md5_hh(G, J, I, H, K[C + 4], 11, 1272893353);
            H = md5_hh(H, G, J, I, K[C + 7], 16, -155497632);
            I = md5_hh(I, H, G, J, K[C + 10], 23, -1094730640);
            J = md5_hh(J, I, H, G, K[C + 13], 4, 681279174);
            G = md5_hh(G, J, I, H, K[C + 0], 11, -358537222);
            H = md5_hh(H, G, J, I, K[C + 3], 16, -722521979);
            I = md5_hh(I, H, G, J, K[C + 6], 23, 76029189);
            J = md5_hh(J, I, H, G, K[C + 9], 4, -640364487);
            G = md5_hh(G, J, I, H, K[C + 12], 11, -421815835);
            H = md5_hh(H, G, J, I, K[C + 15], 16, 530742520);
            I = md5_hh(I, H, G, J, K[C + 2], 23, -995338651);
            J = md5_ii(J, I, H, G, K[C + 0], 6, -198630844);
            G = md5_ii(G, J, I, H, K[C + 7], 10, 1126891415);
            H = md5_ii(H, G, J, I, K[C + 14], 15, -1416354905);
            I = md5_ii(I, H, G, J, K[C + 5], 21, -57434055);
            J = md5_ii(J, I, H, G, K[C + 12], 6, 1700485571);
            G = md5_ii(G, J, I, H, K[C + 3], 10, -1894986606);
            H = md5_ii(H, G, J, I, K[C + 10], 15, -1051523);
            I = md5_ii(I, H, G, J, K[C + 1], 21, -2054922799);
            J = md5_ii(J, I, H, G, K[C + 8], 6, 1873313359);
            G = md5_ii(G, J, I, H, K[C + 15], 10, -30611744);
            H = md5_ii(H, G, J, I, K[C + 6], 15, -1560198380);
            I = md5_ii(I, H, G, J, K[C + 13], 21, 1309151649);
            J = md5_ii(J, I, H, G, K[C + 4], 6, -145523070);
            G = md5_ii(G, J, I, H, K[C + 11], 10, -1120210379);
            H = md5_ii(H, G, J, I, K[C + 2], 15, 718787259);
            I = md5_ii(I, H, G, J, K[C + 9], 21, -343485551);
            J = this.safe_add(J, E);
            I = this.safe_add(I, D);
            H = this.safe_add(H, B);
            G = this.safe_add(G, A);
        }
        return [J, I, H, G];
    },
    md5_cmn: function(F, C, B, A, E, D) {
        return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(C, F), this.safe_add(A, D)), E), B);
    },
    md5_ff: function(C, B, G, F, A, E, D) {
        return this.md5_cmn((B & G) | ((~B) & F), C, B, A, E, D);
    },
    md5_gg: function(C, B, G, F, A, E, D) {
        return this.md5_cmn((B & F) | (G & (~F)), C, B, A, E, D);
    },
    md5_hh: function(C, B, G, F, A, E, D) {
        return this.md5_cmn(B ^ G ^ F, C, B, A, E, D);
    },
    md5_ii: function(C, B, G, F, A, E, D) {
        return this.md5_cmn(G ^ (B | (~F)), C, B, A, E, D);
    },
    safe_add: function(A, D) {
        var C = (A & 65535) + (D & 65535);
        var B = (A >> 16) + (D >> 16) + (C >> 16);
        return (B << 16) | (C & 65535);
    },
    bit_rol: function(A, B) {
        return (A << B) | (A >>> (32 - B));
    },
    binl2hex: function(C) {
        var B = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var D = "";
        for (var A = 0; A < C.length * 4; A++) {
            D += B.charAt((C[A >> 2] >> ((A % 4) * 8 + 4)) & 15) + B.charAt((C[A >> 2] >> ((A % 4) * 8)) & 15);
        }
        return D;
    },
    str2binl: function(D) {
        var C = [];
        var A = (1 << chrsz) - 1;
        for (var B = 0; B < D.length * chrsz; B += chrsz) {
            C[B >> 5] |= (D.charCodeAt(B / chrsz) & A) << (B % 32);
        }
        return C;
    },
    utf8to16: function(I) {
        var D, F, E, G, H, C, B, A, J;
        D = [];
        G = I.length;
        F = E = 0;
        while (F < G) {
            H = I.charCodeAt(F++);
            switch (H >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    D[E++] = I.charAt(F - 1);
                    break;
                case 12:
                case 13:
                    C = I.charCodeAt(F++);
                    D[E++] = String.fromCharCode(((H & 31) << 6) | (C & 63));
                    break;
                case 14:
                    C = I.charCodeAt(F++);
                    B = I.charCodeAt(F++);
                    D[E++] = String.fromCharCode(((H & 15) << 12) | ((C & 63) << 6) | (B & 63));
                    break;
                case 15:
                    switch (H & 15) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                            C = I.charCodeAt(F++);
                            B = I.charCodeAt(F++);
                            A = I.charCodeAt(F++);
                            J = ((H & 7) << 18) | ((C & 63) << 12) | ((B & 63) << 6) | (A & 63) - 65536;
                            if (0 <= J && J <= 1048575) {
                                D[E] = String.fromCharCode(((J >>> 10) & 1023) | 55296, (J & 1023) | 56320);
                            } else {
                                D[E] = "?";
                            }
                            break;
                        case 8:
                        case 9:
                        case 10:
                        case 11:
                            F += 4;
                            D[E] = "?";
                            break;
                        case 12:
                        case 13:
                            F += 5;
                            D[E] = "?";
                            break;
                    }
            }
            E++;
        }
        return D.join("");
    },
    s4: function() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    },
    uuid: function() {
        var s4 = this.s4;
        return s4() + s4() + s4() + s4() +
            s4() + s4() + s4() + s4();
    }
};

module.exports = math;