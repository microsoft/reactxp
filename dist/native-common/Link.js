/**
* Link.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Link abstraction.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var RN = require("react-native");
var Linking_1 = require("../native-common/Linking");
var RX = require("../common/Interfaces");
var Link = (function (_super) {
    __extends(Link, _super);
    function Link() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onPress = function (e) {
            if (_this.props.onPress) {
                _this.props.onPress(e, _this.props.url);
                return;
            }
            // The default action is to launch a browser.
            if (_this.props.url) {
                Linking_1.default.openUrl(_this.props.url);
            }
        };
        _this._onLongPress = function (e) {
            if (_this.props.onLongPress) {
                _this.props.onLongPress(e, _this.props.url);
            }
        };
        return _this;
    }
    // To be able to use Link inside TouchableHighlight/TouchableOpacity
    Link.prototype.setNativeProps = function (nativeProps) {
        this.refs['nativeLink'].setNativeProps(nativeProps);
    };
    Link.prototype.render = function () {
        return (React.createElement(RN.Text, { style: this.props.style, ref: 'nativeLink', numberOfLines: this.props.numberOfLines === 0 ? null : this.props.numberOfLines, onPress: this._onPress, onLongPress: this._onLongPress }, this.props.children));
    };
    return Link;
}(RX.Link));
exports.Link = Link;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Link;
