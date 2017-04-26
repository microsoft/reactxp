/**
* StatusBar.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* iOS-specific implementation of StatusBar APIs.
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
        // iOS always draws the status bar as an overlay, as opposed
        // to a view that takes up space of its own.
        return true;
    };
    StatusBar.prototype.setBarStyle = function (style, animated) {
        RN.StatusBar.setBarStyle(style, true);
    };
    StatusBar.prototype.setHidden = function (hidden, showHideTransition) {
        RN.StatusBar.setHidden(hidden, showHideTransition);
    };
    StatusBar.prototype.setNetworkActivityIndicatorVisible = function (value) {
        RN.StatusBar.setNetworkActivityIndicatorVisible(value);
    };
    StatusBar.prototype.setBackgroundColor = function (color, animated) {
        // Nothing to do on iOS
    };
    StatusBar.prototype.setTranslucent = function (translucent) {
        // Nothing to do on iOS
    };
    return StatusBar;
}(RX.StatusBar));
exports.StatusBar = StatusBar;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new StatusBar();
