/**
* Button.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN Windows-specific implementation of the cross-platform Button abstraction.
*/

import React = require('react');
import {Button as ButtonBase} from '../native-common/Button';
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

// Simple check for the presence of the updated React Native for Windows
const IsUpdatedReactNativeForWindows = (RNW.FocusableWindows !== undefined);

export class Button extends ButtonBase implements FocusManagerFocusableComponent {

    private _focusableElement : RNW.FocusableWindows | null = null;

    private _isMouseOver = false;
    private _isFocusedWithKeyboard = false;
    private _isHoverStarted = false;

    private _onFocusableRef = (btn: RNW.FocusableWindows): void => {
        this._focusableElement = btn;
    }

    protected _render(internalProps: RN.ViewProps): JSX.Element {

        // Fallback to native-common fast if the keyboard enabled component is not available
        if (!IsUpdatedReactNativeForWindows) {
            return super._render(internalProps);
        }

        // RNW.FocusableProps tabIndex: default is 0.
        // -1 has no special semantic similar to DOM.
        let tabIndex: number | undefined = this.getTabIndex();
        // RNW.FocusableProps windowsTabFocusable:
        // - true: keyboard focusable through any mean, receives keyboard input
        // - false: not focusable at all, doesn't receive keyboard input
        // The intermediate "focusable, but not in the tab order" case is not supported.
        let windowsTabFocusable: boolean = !this.props.disabled && tabIndex !== undefined && tabIndex >= 0;

        // RNW.FocusableWindows doesn't participate in layouting, it basically mimics the position/size of the child
        let focusableViewProps: RNW.FocusableProps = {
            ref: this._onFocusableRef,
            isTabStop: windowsTabFocusable,
            tabIndex: tabIndex,
            disableSystemFocusVisuals: false,
            handledKeyDownKeys: DOWN_KEYCODES,
            handledKeyUpKeys: UP_KEYCODES,
            onKeyDown: this._onKeyDown,
            onKeyUp: this._onKeyUp,
            onFocus: this._onFocus,
            onBlur: this._onBlur
        };

        return (
            <RNW.FocusableWindows
                {...focusableViewProps}
            >
                <RN.Animated.View
                    {...internalProps}
                    onMouseEnter={this._onMouseEnter}
                    onMouseLeave={this._onMouseLeave}
                >
                    { this.props.children }
                </RN.Animated.View>
            </RNW.FocusableWindows>
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
                    return;
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

    private _onMouseEnter = (e: React.SyntheticEvent<any>) => {
        this._isMouseOver = true;
        this._onHoverStart(e);
    }

    private _onMouseLeave = (e: React.SyntheticEvent<any>) => {
        this._isMouseOver = false;
        this._onHoverEnd(e);
    }

    // When we get focus on an element, show the hover effect on the element.
    // This ensures that users using keyboard also get the similar experience as mouse users for accessibility.
    private _onFocus = (e: React.SyntheticEvent<any>): void => {
        this.onFocus();

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

    private _onHoverStart = (e: React.SyntheticEvent<any>) => {
        if (!this._isHoverStarted && (this._isMouseOver || this._isFocusedWithKeyboard)) {
            this._isHoverStarted = true;

            if (this.props.onHoverStart) {
                this.props.onHoverStart(e);
            }
        }
    }

    private _onHoverEnd = (e: React.SyntheticEvent<any>) => {
        if (this._isHoverStarted && !this._isMouseOver && !this._isFocusedWithKeyboard) {
            this._isHoverStarted = false;

            if (this.props.onHoverEnd) {
                this.props.onHoverEnd(e);
            }
        }
    }

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