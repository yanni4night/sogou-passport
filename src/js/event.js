/**
 * Copyright (C) 2014 yanni4night.com
 *
 * event.js
 *
 * changelog
 * 2014-06-06[14:02:08]:authorized
 *
 * @info yinyong,osx-x64,UTF-8,10.129.169.219,js,/Volumes/yinyong/passport/src/js
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

(function() {
    "use strict";
    
    var UTILS = require('./utils');
    var console = require('./console');
    var array = require('./array');

    var EVT_TYPE_ERR = '"event" has to be a string';
    var FUN_TYPE_ERR = '"func" has to be a function';

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

            if (!UTILS.isString(event)) {
                throw new Error(EVT_TYPE_ERR);
            }
            if (!UTILS.isFunction(func)) {
                throw new Error(FUN_TYPE_ERR);
            }

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
         * remove event,multiple events split by space supported.
         * @param  {String} event
         * @param  {Function} func
         * @return {EventEmitter}     This event emitter
         */
        this.off = function(event, func) {
            var evtArr, objs;

            if (!UTILS.isString(event)) {
                throw new Error(EVT_TYPE_ERR);
            }
            if (func && !UTILS.isFunction(func)) {
                throw new Error(FUN_TYPE_ERR);
            }
            evtArr = UTILS.trim(event).split(/\s/);
            array.forEach(evtArr, function(evt) {
                if (!func) {
                    delete listeners[evt];
                    return this;
                } else {
                    objs = listeners[evt];
                    if (UTILS.isArray(objs)) {
                        listeners[evt] = array.filter(objs, function(obj) {
                            return obj.func !== func;
                        });
                    }
                }
            });


            return this;
        };

        /**
         * Emit events,multiple events split by space supported
         * @param  {String} event
         * @param  {Object} data
         * @return {EventEmitter}
         */
        this.emit = function(event, data) {
            var evtArr, objs;

            if (!UTILS.isString(event)) {
                throw new Error(EVT_TYPE_ERR);
            }

            evtArr = UTILS.trim(event).split(/\s/);

            array.forEach(evtArr, function(evt) {
                objs = listeners[evt];
                if (UTILS.isArray(objs)) {
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