/**
* Profiling.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Profiling utils for react-native.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RN = require("react-native");
var Profiling_1 = require("../common/Profiling");
var Profiling = (function (_super) {
    __extends(Profiling, _super);
    function Profiling() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Profiling.prototype.installWatchdog = function () {
        RN.InteractionManager.setDeadline(1000);
        RN.JSEventLoopWatchdog.install({ thresholdMS: 200 });
    };
    return Profiling;
}(Profiling_1.Profiling));
exports.Profiling = Profiling;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Profiling();
