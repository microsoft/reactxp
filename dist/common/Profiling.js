/**
* Profiling.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Utility functions used for performance profiling.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Perf = require("react-addons-perf");
var RX = require("../common/Interfaces");
var Profiling = (function (_super) {
    __extends(Profiling, _super);
    function Profiling() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Profiling.prototype.installWatchdog = function () {
        console.warn('watchdog is not implemented for this platform');
    };
    Profiling.prototype.start = function () {
        Perf.start();
    };
    Profiling.prototype.stop = function () {
        Perf.stop();
    };
    Profiling.prototype.printResults = function (config) {
        var measurements = Perf.getLastMeasurements();
        if (config.printExclusive) {
            Perf.printExclusive(measurements);
        }
        if (config.printInclusive) {
            Perf.printInclusive(measurements);
        }
        if (config.printWasted) {
            Perf.printWasted(measurements);
        }
        if (config.printOperations) {
            Perf.printOperations(measurements);
        }
        if (config.printDOM) {
            Perf.printDOM(measurements);
        }
    };
    return Profiling;
}(RX.Profiling));
exports.Profiling = Profiling;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Profiling();
