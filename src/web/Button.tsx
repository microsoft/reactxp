/**
 * Button.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Button abstraction.
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';

import AccessibilityUtil from './AccessibilityUtil';
import AppConfig from '../common/AppConfig';
import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import { applyFocusableComponentMixin } from './utils/FocusManager';
import { Button as ButtonBase, Types } from '../common/Interfaces';
import Styles from './Styles';
import Timers from '../common/utils/Timers';
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
    }
};

const _longPressTime = 1000;
const _defaultAccessibilityTrait = Types.AccessibilityTrait.Button;

export interface ButtonContext {
    hasRxButtonAscendant?: boolean;
    focusArbitrator?: FocusArbitratorProvider;
}

export class Button extends ButtonBase {
    static contextTypes = {
        hasRxButtonAscendant: PropTypes.bool,
        focusArbitrator: PropTypes.object
    };

    context!: ButtonContext;

    static childContextTypes = {
        hasRxButtonAscendant: PropTypes.bool
    };

    private _mountedButton: HTMLButtonElement | null = null;
    private _lastMouseDownEvent: Types.SyntheticEvent | undefined;
    private _ignoreClick = false;
    private _longPressTimer: number | undefined;
    private _isMouseOver = false;
    private _isFocusedWithKeyboard = false;
    private _isHoverStarted = false;

    constructor(props: Types.ButtonProps, context: ButtonContext) {
        super(props, context);

        if (context.hasRxButtonAscendant) {
            if (AppConfig.isDevelopmentMode()) {
                console.warn('Button components should not be embedded. Some APIs, e.g. Accessibility, will not work.');
            }
        }
    }

    getChildContext(): ButtonContext {
        return { hasRxButtonAscendant: true };
    }

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
                ref={ this._onMount }
                style={ this._getStyles() as any }
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
                data-test-id={ this.props.testId }
            >
                { this.props.children }
            </button>
        );
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    }

    requestFocus() {
        FocusArbitratorProvider.requestFocus(
            this,
            () => this.focus(),
            () => this._mountedButton !== null
        );
    }

    focus() {
        if (this._mountedButton) {
            this._mountedButton.focus();
        }
    }

    blur() {
        if (this._mountedButton) {
            this._mountedButton.blur();
        }
    }

    private _onMount = (ref: HTMLButtonElement | null) => {
        this._mountedButton = ref;
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
        const buttonStyleMutations: Types.ButtonStyle = {};
        const buttonStyles = Styles.combine(this.props.style) as any;

        // Specify default style for padding only if padding is not already specified
        if (buttonStyles && buttonStyles.padding === undefined  &&
                buttonStyles.paddingRight === undefined && buttonStyles.paddingLeft === undefined &&
                buttonStyles.paddingBottom === undefined && buttonStyles.paddingTop === undefined  &&
                buttonStyles.paddingHorizontal === undefined && buttonStyles.paddingVertical === undefined) {
            buttonStyleMutations.padding = 0;
        }

        if (this.props.disabled) {
            buttonStyleMutations.opacity = this.props.disabledOpacity !== undefined ? this.props.disabledOpacity : 0.5;
        }

        // Default to 'pointer' cursor for enabled buttons unless otherwise specified.
        if (!buttonStyles || !buttonStyles.cursor) {
            buttonStyleMutations.cursor = this.props.disabled ? 'default' : 'pointer';
        }

        return Styles.combine([_styles.defaultButton, buttonStyles, buttonStyleMutations]);
    }

    private _onContextMenu = (e: React.MouseEvent<any>) => {
        if (this.props.onContextMenu) {
            this.props.onContextMenu(e);
        }
    }

    private _onMouseDown = (e: React.SyntheticEvent<any>) => {
        if (this.props.onPressIn) {
            this.props.onPressIn(e);
        }

        if (this.props.onLongPress) {
            this._lastMouseDownEvent = e;
            e.persist();

            // In the unlikely event we get 2 mouse down events, clear existing timer
            if (this._longPressTimer) {
                clearTimeout(this._longPressTimer);
            }
            this._longPressTimer = Timers.setTimeout(() => {
                this._longPressTimer = undefined;
                if (this.props.onLongPress) {
                    // lastMouseDownEvent can never be undefined at this point
                    this.props.onLongPress(this._lastMouseDownEvent!);
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
            clearTimeout(this._longPressTimer);
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
        this._isFocusedWithKeyboard = UserInterface.isNavigatingWithKeyboard();
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
