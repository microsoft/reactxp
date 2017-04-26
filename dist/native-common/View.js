/**
* View.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform View abstraction.
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
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var AnimateListEdits_1 = require("./listAnimations/AnimateListEdits");
var Button_1 = require("./Button");
var ViewBase_1 = require("./ViewBase");
var View = (function (_super) {
    __extends(View, _super);
    function View(props) {
        var _this = _super.call(this, props) || this;
        _this._internalProps = {};
        _this._buildInternalProps(props);
        return _this;
    }
    View.prototype.componentWillReceiveProps = function (nextProps) {
        this._buildInternalProps(nextProps);
    };
    /**
     * Attention:
     * be careful with setting any non layout properties unconditionally in this method to any value
     * as on android that would lead to extra layers of Views.
     */
    View.prototype._buildInternalProps = function (props) {
        this._internalProps = _.clone(props);
        this._internalProps.style = this._getStyles(props);
        this._internalProps.ref = this._setNativeView;
        var importantForAccessibility = AccessibilityUtil_1.default.importantForAccessibilityToString(props.importantForAccessibility);
        var accessibilityLabel = props.accessibilityLabel || props.title;
        // Set accessibility props on Native only if we have valid importantForAccessibility value or accessibility label or
        // if this view is not a button.
        // For a button, we let the Button component compute its own accessibility props.
        var shouldSetAccessibilityProps = this._internalProps && !this._isButton(props) &&
            !!(importantForAccessibility || accessibilityLabel);
        if (shouldSetAccessibilityProps) {
            this._internalProps.importantForAccessibility = importantForAccessibility;
            this._internalProps.accessibilityLabel = accessibilityLabel;
            this._internalProps.accessibilityTraits = AccessibilityUtil_1.default.accessibilityTraitToString(props.accessibilityTraits);
            this._internalProps.accessibilityComponentType = AccessibilityUtil_1.default.accessibilityComponentTypeToString(props.accessibilityTraits);
        }
        if (props.onLayout) {
            this._internalProps.onLayout = this._onLayout;
        }
        if (this.props.blockPointerEvents) {
            this._internalProps.pointerEvents = 'none';
        }
        else {
            if (this.props.ignorePointerEvents) {
                this._internalProps.pointerEvents = 'box-none';
            }
        }
    };
    View.prototype._isButton = function (viewProps) {
        return !!(viewProps.onPress || viewProps.onLongPress);
    };
    View.prototype.render = function () {
        if (this.props.animateChildEnter || this.props.animateChildMove || this.props.animateChildLeave) {
            return (React.createElement(AnimateListEdits_1.default, __assign({}, this._internalProps), this.props.children));
        }
        else if (this._isButton(this.props)) {
            return (React.createElement(Button_1.default, __assign({}, this._internalProps), this.props.children));
        }
        else {
            return (React.createElement(RN.View, __assign({}, this._internalProps), this.props.children));
        }
    };
    return View;
}(ViewBase_1.default));
exports.View = View;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = View;
