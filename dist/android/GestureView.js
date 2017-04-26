/**
* GestureView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific implementation of GestureView component.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GestureView_1 = require("../native-common/GestureView");
var _preferredPanRatio = 2;
var GestureView = (function (_super) {
    __extends(GestureView, _super);
    function GestureView(props) {
        return _super.call(this, props) || this;
    }
    GestureView.prototype._getPreferredPanRatio = function () {
        return _preferredPanRatio;
    };
    GestureView.prototype._getEventTimestamp = function (e) {
        var timestamp = e.timeStamp;
        // Work around a bug in some versions of RN where "timestamp" is
        // capitalized differently for some events.
        if (!timestamp) {
            timestamp = e.timestamp;
        }
        if (!timestamp) {
            return 0;
        }
        return timestamp.valueOf();
    };
    return GestureView;
}(GestureView_1.GestureView));
exports.GestureView = GestureView;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GestureView;
