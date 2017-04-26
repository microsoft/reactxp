/**
* Text.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Text abstraction.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ReactDOM = require("react-dom");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var RX = require("../common/Interfaces");
var Styles_1 = require("./Styles");
var _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'inline',
        flex: '0 0 auto',
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        msHyphens: 'auto'
    },
    ellipsis: {
        position: 'relative',
        display: 'inline',
        flex: '0 0 auto',
        overflow: 'hidden',
        whiteSpace: 'pre',
        textOverflow: 'ellipsis'
    }
};
var Text = (function (_super) {
    __extends(Text, _super);
    function Text() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Text.prototype.getChildContext = function () {
        // Let descendant Types components know that their nearest Types ancestor is an Types.Text.
        // Because they're in an Types.Text, they should style themselves specially for appearing
        // inline with text.
        return { isRxParentAText: true };
    };
    Text.prototype.render = function () {
        // Handle special case
        if (typeof this.props.children === 'string' && this.props.children === '\n') {
            return React.createElement("br", null);
        }
        var isAriaHidden = AccessibilityUtil_1.default.isHidden(this.props.importantForAccessibility);
        return (React.createElement("div", { style: this._getStyles(), "aria-hidden": isAriaHidden, onClick: this.props.onPress }, this.props.children));
    };
    Text.prototype._getStyles = function () {
        // There's no way in HTML to properly handle numberOfLines > 1,
        // but we can correctly handle the common case where numberOfLines is 1.
        var combinedStyles = Styles_1.default.combine(this.props.numberOfLines === 1 ?
            _styles.ellipsis : _styles.defaultStyle, this.props.style);
        // Handle cursor styles
        if (this.props.selectable) {
            combinedStyles['cursor'] = 'text';
            combinedStyles['userSelect'] = 'text';
            combinedStyles['WebkitUserSelect'] = 'text';
            combinedStyles['MozUserSelect'] = 'text';
            combinedStyles['msUserSelect'] = 'text';
        }
        else {
            combinedStyles['cursor'] = 'inherit';
        }
        if (this.props.onPress) {
            combinedStyles['cursor'] = 'pointer';
        }
        return combinedStyles;
    };
    Text.prototype.blur = function () {
        var el = ReactDOM.findDOMNode(this);
        if (el) {
            el.blur();
        }
    };
    Text.prototype.focus = function () {
        var el = ReactDOM.findDOMNode(this);
        if (el) {
            el.focus();
        }
    };
    return Text;
}(RX.Text));
Text.childContextTypes = {
    isRxParentAText: React.PropTypes.bool.isRequired
};
exports.Text = Text;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Text;
