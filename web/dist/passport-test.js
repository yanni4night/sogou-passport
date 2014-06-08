(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":3}],2:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],3:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require("FWaASH"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":2,"FWaASH":5,"inherits":4}],4:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],5:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],6:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * array.js
 *
 * Some polyfill for ES5 array.
 *
 * changelog
 * 2014-06-06[14:11:09]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function() {
  "use strict";

  var type = require('./type');
  var array = {};

  /**
   * ES5 array indexOf polyfill.
   *
   * @param  {Array} arr
   * @param  {Object} ele
   * @param  {Integer} fromIndex
   * @return {Boolean}
   */
  array.indexOf = function(arr, ele, fromIndex) {
    var i, len;

    if (!arr || !ele) {
      return -1;
    }

    fromIndex = fromIndex | 0;
    if (isNaN(fromIndex)) {
      fromIndex = 0;
    }
    if (fromIndex >= arr.length) {
      return -1;
    }
    if (fromIndex < 0) {
      fromIndex = arr.length + fromIndex;
      if (fromIndex < 0) {
        fromIndex = 0;
      }
    }

    if (Array.prototype.indexOf) {
      return Array.prototype.indexOf.call(arr, ele, fromIndex);
    } else {
      for (i = fromIndex, len = arr.length; i < len; ++i) {
        if (ele === arr[i]) {
          return i;
        }
      }
    }

    return -1;
  };

  /**
   * ES5 array forEach polyfill.
   *
   * @param  {Array} arr
   * @param  {Function} callbackfn
   * @param  {Object} thisArg
   * @return {Undefined}
   */
  array.forEach = function(arr, callbackfn, thisArg) {
    var i, len;

    type.assertNonNullOrUndefined('arr', arr);
    type.assertFunction('callbackfn', callbackfn);

    if (Array.prototype.forEach) {
      return Array.prototype.forEach.call(arr, callbackfn, thisArg);
    }

    for (i = 0, len = arr.length; i < len; ++i) {
      callbackfn.call(thisArg, arr[i], i, arr);
    }

  };
  /**
   * ES5 array every polyfill.
   *
   * @param  {Array} arr
   * @param  {Function} func
   * @return {Boolean}
   */
  array.each = array.every = function(arr, callbackfn, thisArg) {
    var i, len;

    type.assertNonNullOrUndefined('arr', arr);
    type.assertFunction('callbackfn', callbackfn);

    //ES5
    if (Array.prototype.every) {
      return Array.prototype.every.call(arr, callbackfn, thisArg);
    } else {
      for (i = 0, len = arr.length; i < len; ++i) {
        if (!callbackfn.call(thisArg, arr[i], i, arr)) {
          return false;
        }
      }
    }

    return true;
  };

  /**
   * ES5 array some polyfill.
   *
   * @param  {Array} arr
   * @param  {Function} callbackfn
   * @param  {Object} thisArg
   * @return {Boolean}
   */
  array.some = function(arr, callbackfn, thisArg) {
    var i, len;

    type.assertNonNullOrUndefined('arr', arr);
    type.assertFunction('callbackfn', callbackfn);

    //ES5
    if (Array.prototype.some) {
      return Array.prototype.some.call(arr, callbackfn, thisArg);
    } else {
      for (i = 0, len = arr.length; i < len; ++i) {
        if (true === callbackfn.call(thisArg, arr[i], i, arr)) {
          return true;
        }
      }
    }

    return false;
  };

  /**
   * ES5 array filter polyfill.
   *
   * @param  {Array} arr
   * @param  {Function} callbackfn
   * @param  {Object} thisArg
   * @return {Array}
   */
  array.filter = function(arr, callbackfn, thisArg) {
    var ret = [];

    type.assertNonNullOrUndefined('arr', arr);
    type.assertFunction('callbackfn', callbackfn);


    if (Array.prototype.filter) {
      return Array.prototype.filter.call(arr, callbackfn, thisArg);
    }

    array.forEach(arr, function(val, index) {
      if (callbackfn.call(thisArg, val, index, arr)) {
        ret.push(val);
      }
    });
    return ret;
  };

  module.exports = array;
})();
},{"./type":18}],7:[function(require,module,exports){
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

(function(window, document, undefined) {
    "use strict";

    var expando = require('./type').expando;

    var Buggy = {
        /**
         * "getElementById" is buggy on IE6/7.
         *
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
})(window, document);
},{"./type":18}],8:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * codes.js
 *
 * changelog
 * 2014-05-24[23:06:47]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function(window, document, undefined) {
    "use strict";

    //Just for freeze
    var utils = require('./utils');
    
    var codes = {
        SYSTEM_ERROR: {
            code: 10001,
            info: "未知错误"
        },
        PARAM_ERROR: {
            code: 10002,
            info: "参数错误"
        },
        CAPTCHA_FAILED: {
            code: 20221,
            info: "验证码验证失败 "
        },
        ACCOUNT_NOT_EXIST: {
            code: 20205,
            info: "帐号不存在"
        },
        ACCOUNT_NOT_EXIST_1: {
            code: 10009,
            info: "帐号不存在"
        },
        ACCOUNT_NOT_ACTIVED: {
            code: 20231,
            info: "登陆账号未激活"
        },
        ACCOUNT_KILLED: {
            code: 20232,
            info: "登陆账号被封杀"
        },
        ACCOUNT_PWD_WRONG: {
            code: 20206,
            info: "账号或密码错误"
        },
        LOGIN_TIME_OUT: {
            code: 100000,
            info: "登录超时"
        },
        NEED_USERNAME: {
            code: 100001,
            info: "请输入通行证用户名"
        },
        NEED_PASSWORD: {
            code: 100002,
            info: "请输入通行证密码"
        }
    };

    utils.freeze(codes);

    module.exports = codes;

})(window, document);
},{"./utils":19}],9:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * console.js
 *
 * Polyfill for console.
 *
 * changelog
 * 2014-06-06[11:43:57]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function(window, undefined) {
    "use strict";

    var type = require('./type');
    var console = window.console;

    if (!console || type.strobject !== typeof console) {
        console = {};
    }

    var keys = 'trace,info,log,debug,warn,error'.split(',');

    for (var i = keys.length - 1; i >= 0; i--) {
        console[keys[i]] = console[keys[i]] || type.noop;
    }

    module.exports = console;
})(window);
},{"./type":18}],10:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * cookie.js
 *
 * Some operations about cookie.
 *
 * changelog
 * 2014-06-07[13:47:16]:authorized
 * 2014-06-07[15:21:54]:search cookie by regexp
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */
(function(window, document, undefined) {
    "use strict";

    var UTILS = require('./utils');

    var PassportCookieParser = {
        cookie:{},
        getCookie: function() {
            return this.cookie;
        },
        parsePassportCookie: function() {
            var value, i, parsedArray,matches;

            if (true !== (window.navigator && navigator.cookieEnabled)) {
                return this;
            }
            //clear
            this.cookie = {};

            var cookieArray = document.cookie.split("; ");
            for (i = 0; i < cookieArray.length; ++i) {
                matches = cookieArray[i].match(/^p(?:pinf|pinfo|assport)=(.+)$/);
                if(matches&&matches[1])
                {
                    value = matches[1];
                    break;
                }
            }

            //No cookie read
            if (!value) {
                return this;
            }

            try {
                parsedArray = unescape(value).split("|");
                if (parsedArray[0] == "1" || parsedArray[0] == "2" && parsedArray[3]) {
                    this._parsePassportCookie(UTILS.math.utf8to16(UTILS.math.b64_decodex(parsedArray[3])));
                }
            } catch (e) {}

            return this;
        },
        /**
         * Legacy function,DO NOT MODIFY.
         */
        _parsePassportCookie: function(F) {
            var J = 0,
                D, B, A, I, lenEnd_offset;
            var C = F.indexOf(":", J);
            while (C != -1) {
                B = F.substring(J, C);
                lenEnd_offset = F.indexOf(":", C + 1);
                if (lenEnd_offset == -1) {
                    break;
                }
                A = parseInt(F.substring(C + 1, lenEnd_offset));
                I = F.substr(lenEnd_offset + 1, A);
                if (F.charAt(lenEnd_offset + 1 + A) != "|") {
                    break;
                }
                this.cookie[B] = I;
                J = lenEnd_offset + 2 + A;
                C = F.indexOf(":", J);
            }

            return this;
        }
    };

    module.exports = {
        PassportCookieParser: {
            parse: function() {
                return PassportCookieParser.parsePassportCookie().getCookie();
            }
        }
    };
})(window, document);
},{"./utils":19}],11:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com sogou.com
 *
 * core.js
 *
 * Passport for sogou.com Ltd.
 *
 * Compared to previous sogou.js,we removed the
 * HTML dialog part,and export the least number
 * of interfaces.
 *
 * We plan to support HTML dialog by plugins.
 *
 * changelog
 * 2014-05-24[20:43:42]:authorized
 * 2014-05-25[10:48:30]:code matched
 * 2014-06-04[15:16:38]:remove 'container' parameter,we create it instead
 * 2014-06-04[16:37:06]:disabled 'remindActive' action
 * 2014-06-06[11:18:50]:'getOptions'&'isInitialized' added
 * 2014-06-07[11:03:49]:make 'getOptions' returns copy
 * 2014-06-07[12:56:24]:'NEEDCAPTCHA' event
 * 2014-06-07[20:07:16]:reconstruction PassportSC
 * 2014-06-08[01:28:21]:third party login supported by 'login3rd'
 * 2014-06-08[12:24:48]:hide source of functions
 *
 * @author yanni4night@gmail.com
 * @version 0.1.7
 * @since 0.1.0
 */

(function(window, document, undefined) {
    "use strict";

    var UTILS = require('./utils');
    var CODES = require('./codes');
    var console = require('./console');
    var Event = require('./event');
    var type = UTILS.type;
    var PassportCookieParser = require('./cookie').PassportCookieParser;

    var EXPANDO = type.expando;
    var HIDDEN_CSS = 'width:1px;height:1px;position:absolute;left:-100000px;display:block;';

    var EVENTS = {
        login_success: 'loginsuccess',
        login_failed: 'loginfailed',
        logout_success: 'logoutsuccess',
        need_captcha: 'needcaptcha',
        third_party_login_complete: '3rdlogincomplete'
    };

    var FIXED_URLS = {
        login: 'https://account.sogou.com/web/login',
        logout: 'https://account.sogou.com/web/logout_js',
        //active: 'https://account.sogou.com/web/remindActivate',
        captcha: 'https://account.sogou.com/captcha',
        trdparty: 'http://account.sogou.com/connect/login'
    };

    var THIRD_PARTY_SIZE = {
        size: {
            renren: [880, 620],
            sina: [780, 640],
            qq: [500, 300]
        }
    };


    var HTML_FRAME_LOGIN = '<form method="post" action="' + FIXED_URLS.login + '" target="' + EXPANDO + '">' + '<input type="hidden" name="username" value="<%=username%>">' + '<input type="hidden" name="password" value="<%=password%>">' + '<input type="hidden" name="captcha" value="<%=vcode%>">' + '<input type="hidden" name="autoLogin" value="<%=autoLogin%>">' + '<input type="hidden" name="client_id" value="<%=appid%>">' + '<input type="hidden" name="xd" value="<%=redirectUrl%>">' + '<input type="hidden" name="token" value="<%=token%>"></form>' + '<iframe name="' + EXPANDO + '" src="about:blank" style="' + HIDDEN_CSS + '"></iframe>';

    //For validations of options in bulk
    var VALIDATORS = [{
        name: ['appid'],
        validate: function(name, value) {
            return value && (type.strstr === typeof value || type.strnumber === typeof value);
        },
        errmsg: function(name, value) {
            return '"' + name + '" SHOULD be a string or a number';
        }
    }, {
        name: ['redirectUrl'],
        validate: function(name, value) {
            return value && type.strstr === typeof value && new RegExp('^' + location.protocol + "//" + location.host, 'i').test(value);
        },
        errmsg: function(name, value) {
            return '"' + name + '" SHOULD be a URL which has the some domain as the current page';
        }
    }];

    var gOptions = null;
    var PassportSC = null;
    var frameWrapper = null;
    var defaultOptions = {
        appid: null,
        redirectUrl: null
    };

    var NOT_INITIALIZED_ERROR = 'Passport has not been initialized yet';

    /**
     * Create frameWrapper if it not exists.
     *
     * @param {Function}
     * @return {HTMLElement} frameWrapper
     */
    function assertFrameWrapper(callback) {
        var c = frameWrapper;
        if (!c || (type.strobject !== typeof c) || (type.strundefined === typeof c.appendChild) || !c.parentNode) {
            c = frameWrapper = document.createElement('div');
            c.style.cssText = HIDDEN_CSS;
            c.className = c.id = EXPANDO;
            document.body.appendChild(c);
        }

        if (type.isFunction(callback)) {
            callback(c);
        }
        return c;
    }

    /**
     * This is the inner PASSPORT constructor.
     * As the instance could not be more then one,
     * it may be called only once.
     *
     * @param {Object} options
     * @throws {Error} If any validattion failed
     */
    function validateOptions(options) {
        var i, j, validator, name, opt;

        opt = gOptions = {};

        type.assertPlainObject('options', options);

        UTILS.mixin(opt, defaultOptions);
        UTILS.mixin(opt, options);

        for (i = VALIDATORS.length - 1; i >= 0; --i) {
            validator = VALIDATORS[i];
            for (j = validator.name.length - 1; j >= 0; --j) {
                name = validator.name[j];
                if (!validator.validate(name, opt[name])) {
                    throw new Error(type.strfunction === typeof validator.errmsg ?
                        validator.errmsg(name, opt[name]) : validator.errmsg
                    );
                }
            }
        }
        //DON'T FORGET IT
        opt._token = UTILS.math.uuid();
    }

    /**
     * Simple template replacer.
     *
     * @param  {String} tpl
     * @param  {Object} data
     * @return {String}
     */
    function template(tpl, data) {
        return tpl.replace(/<%=([\w\-]+?)%>/g, function(k, n) {
            var key = data[n];
            return undefined === key ? "" : key;
        });
    }

    /**
     * Core passport object.
     *
     * This will be merged into PassportSC.
     *
     * @class
     */
    var Passport = {
        version: '0.1.8', //see 'package.json'
        /**
         * Initialize.
         * This must be called at first before
         * any other operations.
         *
         * The following options must be set in options:
         * 1.appid -- Integer of ID,it depends on the product line;
         * 2.redirectUrl -- A same domain page url for cross-domain;
         *
         * @param  {Obejct} options Required options
         * @return {Object} PassportSC
         */
        init: function(options) {
            if (!this.isInitialized()) {
                console.trace('Initialize passport');
                validateOptions(options);
            } else {
                console.warn('Passport has already been initialized');
            }
            //support both PassportSC() and PassportSC.init()
            return PassportSC;
        },
        /**
         * Do login
         *
         * @param  {String} username
         * @param  {String} password
         * @param  {String} vcode
         * @param  {Boolean} autoLogin
         * @return {Object} this
         * @throws {Error} If not initialized
         */
        login: function(username, password, vcode, autoLogin) {
            if (!this.isInitialized()) {
                throw new Error(NOT_INITIALIZED_ERROR);
            }

            console.trace('logining with:' + Array.prototype.join.call(arguments));

            var payload;

            if (arguments.length < 4) {
                autoLogin = vcode;
                vcode = '';
            }

            //this._currentUname = username;

            type.assertNonEmptyString('username', username);
            type.assertNonEmptyString('password', password);

            payload = {
                username: username,
                password: password,
                vcode: vcode || "",
                autoLogin: +(!!autoLogin), //:0/1
                appid: gOptions.appid,
                redirectUrl: gOptions.redirectUrl,
                token: gOptions._token
            };

            assertFrameWrapper(function(container) {
                container.innerHTML = template(HTML_FRAME_LOGIN, payload);
                container.getElementsByTagName('form')[0].submit();
            });

        },
        /**
         * Third party login.
         *
         * @param  {String} provider qq|sina|renren
         * @param  {String} display page|popup
         * @param  {String} redirectUrl
         */
        login3rd: function(provider, display, redirectUrl) {
            if (!this.isInitialized()) {
                throw new Error(NOT_INITIALIZED_ERROR);
            }

            type.assertNonEmptyString('provider', provider);

            var size = THIRD_PARTY_SIZE.size[provider];
            if (!size) {
                throw new Error('provider:"' + provider + '" is not supported in  third party login');
            }

            if ('popup' === display) {
                //popup and at least 2
                type.assertNonEmptyString('redirectUrl', redirectUrl);
            } else if (type.isUndefined(display)) {
                //One
                display = 'page';
                redirectUrl = location.href;
            } else {
                //At least two and not popup
                redirectUrl = redirectUrl || location.href;
            }

            var authUrl = FIXED_URLS.trdparty + '?client_id=' + gOptions.appid + '&provider=' + provider + '&ru=' + encodeURIComponent(redirectUrl);

            if ('popup' === display) {
                var left = (window.screen.availWidth - size[0]) / 2;
                window.open(authUrl, '', 'height=' + size[1] + ',width=' + size[0] + ',top=80,left=' + left + ',toolbar=no,menubar=no');
            } else if ('page' === display) {
                location.href = authUrl;
            } else {
                throw new Error('display:"' + display + '" is not supported in third party login');
            }

        },
        /**
         * Do logout.
         * @return {Object} this
         * @throws {Error} If not initialized
         */
        logout: function() {
            if (!this.isInitialized()) {
                throw new Error(NOT_INITIALIZED_ERROR);
            }
            console.trace('logouting');
            var self = this;
            var url = FIXED_URLS.logout + '?client_id=' + gOptions.appid;

            assertFrameWrapper(function(container) {
                UTILS.dom.addIframe(container, url, function() {
                    self.emit(EVENTS.logout_success);
                });
            });

        },
        /**
         * Get userid from cookie
         * @return {String} userid or empty string
         * @throws {Error} If not initialized
         */
        userid: function() {
            if (!this.isInitialized()) {
                throw new Error(NOT_INITIALIZED_ERROR);
            }

            return PassportCookieParser.parse().userid || "";
        },
        /**
         * Login callback from iframe.
         * DO NOT call it directly.
         *
         * @param  {Object} data login result
         */
        _logincb: function(data) {
            if (!this.isInitialized()) {
                console.trace('Login callback received but [Passport] has not been initialized');
                return;
            }

            if (!data || type.strobject !== typeof data) {
                console.error('Nothing callback received');
                this.emit(EVENTS.login_failed, data);
            } else if (0 === +data.status) {
                this.emit(EVENTS.login_success, data);
            }
            /* else if (+data.status === 20231) {
                location.href = FIXED_URLS.active + '?email=' + encodeURIComponent(this._currentUname) + '&client_id=' + gOptions.appid + '&ru=' + encodeURIComponent(location.href);
            }*/
            else if (+data.needcaptcha) {
                data.captchaimg = FIXED_URLS.captcha + '?token=' + gOptions._token + '&t=' + (+new Date());
                this.emit(EVENTS.need_captcha, data);
            } else {
                for (var e in CODES) {
                    if (CODES[e].code == data.status) {
                        data.msg = CODES[e].info;
                        break;
                    }
                }
                data.msg = data.msg || "Unknown error";
                this.emit(EVENTS.login_failed, data);
            }
        },
        /**
         * Third party login callback from 'popup' window.
         * DO NOT call it directly.
         *
         * It does not support callback with 'page' display.
         */
        _logincb3rd: function() {
            if (!this.isInitialized()) {
                console.trace('Login3rd callback received but [Passport] has not been initialized');
                return;
            }
            this.emit(EVENTS.third_party_login_complete);
        },
        /**
         * If passport has been initialized.
         *
         * @return {Boolean} Initialized
         */
        isInitialized: function() {
            return !!gOptions;
        },
        /**
         * Get a copy of options.
         *
         * @return {Object} Options
         */
        getOptions: function() {
            var opts = {};
            return UTILS.mixin(opts, gOptions);
        },
        /**
         * Get a copy of events which passport supports.
         *
         * @return {Object} Supported events
         */
        getSupportedEvents: function() {
            var events = {};
            return UTILS.mixin(events, EVENTS);
        }
    };

    /**
     * Create toString functions.
     *
     * @param  {String} name
     * @return {Function}
     */
    function createToString(name, source) {
        return (function(name, source) {
            return function() {
                return 'PassportSC.' + name + source.match(/\([^\{\(]+(?=\{)/)[0];
            };
        })(name, source);
    }

    //Hide implementation for beauty.
    PassportSC = function() {
        return Passport.init.apply(Passport, arguments);
    };

    UTILS.mixin(PassportSC, Passport);


    //Make proxy an event emitter too.
    UTILS.mixin(PassportSC, new Event());

    //PassportSC is shy.
    //We do this for hiding source of its function members,
    //which may show up in chrome console.
    for (var e in PassportSC) {
        if (type.isFunction(PassportSC[e])) {
            PassportSC[e].toString = createToString(e, String(PassportSC[e]));
        }
    }

    //Sync loading supported
    if (window.PassportSC && type.strobject === typeof window.PassportSC) {
        UTILS.mixin(window.PassportSC, PassportSC);
        if (strfunction === typeof window.PassportSC.onApiLoaded)
            window.PassportSC.onApiLoaded();
    } else {
        window.PassportSC = PassportSC;
    }

    module.exports = PassportSC;
})(window, document);
},{"./codes":8,"./console":9,"./cookie":10,"./event":13,"./utils":19}],12:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * dom.js
 *
 * Some simple DOM operations.
 *
 * changelog
 * 2014-06-07[16:33:33]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */


(function(window, document, undefined) {
    "use strict";
    
    var type = require('./type');
    var buggy = require('./buggy');

    if (!window || !document || !document.documentElement || 'HTML' !== document.documentElement.nodeName) {
        throw new Error("It's only for HTML document");
    }

    var dom = {
        /**
         * Insert a link element
         *
         * @param  {String} src Link url
         * @return {HTMLLinkElement}
         * @throws {Error} If parameters illegal
         */
        addLink: function(src) {

            type.assertNonEmptyString('src',src);

            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = src;
            document.getElementsByTagName('head')[0].appendChild(link);
            return link;
        },
        addIframe: function(container, url, callback) {

            type.assertHTMLElement('container',container);
            type.assertNonEmptyString('url',url);

            var iframe = document.createElement('iframe');
            iframe.style.cssText = 'height:1px;width:1px;visibility:hidden;';
            iframe.src = url;

            if (iframe.attachEvent) {
                iframe.attachEvent("onload", function() {
                    if (type.isFunction(callback)) {
                        callback();
                    }
                });
            } else {
                iframe.onload = function() {
                    if (type.isFunction(callback)) {
                        callback();
                    }
                };
            }

            container.appendChild(iframe);
        },
        /**
         * Attatch event listener to HTMLElements.
         * @param  {HTMLElement} dom
         * @param  {String} evt
         * @param  {Function} func
         * @return {this}
         * @throws {Error} If parameters illegal
         */
        bindEvent: function(ele, evt, func) {

            type.assertHTMLElement('ele',ele);
            type.assertNonEmptyString('evt',evt);
            type.assertFunction('func',func);

            if (document.addEventListener) {
                ele.addEventListener(evt, func, false);
            } else if (document.attachEvent) {
                ele.attachEvent('on' + evt, func);
            }

            return this;
        },
        stopPropagation: function(evt) {
            if (evt.stopPropagation) {
                evt.stopPropagation();
            } else {
                evt.cancelBubble = true;
            }
        },
        preventDefault: function(evt) {
            if (evt.preventDefault) {
                evt.preventDefault();
            } else {
                evt.returnValue = false;
            }
        },
        eventTarget: function(e) {
            e = e || window.event;
            return e.target || e.srcElement;
        },
        /**
         * Get HTMLElement by id.
         *
         * @param  {String} id
         * @return {HTMLElement}
         */
        id: function(id) {
            
            type.assertNonEmptyString('id',id);

            var ele = document.getElementById(id),
                all, node;
            if (!buggy.getElementById) {
                //BlackBerry 4.6
                //https://github.com/jquery/sizzle/blob/96728dd43c62dd5e94452f18564a888e7115f936/src/sizzle.js#L538
                return (ele && ele.parentNode) ? ele : null;
            } else if (ele) {
                //IE6/7
                node = typeof ele.getAttributeNode !== type.strundefined && ele.getAttributeNode("id");
                if (node && node.value === id) {
                    return ele;
                }
            }
            //TODO test
            all = document.getElementsByTagName('*');
            array.some(all, function(ele) {
                //ignore comment
                if (ele && ele.nodeType === 1 && ele.id === id) {
                    return true;
                }
            });
            return (ele && ele.id === id) ? ele : null;
        }
    };
    module.exports = dom;
})(window, document);
},{"./buggy":7,"./type":18}],13:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * event.js
 *
 * changelog
 * 2014-06-06[14:02:08]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function() {
    "use strict";
    
    var UTILS = require('./utils');
    var console = require('./console');
    var array = UTILS.array;
    var type = UTILS.type;

    var EventEmitter = function() {

        var listeners = {};

        /**
         * Bind event,multiple events split by space supported
         * @param  {String} event
         * @param  {Function} func
         * @param  {Object} thisArg
         * @return {EventEmitter}      This event emitter
         */
        this.on = function(event, func, thisArg) {
            var evtArr;

            type.assertNonEmptyString('event',event);
            type.assertFunction('func',func);

            evtArr = UTILS.trim(event).split(/\s/);

            array.forEach(evtArr, function(evt) {
                listeners[evt] = listeners[evt] || [];
                listeners[evt].push({
                    type: evt,
                    func: func,
                    thisArg: thisArg
                });
            });

            return this;
        };

        /**
         * Remove event,multiple events split by space supported.
         *
         * Empty 'func' means remove all listeners named 'event'.
         * 
         * @param  {String} event
         * @param  {Function} func
         * @return {EventEmitter}     This event emitter
         */
        this.off = function(event, func) {
            var evtArr, objs;

            type.assertNonEmptyString('event',event);
            type.assertFunction('func',func);

            evtArr = UTILS.trim(event).split(/\s/);
            array.forEach(evtArr, function(evt) {
                if (!func) {
                    delete listeners[evt];
                    return this;
                } else {
                    objs = listeners[evt];
                    if (type.isArray(objs)) {
                        listeners[evt] = array.filter(objs, function(obj) {
                            return obj.func !== func;
                        });
                    }
                }
            });


            return this;
        };

        /**
         * Emit event(s),multiple events split by space supported.
         * 
         * @param  {String} event
         * @param  {Object} data
         * @return {EventEmitter} This event emitter
         */
        this.emit = function(event, data) {
            var evtArr, objs;

            type.assertNonEmptyString('event',event);

            evtArr = UTILS.trim(event).split(/\s/);

            array.forEach(evtArr, function(evt) {
                objs = listeners[evt];
                if (type.isArray(objs)) {
                    array.forEach(objs, function(obj) {
                        //add timestamp
                        obj.timestamp = +new Date();
                        obj.func.call(obj.thisArg || null, obj, data);
                    });
                }
            });

            console.trace('emitting ' + evtArr.join());
            return this;
        };
    };

    module.exports = EventEmitter;
})();
},{"./console":9,"./utils":19}],14:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * math.js
 *
 * changelog
 * 2014-06-07[15:36:34]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
(function() {
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
})();
},{}],15:[function(require,module,exports){
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
},{"../array":6,"assert":1}],16:[function(require,module,exports){
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
                nec: ['x', 1, false, [], null, undefined, type.noop],
                pos: [{},
                    new Object(),
                    window
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
},{"../type":18,"assert":1}],17:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * test-utils.js
 *
 * changelog
 * 2014-06-08[16:18:43]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function() {
    var assert = require('assert');
    var utils = require('../utils');
    var console = require('../console');
    
    describe('Utils', function() {
        it('#mixin()',function(){
            var src = {x:89},dest= {};
            assert.equal(89,utils.mixin(dest,src).x);
        });

        it('#trim()',function(){
            assert.equal(0,utils.trim('\x20\t\r\n\f').length);
        });

        it('#getIEVersion()',function(){
            var version = utils.getIEVersion();
            if(version)
            {   
                console.log('IE'+version);
                assert(version>4&&version<12&&utils.type.isInteger(version));
            }
        });

    }); //describe
})();
},{"../console":9,"../utils":19,"assert":1}],18:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * type.js
 *
 * changelog
 * 2014-06-07[15:50:11]:authorized
 * 2014-06-07[17:26:01]:asserts,customs
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */
(function() {
    "use strict";

    var noop = function() {};

    var type = {
        expando: "sogou-passport-" + (+new Date()),
        noop: noop,
        strundefined: typeof undefined,
        strstr: typeof '',
        strobject: typeof {},
        strnumber: typeof 0,
        strfunction: typeof noop,
        isNullOrUndefined: function(obj) {
            return !!(this.isNull(obj) || this.isUndefined(obj));
        },
        isNonNullOrUndefined: function(obj) {
            return !this.isNullOrUndefined(obj);
        },
        isInteger: function(num) {
            return !!(this.isNumber(num) && /^(\-|\+)?\d+?$/i.test(num));
        },
        isNull: function(obj) {
            return null === obj;
        },
        isUndefined: function(obj) {
            return undefined === obj;
        },
        /**
         * Check if obj is a non-null and non-array object.
         *
         * @param  {Object}  obj
         * @return {Boolean}
         */
        isPlainObject: function(obj) {
            return this.isObject(obj) && !this.isNull(obj) && !this.isArray(obj) && !this.isRegExp(obj) && !this.isDate(obj);
        },
        isNonEmptyString: function(obj) {
            return !!(obj && this.isString(obj));
        },
        isHTMLElement: function(obj) {
            return !!(obj && obj.childNodes && obj.tagName && obj.appendChild);
        },
        /**
         * Check if obj is null,undefined,empty array or empty string.
         *
         * @param  {Object}  obj
         * @return {Boolean}
         */
        isEmpty: function(obj) {
            return this.isNullOrUndefined(obj) || (this.isArray(obj) && !obj.length) || '' === obj;
        },
        isObject: function(obj) {
            return type.strobject === typeof obj;
        }
    };

    var typeKeys = "RegExp,Date,String,Array,Boolean,Function,Number".split(',');

    /**
     * Create is* functions.
     * @param  {String} vari
     * @return {Function}
     */
    function createIs(vari) {
        return (function(vari) {
            return function(variable) {
                return '[object ' + vari + ']' === ({}).toString.apply(variable);
            };
        })(vari);
    }

    /**
     * Create assert function.
     * @param  {String} vari
     * @return {Function}
     */
    function createAssert(vari) {
        return (function(vari) {
            return function(name, variable) {

                if (arguments.length < 2) {
                    variable = name;
                    name = String(variable);
                }

                if (!type['is' + vari](variable)) {
                    throw new Error('"' + name + '" has to be a(n) ' + vari);
                }
            };
        })(vari);
    }

    for (var i = typeKeys.length - 1; i >= 0; --i) {
        type['is' + typeKeys[i]] = createIs(typeKeys[i]);
        type['assert' + typeKeys[i]] = createAssert(typeKeys[i]);
    }

    //create missing asserts
    var assertKeys = "Empty,HTMLElement,PlainObject,Undefined,Null,Integer,NullOrUndefined,NonNullOrUndefined,NonEmptyString,Object".split(',');
    for (i = assertKeys.length; i >= 0; --i) {
        type['assert' + assertKeys[i]] = createAssert(assertKeys[i]);
    }

    //As type is required by utils,we cannot use utils.freeze
    module.exports = type;
})();
},{}],19:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 *
 * utils.js
 *
 * changelog
 * 2014-05-24[23:06:31]:authorized
 * 2014-06-06[09:23:53]:getIEVersion
 * 2014-06-07[15:30:38]:clean by split in 'math','dom' etc
 * 2014-06-07[16:39:34]:remove 'dom' module
 *
 *
 * @author yanni4night@gmail.com
 * @version 0.1.3
 * @since 0.1.0
 */

(function(undefined) {
    "use strict";

    var array = require('./array');
    var math = require('./math');
    var type = require('./type');
    var dom = require('./dom');

    //https://github.com/jquery/sizzle/blob/96728dd43c62dd5e94452f18564a888e7115f936/src/sizzle.js#L102
    var whitespace = "[\\x20\\t\\r\\n\\f]";
    var rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g");

    var utils = {
        math: math,
        array: array,
        dom: dom,
        type: type,
        /**
         * Merge object members.
         *
         * @param  {Object} dest
         * @param  {Object} src
         * @return {Object}      Dest
         */
        mixin: function(dest, src) {

            src = src || {};

            type.assertNonNullOrUndefined('dest', dest);

            for (var e in src) {
                if (src.hasOwnProperty && src.hasOwnProperty(e)) {
                    dest[e] = src[e];
                }
            }
            return dest;
        },

        /**
         * Get version of Internet Explorer by user agent.
         * IE 11 supported.
         *
         * @return {Integer} Version in integer.
         */
        getIEVersion: function() {
            var ua = navigator.userAgent,
                matches, tridentMap = {
                    '4': 8,
                    '5': 9,
                    '6': 10,
                    '7': 11
                };

            matches = ua.match(/MSIE (\d+)/i);

            if (matches && matches[1]) {
                //find by msie
                return +matches[1];
            }

            matches = ua.match(/Trident\/(\d+)/i);
            if (matches && matches[1]) {
                //find by trident
                return tridentMap[matches[1]] || null;
            }

            //we did what we could
            return null;
        },

        /**
         * Trim a string.If a non-string passed in,
         * convert it to a string.
         *
         * @param  {Object} str Source string
         * @return {String}    Trimed string
         * @version 0.1.1
         */
        trim: function(str) {
            if (String.prototype.trim) {
                return String.prototype.trim.call(String(str));
            } else {
                return String(str).replace(rtrim, '');
            }
        },
        /**
         * Freeze an object by Object.freeze,so it does not
         * work on old browsers.
         *
         * This function is trying to remind developers to not
         * modify something.
         *
         * @param  {Object} obj Object to be freezed
         * @return {Object}    Source object
         */
        freeze: function(obj) {

            type.assertNonNullOrUndefined('obj', obj);
            type.assertObject('obj', obj);

            if (type.strundefined !== typeof Object && type.strfunction === typeof Object.freeze) {
                Object.freeze(obj);
            }

            return obj;
        }
    };

    utils.freeze(math);
    utils.freeze(dom);
    utils.freeze(type);
    utils.freeze(array);

    module.exports = utils;
})();
},{"./array":6,"./dom":12,"./math":14,"./type":18}]},{},[6,7,8,9,10,11,12,13,14,18,19,15,16,17])