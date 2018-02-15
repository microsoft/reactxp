/**
* Button.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN Windows-specific implementation of the cross-platform Button abstraction.
*/

import React = require('react');
import { Button as ButtonBase } from '../native-common/Button';
import EventHelpers from '../native-common/utils/EventHelpers';
import UserInterface from '../native-desktop/UserInterface';
import RN = require('react-native');
import RNW = require('react-native-windows');
import { applyFocusableComponentMixin, FocusManagerFocusableComponent } from '../native-desktop/utils/FocusManager';

const KEY_CODE_ENTER = 13;
const KEY_CODE_SPACE = 32;

const DOWN_KEYCODES = [KEY_CODE_SPACE, KEY_CODE_ENTER];
const UP_KEYCODES = [KEY_CODE_SPACE];

let _isNavigatingWithKeyboard = false;

UserInterface.keyboardNavigationEvent.subscribe(isNavigatingWithKeyboard => {
   _isNavigatingWithKeyboard = isNavigatingWithKeyboard;
});

let FocusableAnimatedView = RNW.createFocusableComponent(RN.Animated.View);

export class Button extends ButtonBase implements FocusManagerFocusableComponent {

    private _focusableElement : RNW.FocusableWindows<RN.ViewProps> | null = null;

    private _isFocusedWithKeyboard = false;

    private _onFocusableRef = (btn: RNW.FocusableWindows<RN.ViewProps> | null): void => {
        this._focusableElement = btn;
    }

    protected _render(internalProps: RN.ViewProps): JSX.Element {
        // RNW.FocusableProps tabIndex: default is 0.
        // -1 has no special semantic similar to DOM.
        let tabIndex: number | undefined = this.getTabIndex();
        // RNW.FocusableProps windowsTabFocusable:
        // - true: keyboard focusable through any mean, receives keyboard input
        // - false: not focusable at all, doesn't receive keyboard input
        // The intermediate "focusable, but not in the tab order" case is not supported.
        let windowsTabFocusable: boolean = !this.props.disabled && tabIndex !== undefined && tabIndex >= 0;

        // We don't use 'string' ref type inside ReactXP
        let originalRef = internalProps.ref;
        if (typeof originalRef === 'string') {
            throw new Error('Button: ReactXP must not use string refs internally');
        }
        let componentRef: Function = originalRef as Function;

        let focusableViewProps: RNW.FocusableWindowsProps<RN.ViewProps> = {
            ...internalProps,
            componentRef: componentRef,
            ref: this._onFocusableRef,
            onMouseEnter: this._onMouseEnter,
            onMouseLeave: this._onMouseLeave,
            isTabStop: windowsTabFocusable,
            tabIndex: tabIndex,
            disableSystemFocusVisuals: false,
            handledKeyDownKeys: DOWN_KEYCODES,
            handledKeyUpKeys: UP_KEYCODES,
            onKeyDown: this._onKeyDown,
            onKeyUp: this._onKeyUp,
            onFocus: this._onFocus,
            onBlur: this._onBlur,
            onAccessibilityTap: this._onAccessibilityTap
        };

        return (
            <FocusableAnimatedView
                { ...focusableViewProps }
            >
                { this.props.children }
            </FocusableAnimatedView>
        );
    }

    focus() {
        super.focus();
        if (this._focusableElement && this._focusableElement.focus) {
            this._focusableElement.focus();
        }

    }

    blur() {
        super.blur();
        if (this._focusableElement && this._focusableElement.blur) {
            this._focusableElement.blur();
        }
    }

    setNativeProps(nativeProps: RN.ViewProps) {
        // Redirect to focusable component if present.
        if (this._focusableElement) {
            this._focusableElement.setNativeProps(nativeProps);
        } else {
            super.setNativeProps(nativeProps);
        }
    }

    private _onAccessibilityTap = (e: React.SyntheticEvent<any>): void => {
        if (!this.props.disabled) {
            if (this.props.onPress) {
                this.props.onPress(e);
            }
        }
    }

    private _onKeyDown = (e: React.SyntheticEvent<any>): void => {
        if (!this.props.disabled) {
            let keyEvent = EventHelpers.toKeyboardEvent(e);
            if (this.props.onKeyPress) {
                this.props.onKeyPress(keyEvent);
            }

            if (this.props.onPress) {
                let key = keyEvent.keyCode;
                // ENTER triggers press on key down
                if (key === KEY_CODE_ENTER) {
                    this.props.onPress(keyEvent);
                }
            }
        }
    }

    private _onKeyUp = (e: React.SyntheticEvent<any>): void => {
        let keyEvent = EventHelpers.toKeyboardEvent(e);
        if (keyEvent.keyCode === KEY_CODE_SPACE) {
            if (!this.props.disabled && this.props.onPress) {
                this.props.onPress(keyEvent);
            }
        }
    }

    // When we get focus on an element, show the hover effect on the element.
    // This ensures that users using keyboard also get the similar experience as mouse users for accessibility.
    private _onFocus = (e: React.SyntheticEvent<any>): void => {
        if (e.currentTarget === e.target) {
            this.onFocus();
        }

        this._isFocusedWithKeyboard = _isNavigatingWithKeyboard;
        this._onHoverStart(e);

        if (this.props.onFocus) {
            this.props.onFocus(EventHelpers.toFocusEvent(e));
        }
    }

    private _onBlur = (e: React.SyntheticEvent<any>): void => {
        this._isFocusedWithKeyboard = false;
        this._onHoverEnd(e);

        if (this.props.onBlur) {
            this.props.onBlur(EventHelpers.toFocusEvent(e));
        }
    }

    protected _onHoverStart = (e: React.SyntheticEvent<any>) => {
        if (!this._isHoverStarted && (this._isMouseOver || this._isFocusedWithKeyboard)) {
            this._isHoverStarted = true;

            if (this.props.onHoverStart) {
                this.props.onHoverStart(e);
            }
        }
    }

    protected _onHoverEnd = (e: React.SyntheticEvent<any>) => {
        if (this._isHoverStarted && !this._isMouseOver && !this._isFocusedWithKeyboard) {
            this._isHoverStarted = false;

            if (this.props.onHoverEnd) {
                this.props.onHoverEnd(e);
            }
        }
    }

    // From FocusManagerFocusableComponent interface
    //
    onFocus() {
        // Focus Manager hook
    }

    getTabIndex(): number | undefined {
        // Button defaults to a tabIndex of 0
        // Focus Manager may override this
        return this.props.tabIndex || 0;
    }

    updateNativeTabIndex(): void {
        if (this._focusableElement) {
            let tabIndex: number | undefined = this.getTabIndex();
            let windowsTabFocusable: boolean = !this.props.disabled && tabIndex !== undefined && tabIndex >= 0;

            this._focusableElement.setNativeProps({
                tabIndex: tabIndex,
                isTabStop: windowsTabFocusable
            });
        }
    }
}

applyFocusableComponentMixin(Button);

export default Button;
