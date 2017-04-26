/**
* Accessibility.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web wrapper for subscribing or querying the current state of the
* screen reader.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Accessibility_1 = require("../common/Accessibility");
var Accessibility = (function (_super) {
    __extends(Accessibility, _super);
    function Accessibility() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Calling this API on web has no effect.
    Accessibility.prototype.isScreenReaderEnabled = function () {
        return false;
    };
    return Accessibility;
}(Accessibility_1.Accessibility));
exports.Accessibility = Accessibility;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Accessibility();
