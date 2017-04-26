/**
* Accessibility.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native wrapper for accessibility helper.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RN = require("react-native");
var Accessibility_1 = require("../common/Accessibility");
var Accessibility = (function (_super) {
    __extends(Accessibility, _super);
    function Accessibility() {
        var _this = _super.call(this) || this;
        _this._isScreenReaderEnabled = false;
        var initialStateChanged = false;
        // Some versions of RN don't support this interface.
        if (RN.AccessibilityInfo) {
            // Subscribe to an event to get notified when screen reader is enabled or disabled.
            RN.AccessibilityInfo.addEventListener('change', function (isEnabled) {
                initialStateChanged = true;
                _this._updateScreenReaderStatus(isEnabled);
            });
            // Fetch initial state.
            RN.AccessibilityInfo.fetch().then(function (isEnabled) {
                if (!initialStateChanged) {
                    _this._updateScreenReaderStatus(isEnabled);
                }
            });
        }
        return _this;
    }
    Accessibility.prototype._updateScreenReaderStatus = function (isEnabled) {
        if (this._isScreenReaderEnabled !== isEnabled) {
            this._isScreenReaderEnabled = isEnabled;
            this.screenReaderChangedEvent.fire(isEnabled);
        }
    };
    Accessibility.prototype.isScreenReaderEnabled = function () {
        return this._isScreenReaderEnabled;
    };
    return Accessibility;
}(Accessibility_1.Accessibility));
exports.Accessibility = Accessibility;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Accessibility();
