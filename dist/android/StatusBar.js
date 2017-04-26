/**
* StatusBar.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific implementation of StatusBar APIs.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RN = require("react-native");
var RX = require("../common/Interfaces");
var StatusBar = (function (_super) {
    __extends(StatusBar, _super);
    function StatusBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatusBar.prototype.isOverlay = function () {
        // Android draws the status bar as a view that takes up space
        // of its own, as opposed to an overlay like on iOS.
        return false;
    };
    StatusBar.prototype.setHidden = function (hidden, showHideTransition) {
        RN.StatusBar.setHidden(hidden, showHideTransition);
    };
    StatusBar.prototype.setBackgroundColor = function (color, animated) {
        RN.StatusBar.setBackgroundColor(color, animated);
    };
    StatusBar.prototype.setTranslucent = function (translucent) {
        RN.StatusBar.setTranslucent(translucent);
    };
    StatusBar.prototype.setBarStyle = function (style, animated) {
        // Nothing to do on android
    };
    StatusBar.prototype.setNetworkActivityIndicatorVisible = function (value) {
        // Nothing to do on android
    };
    return StatusBar;
}(RX.StatusBar));
exports.StatusBar = StatusBar;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new StatusBar();
