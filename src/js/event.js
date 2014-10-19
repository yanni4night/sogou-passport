/**
 * Copyright (C) 2014 yanni4night.com
 *
 * event.js
 *
 * changelog
 * 2014-06-06[14:02:08]:authorized
 * 2014-06-14[12:15:47]:removed utils
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */

"use strict";

var console = require('./console');
var array = require('./array');
var type = require('./type');
var string = require('./string');

var EventEmitter = function() {

    var listeners = {};

    /**
     * Bind event,multiple events split by space supported.
     * 
     * @param  {String} event
     * @param  {Function} func
     * @param  {Object} thisArg
     * @return {EventEmitter}      This event emitter
     * @class EventEmitter
     * @since 0.0.8
     */
    this.on = function(event, func, thisArg) {
        var evtArr;

        type.assertNonEmptyString('event', event);
        type.assertFunction('func', func);

        evtArr = string.trim(event).split(/\s/);

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
     * @class EventEmitter
     * @since 0.0.8
     */
    this.off = function(event, func) {
        var evtArr, objs;

        type.assertNonEmptyString('event', event);
        if (func) {
            type.assertFunction('func', func);
        }

        evtArr = string.trim(event).split(/\s/);
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
     * @class EventEmitter
     * @since 0.0.8
     */
    this.emit = function(event, data) {
        var evtArr, objs;

        type.assertNonEmptyString('event', event);

        evtArr = string.trim(event).split(/\s/);

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

        console.debug('emitting ' + evtArr.join());
        return this;
    };
};

module.exports = EventEmitter;