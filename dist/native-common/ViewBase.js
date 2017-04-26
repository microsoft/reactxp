/**
* ViewBase.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Base class that is used for several RX views.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("./lodashMini");
var RX = require("../common/Interfaces");
var Styles_1 = require("./Styles");
var ViewBase = (function (_super) {
    __extends(ViewBase, _super);
    function ViewBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._layoutEventValues = null;
        _this._nativeView = null;
        _this._setNativeView = function (view) {
            _this._nativeView = view;
        };
        _this._onLayout = function (event) {
            if (_this.props.onLayout) {
                var layoutEventValues = {
                    x: event.nativeEvent.layout.x,
                    y: event.nativeEvent.layout.y,
                    width: event.nativeEvent.layout.width,
                    height: event.nativeEvent.layout.height
                };
                // Only fire the onLayout callback if the layout values change
                if (!_.isEqual(_this._layoutEventValues, layoutEventValues)) {
                    _this.props.onLayout(layoutEventValues);
                    _this._layoutEventValues = layoutEventValues;
                }
            }
        };
        return _this;
    }
    ViewBase.setDefaultViewStyle = function (defaultViewStyle) {
        ViewBase._defaultViewStyle = defaultViewStyle;
    };
    // To be able to use View inside TouchableHighlight/TouchableOpacity
    ViewBase.prototype.setNativeProps = function (nativeProps) {
        if (this._nativeView) {
            this._nativeView.setNativeProps(nativeProps);
        }
    };
    ViewBase.prototype._getStyles = function (props) {
        // If this platform uses an explicit default view style, push it on to
        // the front of the list of provided styles.
        if (ViewBase._defaultViewStyle) {
            return Styles_1.default.combine(ViewBase._defaultViewStyle, props.style);
        }
        return props.style;
    };
    ViewBase.prototype.focus = function () {
        // native mobile platforms doesn't have the notion of focus for Views, so ignore.
    };
    ViewBase.prototype.blur = function () {
        // native mobile platforms doesn't have the notion of blur for Views, so ignore.
    };
    return ViewBase;
}(RX.ViewBase));
ViewBase._defaultViewStyle = null;
exports.ViewBase = ViewBase;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ViewBase;
