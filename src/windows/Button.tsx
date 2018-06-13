/**
* Button.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN Windows-specific implementation of the cross-platform Button abstraction.
*/

import PropTypes = require('prop-types');
import React = require('react');
import RN = require('react-native');
import RNW = require('react-native-windows');

import { Button as ButtonBase, ButtonContext as ButtonContextBase } from '../native-common/Button';
import EventHelpers from '../native-common/utils/EventHelpers';
import UserInterface from '../native-common/UserInterface';
import { applyFocusableComponentMixin, FocusManagerFocusableComponent } from '../native-desktop/utils/FocusManager';

const KEY_CODE_ENTER = 13;
const KEY_CODE_SPACE = 32;

const DOWN_KEYCODES = [KEY_CODE_SPACE, KEY_CODE_ENTER];
const UP_KEYCODES = [KEY_CODE_SPACE];

let FocusableAnimatedView = RNW.createFocusableComponent(RN.Animated.View);

export interface ButtonContext extends ButtonContextBase {
    isRxParentAContextMenuResponder?: boolean;
}

export class Button extends ButtonBase implements React.ChildContextProvider<ButtonContext>, FocusManagerFocusableComponent {

    // Context is provided by super - just re-typing here
    context!: ButtonContext;

    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAContextMenuResponder: PropTypes.bool,
        ...ButtonBase.childContextTypes
    };

    private _isFocusedWithKeyboard = false;

    protected _render(internalProps: RN.ViewProps, onMount: (btn: any) => void): JSX.Element {
        // RNW.FocusableProps tabIndex: default is 0.
        // -1 has no special semantic similar to DOM.
        let tabIndex: number | undefined = this.getTabIndex();
        // RNW.FocusableProps windowsTabFocusable:
        // - true: keyboard focusable through any mean, receives keyboard input
        // - false: not focusable at all, doesn't receive keyboard input
        // The intermediate "focusable, but not in the tab order" case is not supported.
        let windowsTabFocusable: boolean = !this.props.disabled && tabIndex !== undefined && tabIndex >= 0;

        // We don't use 'string' ref type inside ReactXP
        let originalRef = (internalProps as any).ref;
        if (typeof originalRef === 'string') {
            throw new Error('Button: ReactXP must not use string refs internally');
        }
        let componentRef: Function = originalRef as Function;

        let focusableViewProps: RNW.FocusableWindowsProps<RN.ExtendedViewProps> = {
            ...internalProps,
            ref: onMount,
            componentRef: componentRef,
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
            <FocusableAnimatedView { ...focusableViewProps }>
                { this.props.children }
            </FocusableAnimatedView>
        );
    }

    focus() {
        if (this._buttonElement && this._buttonElement.focus) {
            this._buttonElement.focus();
        }

    }

    blur() {
        if (this._buttonElement && this._buttonElement.blur) {
            this._buttonElement.blur();
        }
    }

    setNativeProps(nativeProps: RN.ViewProps) {
        // Redirect to focusable component if present.
        if (this._buttonElement) {
            this._buttonElement.setNativeProps(nativeProps);
        } else {
            super.setNativeProps(nativeProps);
        }
    }

    getChildContext(): ButtonContext {
        let childContext: ButtonContext = super.getChildContext();

        // We use a context field to signal any component in the subtree to disable any system provided context menus.
        // This is not a bulletproof mechanism, context changes not being guaranteed to be detected by children, depending on factors
        // like shouldComponentUpdate methods on intermediate nodes, etc.
        // Fortunately press handlers are pretty stable.

        // This instance can be a responder (even when button is disabled). It may or may not have to invoke an onContextMenu handler, but
        // it will consume all corresponding touch events, so overwriting any parent-set value is the correct thing to do.
        childContext.isRxParentAContextMenuResponder = !!this.props.onContextMenu;

        return childContext;
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

        this._isFocusedWithKeyboard = UserInterface.isNavigatingWithKeyboard();
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
        if (this._buttonElement) {
            let tabIndex: number | undefined = this.getTabIndex();
            let windowsTabFocusable: boolean = !this.props.disabled && tabIndex !== undefined && tabIndex >= 0;

            this._buttonElement.setNativeProps({
                tabIndex: tabIndex,
                isTabStop: windowsTabFocusable
            });
        }
    }
}

applyFocusableComponentMixin(Button);

export default Button;
