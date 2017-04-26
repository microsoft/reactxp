/**
* Button.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Button abstraction.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("./utils/lodashMini");
var React = require("react");
var ReactDOM = require("react-dom");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var RX = require("../common/Interfaces");
var Styles_1 = require("./Styles");
var Types = require("../common/Types");
var _styles = {
    defaultButton: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: '0 0 auto',
        overflow: 'hidden',
        alignItems: 'stretch',
        justifyContent: 'center',
        appRegion: 'no-drag',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textAlign: 'left',
        borderWidth: '0'
    },
    disabled: {
        opacity: 0.5
    }
};
var _longPressTime = 1000;
var _defaultAccessibilityTrait = Types.AccessibilityTrait.Button;
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._lastMouseDownTime = 0;
        _this._ignoreClick = false;
        _this._focusDueToMouseEvent = false;
        _this._blurDueToMouseEvent = false;
        _this.onClick = function (e) {
            if (_this._ignoreClick) {
                e.stopPropagation();
                _this._ignoreClick = false;
            }
            else if (!_this.props.disabled && _this.props.onPress) {
                _this.props.onPress(e);
            }
        };
        _this._onContextMenu = function (e) {
            if (_this.props.onContextMenu) {
                _this.props.onContextMenu(e);
            }
        };
        _this._onMouseDown = function (e) {
            if (_this.props.onPressIn) {
                _this.props.onPressIn(e);
            }
            if (_this.props.onLongPress) {
                _this._lastMouseDownTime = Date.now().valueOf();
                _this._lastMouseDownEvent = e;
                e.persist();
                _this._longPressTimer = window.setTimeout(function () {
                    _this._longPressTimer = undefined;
                    if (_this.props.onLongPress) {
                        _this.props.onLongPress(_this._lastMouseDownEvent);
                        _this._ignoreClick = true;
                    }
                }, _longPressTime);
            }
        };
        _this._onMouseUp = function (e) {
            if (_this.props.onPressOut) {
                _this.props.onPressOut(e);
            }
            if (_this._longPressTimer) {
                window.clearTimeout(_this._longPressTimer);
            }
        };
        _this._onMouseEnter = function (e) {
            if (_this.props.onHoverStart) {
                _this._focusDueToMouseEvent = true;
                _this.props.onHoverStart(e);
            }
        };
        _this._onMouseLeave = function (e) {
            if (_this.props.onHoverEnd) {
                _this._blurDueToMouseEvent = true;
                _this.props.onHoverEnd(e);
            }
        };
        // When we get focus on an element, show the hover effect on the element. 
        // This ensures that users using keyboard also get the similar experience as mouse users for accessibility.
        _this._onFocus = function (e) {
            if (_this.props.onHoverStart && !_this._focusDueToMouseEvent) {
                _this.props.onHoverStart(e);
            }
            _this._focusDueToMouseEvent = false;
            if (_this.props.onFocus) {
                _this.props.onFocus(e);
            }
        };
        _this._onBlur = function (e) {
            if (_this.props.onHoverEnd && !_this._blurDueToMouseEvent) {
                _this.props.onHoverEnd(e);
            }
            _this._blurDueToMouseEvent = false;
            if (_this.props.onBlur) {
                _this.props.onBlur(e);
            }
        };
        return _this;
    }
    Button.prototype.render = function () {
        var ariaRole = AccessibilityUtil_1.default.accessibilityTraitToString(this.props.accessibilityTraits, _defaultAccessibilityTrait);
        var ariaSelected = AccessibilityUtil_1.default.accessibilityTraitToAriaSelected(this.props.accessibilityTraits);
        var isAriaHidden = AccessibilityUtil_1.default.isHidden(this.props.importantForAccessibility);
        // NOTE: We use tabIndex=0 to support focus.
        return (React.createElement("button", { style: this._getStyles(), role: ariaRole, title: this.props.title, tabIndex: this.props.tabIndex, "aria-label": this.props.accessibilityLabel || this.props.title, "aria-disabled": this.props.disabled, "aria-hidden": isAriaHidden, "aria-selected": ariaSelected, onClick: this.onClick, onContextMenu: this._onContextMenu, onMouseDown: this._onMouseDown, onMouseUp: this._onMouseUp, onMouseEnter: this._onMouseEnter, onMouseLeave: this._onMouseLeave, onFocus: this._onFocus, onBlur: this._onBlur, onKeyDown: this.props.onKeyPress, disabled: this.props.disabled }, this.props.children));
    };
    Button.prototype.focus = function () {
        var el = ReactDOM.findDOMNode(this);
        if (el) {
            el.focus();
        }
    };
    Button.prototype.blur = function () {
        var el = ReactDOM.findDOMNode(this);
        if (el) {
            el.blur();
        }
    };
    Button.prototype._getStyles = function () {
        var buttonStyles = _.extend.apply(_, [{}].concat(this.props.style));
        // Specify default syle for padding only if padding is not already specified
        if (buttonStyles && buttonStyles.padding === undefined &&
            buttonStyles.paddingRight === undefined && buttonStyles.paddingLeft === undefined &&
            buttonStyles.paddingBottom === undefined && buttonStyles.paddingTop === undefined &&
            buttonStyles.paddingHorizontal === undefined && buttonStyles.paddingVertical === undefined) {
            buttonStyles['padding'] = '0';
        }
        var combinedStyles = Styles_1.default.combine(_styles.defaultButton, buttonStyles);
        if (this.props.disabled) {
            combinedStyles.opacity = 0.5;
        }
        if (this.props.disabled) {
            combinedStyles['cursor'] = 'default';
        }
        else {
            combinedStyles['cursor'] = this.props.cursor || 'pointer';
        }
        return combinedStyles;
    };
    return Button;
}(RX.Button));
exports.Button = Button;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Button;
