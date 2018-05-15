"use strict";
/**
* RootView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* The top-most view that's used for proper layering or modals and popups.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var RN = require("react-native");
var RNW = require("react-native-windows");
var RootView_1 = require("../native-desktop/RootView");
exports.BaseRootView = RootView_1.BaseRootView;
//
// We use a custom RNW provided component to capture key input before being dispatched to native controls.
// If support not present, we fallback to the base class implementation.
var _isRootInputViewSupported = !!RNW.RootInputViewWindows;
var _styles = RN.StyleSheet.create({
    appWrapperStyle: {
        flex: 1
    }
});
function _renderTopView(content, onKeyDown, onKeyDownCapture, onKeyUp, onTouchStartCapture) {
    return (React.createElement(RNW.RootInputViewWindows, { onTouchStartCapture: onTouchStartCapture, onAccelKeyDown: function (e) { onKeyDownCapture(e); onKeyDown(e); }, onAccelKeyUp: onKeyUp, style: _styles.appWrapperStyle }, content));
}
var RootViewUsingStore = /** @class */ (function (_super) {
    __extends(RootViewUsingStore, _super);
    function RootViewUsingStore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RootViewUsingStore.prototype.renderTopView = function (content) {
        if (_isRootInputViewSupported) {
            return _renderTopView(content, this._onKeyDown, this._onKeyDownCapture, this._onKeyUp, this._onTouchStartCapture);
        }
        else {
            return _super.prototype.renderTopView.call(this, content);
        }
    };
    return RootViewUsingStore;
}(RootView_1.RootView));
exports.RootView = RootViewUsingStore;
var RootViewUsingProps = /** @class */ (function (_super) {
    __extends(RootViewUsingProps, _super);
    function RootViewUsingProps() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RootViewUsingProps.prototype.renderTopView = function (content) {
        if (_isRootInputViewSupported) {
            return _renderTopView(content, this._onKeyDown, this._onKeyDownCapture, this._onKeyUp, this._onTouchStartCapture);
        }
        else {
            return _super.prototype.renderTopView.call(this, content);
        }
    };
    return RootViewUsingProps;
}(RootView_1.RootViewUsingProps));
exports.RootViewUsingProps = RootViewUsingProps;
exports.default = RootViewUsingStore;
