/**
* Popup.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* React Native implementation of the cross-platform Popup abstraction.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FrontLayerViewManager_1 = require("./FrontLayerViewManager");
var RX = require("../common/Interfaces");
var Popup = (function (_super) {
    __extends(Popup, _super);
    function Popup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Popup.prototype.show = function (options, popupId, delay) {
        return FrontLayerViewManager_1.default.showPopup(options, popupId, delay);
    };
    Popup.prototype.autoDismiss = function (popupId, delay) {
        setTimeout(function () {
            FrontLayerViewManager_1.default.dismissPopup(popupId);
        }, delay || 0);
    };
    Popup.prototype.dismiss = function (popupId) {
        FrontLayerViewManager_1.default.dismissPopup(popupId);
    };
    Popup.prototype.dismissAll = function () {
        FrontLayerViewManager_1.default.dismissAllPopups();
    };
    return Popup;
}(RX.Popup));
exports.Popup = Popup;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Popup();
