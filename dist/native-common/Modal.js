/**
* Modal.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Modal abstraction.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FrontLayerViewManager_1 = require("./FrontLayerViewManager");
var RX = require("../common/Interfaces");
var Modal = (function (_super) {
    __extends(Modal, _super);
    function Modal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Modal.prototype.isDisplayed = function (modalId) {
        return FrontLayerViewManager_1.default.isModalDisplayed(modalId);
    };
    Modal.prototype.show = function (modal, modalId) {
        FrontLayerViewManager_1.default.showModal(modal, modalId);
    };
    Modal.prototype.dismiss = function (modalId) {
        FrontLayerViewManager_1.default.dismissModal(modalId);
    };
    Modal.prototype.dismissAll = function () {
        FrontLayerViewManager_1.default.dismissAllmodals();
    };
    return Modal;
}(RX.Modal));
exports.Modal = Modal;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Modal();
