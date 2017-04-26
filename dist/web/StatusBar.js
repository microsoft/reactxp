/**
* StatusBar.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform status bar.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RX = require("../common/Interfaces");
var StatusBar = (function (_super) {
    __extends(StatusBar, _super);
    function StatusBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatusBar.prototype.isOverlay = function () {
        return false;
    };
    StatusBar.prototype.setBarStyle = function (style, animated) {
        // Nothing to do on Web
    };
    StatusBar.prototype.setHidden = function (hidden, showHideTransition) {
        // Nothing to do on Web
    };
    StatusBar.prototype.setNetworkActivityIndicatorVisible = function (value) {
        // Nothing to do on the web
    };
    StatusBar.prototype.setBackgroundColor = function (color, animated) {
        // Nothing to do on the web
    };
    StatusBar.prototype.setTranslucent = function (translucent) {
        // Nothing to do on the web
    };
    return StatusBar;
}(RX.StatusBar));
exports.StatusBar = StatusBar;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new StatusBar();
