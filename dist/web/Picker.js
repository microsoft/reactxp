/**
* Picker.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Select abstraction.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("./utils/lodashMini");
var React = require("react");
var RX = require("../common/Interfaces");
var Picker = (function (_super) {
    __extends(Picker, _super);
    function Picker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onValueChange = function (e) {
            var selectEl = e.target;
            var selectedValue = selectEl.value;
            var selectedItemPosition = _.findIndex(_this.props.items, function (i) { return i.value === selectedValue; });
            _this.props.onValueChange(selectedValue, selectedItemPosition);
        };
        return _this;
    }
    Picker.prototype.render = function () {
        return (React.createElement("select", { value: this.props.selectedValue, onChange: this.onValueChange, style: this.props.style }, _.map(this.props.items, function (i, idx) { return React.createElement("option", { value: i.value, key: idx }, i.label); })));
    };
    return Picker;
}(RX.Picker));
exports.Picker = Picker;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Picker;
