/**
* View.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific implementation of View component.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var View_1 = require("../native-common/View");
var View = (function (_super) {
    __extends(View, _super);
    function View() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    View.prototype.focus = function () {
        AccessibilityUtil_1.default.setAccessibilityFocus(this);
    };
    return View;
}(View_1.View));
exports.View = View;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = View;
