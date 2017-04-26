/**
* Input.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of Input interface.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RN = require("react-native");
var RX = require("../common/Interfaces");
var Input = (function (_super) {
    __extends(Input, _super);
    function Input() {
        var _this = _super.call(this) || this;
        RN.BackAndroid.addEventListener('BackButton', function () {
            return _this.backButtonEvent.fire();
        });
        return _this;
    }
    return Input;
}(RX.Input));
exports.Input = Input;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Input();
