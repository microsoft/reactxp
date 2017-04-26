/**
* View.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform View abstraction.
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
var React = require("react");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var AnimateListEdits_1 = require("./listAnimations/AnimateListEdits");
var restyleForInlineText = require("./utils/restyleForInlineText");
var Styles_1 = require("./Styles");
var ViewBase_1 = require("./ViewBase");
var _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: '0 0 auto',
        overflow: 'hidden',
        alignItems: 'stretch'
    }
};
if (typeof document !== 'undefined') {
    var ignorePointerEvents = '.reactxp-ignore-pointer-events  * { pointer-events: auto; }';
    var head = document.head;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(ignorePointerEvents));
    head.appendChild(style);
}
var View = (function (_super) {
    __extends(View, _super);
    function View() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    View.prototype.getChildContext = function () {
        // Let descendant Types components know that their nearest Types ancestor is not an Types.Text.
        // Because they're in an Types.View, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        return { isRxParentAText: false };
    };
    View.prototype._getContainerRef = function () {
        return this;
    };
    View.prototype.render = function () {
        var combinedStyles = Styles_1.default.combine(_styles.defaultStyle, this.props.style);
        var ariaRole = AccessibilityUtil_1.default.accessibilityTraitToString(this.props.accessibilityTraits);
        var ariaSelected = AccessibilityUtil_1.default.accessibilityTraitToAriaSelected(this.props.accessibilityTraits);
        var isAriaHidden = AccessibilityUtil_1.default.isHidden(this.props.importantForAccessibility);
        var props = {
            role: ariaRole,
            tabIndex: this.props.tabIndex,
            style: combinedStyles,
            title: this.props.title,
            'aria-label': this.props.accessibilityLabel,
            'aria-hidden': isAriaHidden,
            'aria-selected': ariaSelected,
            onContextMenu: this.props.onContextMenu,
            onMouseEnter: this.props.onMouseEnter,
            onMouseLeave: this.props.onMouseLeave,
            onMouseOver: this.props.onMouseOver,
            onMouseMove: this.props.onMouseMove,
            onDragEnter: this.props.onDragEnter,
            onDragOver: this.props.onDragOver,
            onDragLeave: this.props.onDragLeave,
            onDrop: this.props.onDrop,
            onClick: this.props.onPress,
            onFocus: this.props.onFocus,
            onBlur: this.props.onBlur,
            onKeyDown: this.props.onKeyPress,
        };
        if (this.props.ignorePointerEvents) {
            props.className = 'reactxp-ignore-pointer-events';
            combinedStyles['pointerEvents'] = 'none';
        }
        var reactElement;
        var childAnimationsEnabled = this.props.animateChildEnter || this.props.animateChildMove || this.props.animateChildLeave;
        if (childAnimationsEnabled) {
            reactElement = (React.createElement(AnimateListEdits_1.default, __assign({}, props, { animateChildEnter: this.props.animateChildEnter, animateChildMove: this.props.animateChildMove, animateChildLeave: this.props.animateChildLeave }), this.props.children));
        }
        else {
            reactElement = (React.createElement("div", __assign({}, props), this.props.children));
        }
        return this.context.isRxParentAText ?
            restyleForInlineText(reactElement) :
            reactElement;
    };
    return View;
}(ViewBase_1.default));
View.contextTypes = {
    isRxParentAText: React.PropTypes.bool
};
View.childContextTypes = {
    isRxParentAText: React.PropTypes.bool.isRequired
};
exports.View = View;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = View;
