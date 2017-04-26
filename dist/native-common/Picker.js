/**
* Picker.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Picker abstraction.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var _ = require("./lodashMini");
var React = require("react");
var RN = require("react-native");
var RX = require("../common/Interfaces");
var Picker = (function (_super) {
    __extends(Picker, _super);
    function Picker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onValueChange = function (itemValue, itemPosition) {
            _this.props.onValueChange(itemValue, itemPosition);
        };
        return _this;
    }
    Picker.prototype.render = function () {
        return (React.createElement(RN.Picker, { selectedValue: this.props.selectedValue, onValueChange: this.onValueChange, style: this.props.style }, _.map(this.props.items, function (i, idx) { return React.createElement(RN.Picker.Item, __assign({}, i, { key: idx })); })));
    };
    return Picker;
}(RX.Picker));
exports.Picker = Picker;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Picker;
