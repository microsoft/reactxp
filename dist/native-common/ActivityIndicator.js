/**
* ActivityIndicator.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Control to display an animated activity indicator.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
/* tslint:disable:no-unused-variable */
var RN = require("react-native");
/* tslint:enable:no-unused-variable */
var RX = require("../common/Interfaces");
var ActivityIndicator = (function (_super) {
    __extends(ActivityIndicator, _super);
    function ActivityIndicator(props) {
        var _this = _super.call(this, props) || this;
        _this._isMounted = false;
        _this.state = { isVisible: false };
        return _this;
    }
    ActivityIndicator.prototype.componentDidMount = function () {
        var _this = this;
        this._isMounted = true;
        if (this.props.deferTime && this.props.deferTime > 0) {
            setTimeout(function () {
                if (_this._isMounted) {
                    _this.setState({ isVisible: true });
                }
            }, this.props.deferTime);
        }
        else {
            this.setState({ isVisible: true });
        }
    };
    ActivityIndicator.prototype.componentWillUnmount = function () {
        this._isMounted = false;
    };
    ActivityIndicator.prototype.render = function () {
        var size;
        switch (this.props.size) {
            case 'tiny':
            case 'small':
                size = 'small';
                break;
            case 'medium':
                size = 'small';
                break; // React Native ActivityIndicator does not support 'medium' size
            case 'large':
                size = 'large';
                break;
            default:
                size = 'large';
                break;
        }
        return (React.createElement(RN.ActivityIndicator, { animating: this.state.isVisible, color: this.state.isVisible ? this.props.color : 'transparent', size: size }));
    };
    return ActivityIndicator;
}(RX.ActivityIndicator));
exports.ActivityIndicator = ActivityIndicator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ActivityIndicator;
