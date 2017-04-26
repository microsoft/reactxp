/**
* SubscribableEvent.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* A simple strongly-typed pub/sub/fire eventing system.
*/
"use strict";
var _ = require("./lodashMini");
var SubscriptionToken = (function () {
    function SubscriptionToken(_event, _callback) {
        this._event = _event;
        this._callback = _callback;
    }
    SubscriptionToken.prototype.unsubscribe = function () {
        this._event.unsubscribe(this._callback);
    };
    return SubscriptionToken;
}());
exports.SubscriptionToken = SubscriptionToken;
var SubscribableEvent = (function () {
    function SubscribableEvent() {
        var _this = this;
        this.fire = (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // Clone the array so original can be modified by handlers.
            var subs = _.clone(_this._subscribers);
            // Execute handlers in the reverse order in which they
            // were registered.
            for (var i = subs.length - 1; i >= 0; i--) {
                if (subs[i].apply(null, args)) {
                    // If the value was handled, early out.
                    return true;
                }
            }
            return false;
        });
        this._subscribers = [];
    }
    SubscribableEvent.prototype.dispose = function () {
        this._subscribers = [];
    };
    SubscribableEvent.prototype.subscribe = function (callback) {
        this._subscribers.push(callback);
        return new SubscriptionToken(this, callback);
    };
    SubscribableEvent.prototype.unsubscribe = function (callback) {
        _.pull(this._subscribers, callback);
    };
    return SubscribableEvent;
}());
exports.SubscribableEvent = SubscribableEvent;
