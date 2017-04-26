/**
* Accessibility.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common wrapper for accessibility helper exposed from ReactXP.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SubscribableEvent = require("../common/SubscribableEvent");
var RX = require("../common/Interfaces");
var Accessibility = (function (_super) {
    __extends(Accessibility, _super);
    function Accessibility() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.newAnnouncementReadyEvent = new SubscribableEvent.SubscribableEvent();
        return _this;
    }
    Accessibility.prototype.announceForAccessibility = function (announcement) {
        this.newAnnouncementReadyEvent.fire(announcement);
    };
    return Accessibility;
}(RX.Accessibility));
exports.Accessibility = Accessibility;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Accessibility;
