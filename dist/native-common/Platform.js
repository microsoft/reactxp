/**
* Platform.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of Platform interface.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RN = require("react-native");
var RX = require("../common/Interfaces");
var Platform = (function (_super) {
    __extends(Platform, _super);
    function Platform() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Platform.prototype.getType = function () {
        return RN.Platform.OS;
    };
    return Platform;
}(RX.Platform));
exports.Platform = Platform;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Platform();
