/**
* Button.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific implementation of Button component.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var Button_1 = require("../native-common/Button");
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Button.prototype.focus = function () {
        AccessibilityUtil_1.default.setAccessibilityFocus(this);
    };
    return Button;
}(Button_1.Button));
exports.Button = Button;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Button;
