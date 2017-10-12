/**
* Button.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Button abstraction.
*/

import _ = require('./utils/lodashMini');
import React = require('react');
import ReactDOM = require('react-dom');

import AccessibilityUtil from './AccessibilityUtil';
import RX = require('../common/Interfaces');
import Styles from './Styles';
import Types = require('../common/Types');
import { applyFocusableComponentMixin } from './utils/FocusManager';
import UserInterface from './UserInterface';

const _styles = {
    defaultButton: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
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

const _longPressTime = 1000;
const _defaultAccessibilityTrait = Types.AccessibilityTrait.Button;

let _isNavigatingWithKeyboard = false;

UserInterface.keyboardNavigationEvent.subscribe(isNavigatingWithKeyboard => {
    _isNavigatingWithKeyboard = isNavigatingWithKeyboard;
});

export class Button extends React.Component<Types.ButtonProps, {}> {
    private _lastMouseDownTime: number = 0;
    private _lastMouseDownEvent: Types.SyntheticEvent;
    private _ignoreClick = false;
    private _longPressTimer: number;
    private _isMouseOver = false;
    private _isFocusedWithKeyboard = false;
    private _isHoverStarted = false;

    render() {
        const ariaRole = AccessibilityUtil.accessibilityTraitToString(this.props.accessibilityTraits,
            _defaultAccessibilityTrait);
        const ariaSelected = AccessibilityUtil.accessibilityTraitToAriaSelected(this.props.accessibilityTraits);
        const ariaChecked = AccessibilityUtil.accessibilityTraitToAriaChecked(this.props.accessibilityTraits);
        const isAriaHidden = AccessibilityUtil.isHidden(this.props.importantForAccessibility);
        const ariaHasPopup = AccessibilityUtil.accessibilityTraitToAriaHasPopup(this.props.accessibilityTraits);

        // NOTE: We use tabIndex=0 to support focus.
        return (
            <button
                style={ this._getStyles() }
                role={ ariaRole }
                title={ this.props.title }
                tabIndex={ this.props.tabIndex }
                aria-label={ this.props.accessibilityLabel || this.props.title }
                aria-disabled={ this.props.disabled }
                aria-hidden={ isAriaHidden }
                aria-selected={ ariaSelected }
                aria-checked={ ariaChecked }
                onClick={ this.onClick }
                onContextMenu={ this._onContextMenu }
                onMouseDown={ this._onMouseDown }
                onMouseUp={ this._onMouseUp }
                onMouseEnter={ this._onMouseEnter }
                onMouseLeave={ this._onMouseLeave }
                onFocus={ this._onFocus }
                onBlur={ this._onBlur }
                onKeyDown={ this.props.onKeyPress }
                disabled={ this.props.disabled }
                aria-haspopup={ ariaHasPopup }
                aria-controls={ this.props.ariaControls }
                id={ this.props.id }
            >
                { this.props.children }
            </button>
        );
    }

    focus() {
        let el = ReactDOM.findDOMNode<HTMLElement>(this);
        if (el) {
            el.focus();
        }
    }

    blur() {
        let el = ReactDOM.findDOMNode<HTMLInputElement>(this);
        if (el) {
            el.blur();
        }
    }

    protected onClick = (e: Types.MouseEvent) => {
        if (this._ignoreClick) {
            e.stopPropagation();
            this._ignoreClick = false;
        } else if (!this.props.disabled && this.props.onPress) {
            this.props.onPress(e);
        }
    }

    private _getStyles(): Types.ButtonStyleRuleSet {
        let buttonStyles = Styles.combine(this.props.style) as any;

        // Specify default syle for padding only if padding is not already specified
        if (buttonStyles && buttonStyles.padding === undefined  &&
                buttonStyles.paddingRight === undefined && buttonStyles.paddingLeft === undefined &&
                buttonStyles.paddingBottom === undefined && buttonStyles.paddingTop === undefined  &&
                buttonStyles.paddingHorizontal === undefined && buttonStyles.paddingVertical === undefined) {
            buttonStyles['padding'] = '0';
        }

        let combinedStyles = Styles.combine([_styles.defaultButton, buttonStyles]);

        if (this.props.disabled) {
            combinedStyles.opacity = 0.5;
        }

        if (this.props.disabled) {
            combinedStyles['cursor'] = 'default';
        } else {
            combinedStyles['cursor'] = this.props.cursor || 'pointer';
        }

        return combinedStyles;
    }

    private _onContextMenu = (e: Types.SyntheticEvent) => {
        if (this.props.onContextMenu) {
            this.props.onContextMenu(e);
        }
    }

    private _onMouseDown = (e: Types.SyntheticEvent) => {
        if (this.props.onPressIn) {
            this.props.onPressIn(e);
        }

        if (this.props.onLongPress) {
            this._lastMouseDownTime = Date.now().valueOf();
            this._lastMouseDownEvent = e;
            e.persist();

            this._longPressTimer = window.setTimeout(() => {
                this._longPressTimer = undefined;
                if (this.props.onLongPress) {
                    this.props.onLongPress(this._lastMouseDownEvent);
                    this._ignoreClick = true;
                }
            }, _longPressTime);
        }
    }

    private _onMouseUp = (e: Types.SyntheticEvent) => {
        if (this.props.onPressOut) {
            this.props.onPressOut(e);
        }

        if (this._longPressTimer) {
            window.clearTimeout(this._longPressTimer);
        }
    }

    private _onMouseEnter = (e: Types.SyntheticEvent) => {
        this._isMouseOver = true;
        this._onHoverStart(e);
    }

    private _onMouseLeave = (e: Types.SyntheticEvent) => {
        this._isMouseOver = false;
        this._onHoverEnd(e);
    }

    // When we get focus on an element, show the hover effect on the element.
    // This ensures that users using keyboard also get the similar experience as mouse users for accessibility.
    private _onFocus = (e: Types.FocusEvent) => {
        this._isFocusedWithKeyboard = _isNavigatingWithKeyboard;
        this._onHoverStart(e);

        if (this.props.onFocus) {
            this.props.onFocus(e);
        }
    }

    private _onBlur = (e: Types.FocusEvent) => {
        this._isFocusedWithKeyboard = false;
        this._onHoverEnd(e);

        if (this.props.onBlur) {
            this.props.onBlur(e);
        }
    }

    private _onHoverStart = (e: Types.SyntheticEvent) => {
        if (!this._isHoverStarted && (this._isMouseOver || this._isFocusedWithKeyboard)) {
            this._isHoverStarted = true;

            if (this.props.onHoverStart) {
                this.props.onHoverStart(e);
            }
        }
    }

    private _onHoverEnd = (e: Types.SyntheticEvent) => {
        if (this._isHoverStarted && !this._isMouseOver && !this._isFocusedWithKeyboard) {
            this._isHoverStarted = false;

            if (this.props.onHoverEnd) {
                this.props.onHoverEnd(e);
            }
        }
    }
}

applyFocusableComponentMixin(Button);

export default Button;
