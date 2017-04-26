/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific accessibility utils.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RN = require("react-native");
var Accessibility_1 = require("../native-common/Accessibility");
var AccessibilityUtil_1 = require("../native-common/AccessibilityUtil");
var AccessibilityUtil = (function (_super) {
    __extends(AccessibilityUtil, _super);
    function AccessibilityUtil() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AccessibilityUtil.prototype._sendAccessibilityEvent = function (component, eventId) {
        // See list of events here:
        // https://developer.android.com/reference/android/view/accessibility/AccessibilityEvent.html
        // For some reason, a small delay is required for the event to be properly processed.
        setTimeout(function () {
            RN.NativeModules.UIManager.sendAccessibilityEvent(RN.findNodeHandle(component), eventId);
        }, 100);
    };
    AccessibilityUtil.prototype.setAccessibilityFocus = function (component) {
        var TYPE_VIEW_FOCUSED = 8;
        if (Accessibility_1.default.isScreenReaderEnabled()) {
            this._sendAccessibilityEvent(component, TYPE_VIEW_FOCUSED);
        }
    };
    return AccessibilityUtil;
}(AccessibilityUtil_1.AccessibilityUtil));
exports.AccessibilityUtil = AccessibilityUtil;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new AccessibilityUtil();
