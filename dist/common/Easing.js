/**
* Easing.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Easing functions for animations.
*/
"use strict";
var Bezier = require("./Bezier");
var Easing = (function () {
    function Easing() {
    }
    Easing.prototype.CubicBezier = function (x1, y1, x2, y2) {
        return {
            cssName: 'cubic-bezier(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ')',
            function: Bezier.bezier(x1, y1, x2, y2)
        };
    };
    Easing.prototype.Default = function () {
        var bezier = this.CubicBezier(0.42, 0, 1, 1);
        return {
            cssName: 'ease',
            function: bezier.function
        };
    };
    Easing.prototype.Linear = function () {
        return {
            cssName: 'linear',
            function: function (input) { return input; }
        };
    };
    Easing.prototype.Out = function () {
        var bezier = this.CubicBezier(0, 0, 0.58, 1);
        return {
            cssName: 'ease-out',
            function: bezier.function
        };
    };
    Easing.prototype.In = function () {
        var bezier = this.CubicBezier(0.42, 0, 1, 1);
        return {
            cssName: 'ease-in',
            function: bezier.function
        };
    };
    Easing.prototype.InOut = function () {
        var bezier = this.CubicBezier(0.42, 0, 0.58, 1);
        return {
            cssName: 'ease-in-out',
            function: bezier.function
        };
    };
    Easing.prototype.OutBack = function () {
        var bezier = this.CubicBezier(0.175, 0.885, 0.320, 1.275);
        return {
            cssName: bezier.cssName,
            function: bezier.function
        };
    };
    Easing.prototype.InBack = function () {
        var bezier = this.CubicBezier(0.600, -0.280, 0.735, 0.045);
        return {
            cssName: bezier.cssName,
            function: bezier.function
        };
    };
    Easing.prototype.InOutBack = function () {
        var bezier = this.CubicBezier(0.680, -0.550, 0.265, 1.550);
        return {
            cssName: bezier.cssName,
            function: bezier.function
        };
    };
    Easing.prototype.Steps = function (intervals, end) {
        if (end === void 0) { end = true; }
        return {
            cssName: 'steps(' + intervals + ', ' + (end ? 'end' : 'start') + ')',
            function: function (input) {
                var interval = intervals * input;
                if (end) {
                    interval = Math.floor(interval);
                }
                else {
                    interval = Math.ceil(interval);
                }
                return interval / intervals;
            }
        };
    };
    Easing.prototype.StepStart = function () {
        var steps = this.Steps(1, false);
        return {
            cssName: 'steps(1, start)',
            function: steps.function
        };
    };
    Easing.prototype.StepEnd = function () {
        var steps = this.Steps(1, true);
        return {
            cssName: 'steps(1, end)',
            function: steps.function
        };
    };
    return Easing;
}());
exports.Easing = Easing;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Easing();
