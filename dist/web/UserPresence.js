/**
* UserPresence.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the ReactXP interfaces related to
* user presence.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RX = require("../common/Interfaces");
if (typeof (document) !== 'undefined') {
    var ifvisible = require('ifvisible.js');
}
var UserPresence = (function (_super) {
    __extends(UserPresence, _super);
    function UserPresence() {
        var _this = _super.call(this) || this;
        // Handle test environment where document is not defined.
        if (typeof (document) !== 'undefined') {
            _this._isPresent = ifvisible.now();
            ifvisible.on('wakeup', _this._handleWakeup.bind(_this));
            ifvisible.on('idle', _this._handleIdle.bind(_this));
            ifvisible.on('focus', _this._handleFocus.bind(_this));
            ifvisible.on('blur', _this._handleBlur.bind(_this));
            window.addEventListener('blur', _this._handleBlur.bind(_this));
            window.addEventListener('focus', _this._handleFocus.bind(_this));
        }
        return _this;
    }
    UserPresence.prototype.isUserPresent = function () {
        // Handle test environment where document is not defined.
        if (typeof (document) !== 'undefined') {
            return ifvisible.now();
        }
        else {
            return true;
        }
    };
    UserPresence.prototype._setUserPresent = function (isPresent) {
        if (this._isPresent !== isPresent) {
            this._isPresent = isPresent;
            this.userPresenceChangedEvent.fire(isPresent);
        }
    };
    UserPresence.prototype._handleWakeup = function () {
        this._setUserPresent(true);
    };
    UserPresence.prototype._handleIdle = function () {
        this._setUserPresent(false);
    };
    UserPresence.prototype._handleFocus = function () {
        this._setUserPresent(true);
    };
    UserPresence.prototype._handleBlur = function () {
        this._setUserPresent(false);
    };
    return UserPresence;
}(RX.UserPresence));
exports.UserPresence = UserPresence;
var instance = new UserPresence();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = instance;
