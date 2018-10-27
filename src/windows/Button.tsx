/**
 * Button.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN Windows-specific implementation of the cross-platform Button abstraction.
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as RN from 'react-native';
import * as RNW from 'react-native-windows';

import AccessibilityUtil, { ImportantForAccessibilityValue } from '../native-common/AccessibilityUtil';
import { Button as ButtonBase, ButtonContext as ButtonContextBase } from '../native-common/Button';
import EventHelpers from '../native-common/utils/EventHelpers';
import { applyFocusableComponentMixin, FocusManagerFocusableComponent } from '../native-desktop/utils/FocusManager';
import { Types } from '../common/Interfaces';
import UserInterface from '../native-common/UserInterface';

const KEY_CODE_ENTER = 13;
const KEY_CODE_SPACE = 32;
const KEY_CODE_F10 = 121;
const KEY_CODE_APP = 500;

const DOWN_KEYCODES = [KEY_CODE_SPACE, KEY_CODE_ENTER, KEY_CODE_F10, KEY_CODE_APP];
const UP_KEYCODES = [KEY_CODE_SPACE];

const FocusableAnimatedView = RNW.createFocusableComponent(RN.Animated.View);

export interface ButtonContext extends ButtonContextBase {
    isRxParentAContextMenuResponder?: boolean;
    isRxParentAFocusableInSameFocusManager?: boolean;
}

export class Button extends ButtonBase implements React.ChildContextProvider<ButtonContext>, FocusManagerFocusableComponent {

    // Context is provided by super - just re-typing here
    context!: ButtonContext;

    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAContextMenuResponder: PropTypes.bool,
        isRxParentAFocusableInSameFocusManager: PropTypes.bool,
        ...ButtonBase.childContextTypes
    };

    private _isFocusedWithKeyboard = false;

    // Offset to show context menu using keyboard.
    protected _getContextMenuOffset() {
        return { x: 0, y: 0 };
    }

    protected _render(internalProps: RN.ViewProps, onMount: (btn: any) => void): JSX.Element {
        // RNW.FocusableProps tabIndex: default is 0.
        // -1 has no special semantic similar to DOM.
        const tabIndex: number | undefined = this.getTabIndex();
        // RNW.FocusableProps windowsTabFocusable:
        // - true: keyboard focusable through any mean, receives keyboard input
        // - false: not focusable at all, doesn't receive keyboard input
        // The intermediate "focusable, but not in the tab order" case is not supported.
        const windowsTabFocusable: boolean = !this.props.disabled && tabIndex !== undefined && tabIndex >= 0;

        const importantForAccessibility: ImportantForAccessibilityValue | undefined = this.getImportantForAccessibility();

        // We don't use 'string' ref type inside ReactXP
        const originalRef = (internalProps as any).ref;
        if (typeof originalRef === 'string') {
            throw new Error('Button: ReactXP must not use string refs internally');
        }
        const componentRef: Function = originalRef as Function;

        const focusableViewProps: RNW.FocusableWindowsProps<RN.ExtendedViewProps | RNW.AccessibilityEvents> = {
            ...internalProps,
            ref: onMount,
            componentRef: componentRef,
            onMouseEnter: this._onMouseEnter,
            onMouseLeave: this._onMouseLeave,
            isTabStop: windowsTabFocusable,
            tabIndex: tabIndex,
            importantForAccessibility: importantForAccessibility,
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
        const childContext: ButtonContext = super.getChildContext();

        // We use a context field to signal any component in the subtree to disable any system provided context menus.
        // This is not a bulletproof mechanism, context changes not being guaranteed to be detected by children, depending on factors
        // like shouldComponentUpdate methods on intermediate nodes, etc.
        // Fortunately press handlers are pretty stable.

        // This instance can be a responder (even when button is disabled). It may or may not have to invoke an onContextMenu handler, but
        // it will consume all corresponding touch events, so overwriting any parent-set value is the correct thing to do.
        childContext.isRxParentAContextMenuResponder = !!this.props.onContextMenu;

        // This button will hide other "accessible focusable" controls as part of being restricted/limited by a focus manager
        // (more detailed description is in windows/View.tsx)
        childContext.isRxParentAFocusableInSameFocusManager = true;

        return childContext;
    }

    private _onAccessibilityTap = (e: RN.NativeSyntheticEvent<any>): void => {
        if (!this.props.disabled) {
            if (this.props.onPress) {
                this.props.onPress(e);
            }
        }
    }

    private _onKeyDown = (e: React.SyntheticEvent<any>): void => {
        if (!this.props.disabled) {
            const keyEvent = EventHelpers.toKeyboardEvent(e);
            if (this.props.onKeyPress) {
                this.props.onKeyPress(keyEvent);
            }

            if (this.props.onPress) {
                const key = keyEvent.keyCode;
                // ENTER triggers press on key down
                if (key === KEY_CODE_ENTER) {
                    this.props.onPress(keyEvent);
                }
            }

            if (this.props.onContextMenu) {
                const key = keyEvent.keyCode;
                if ((key === KEY_CODE_APP) || (key === KEY_CODE_F10 && keyEvent.shiftKey)) {
                    if (this._isMounted) {
                        UserInterface.measureLayoutRelativeToWindow(this).then( layoutInfo => {
                            // need to simulate the mouse event so that we
                            // can show the context menu in the right position
                            if (this._isMounted) {
                                const mouseEvent = EventHelpers.keyboardToMouseEvent(keyEvent, layoutInfo,
                                    this._getContextMenuOffset());
                                if (this.props.onContextMenu) {
                                    this.props.onContextMenu(mouseEvent);
                                }
                            }
                        });
                    }
                }
            }
        }
    }

    private _onKeyUp = (e: React.SyntheticEvent<any>): void => {
        const keyEvent = EventHelpers.toKeyboardEvent(e);
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

    getImportantForAccessibility(): ImportantForAccessibilityValue | undefined {
        // Focus Manager may override this
        // We force a default of YES if no property is provided, consistent with the base class
        return AccessibilityUtil.importantForAccessibilityToString(this.props.importantForAccessibility,
            Types.ImportantForAccessibility.Yes);
    }

    updateNativeAccessibilityProps(): void {
        if (this._buttonElement) {
            const tabIndex: number | undefined = this.getTabIndex();
            const windowsTabFocusable: boolean = !this.props.disabled && tabIndex !== undefined && tabIndex >= 0;
            const importantForAccessibility: ImportantForAccessibilityValue | undefined = this.getImportantForAccessibility();

            this._buttonElement.setNativeProps({
                tabIndex: tabIndex,
                isTabStop: windowsTabFocusable,
                importantForAccessibility: importantForAccessibility
            });
        }
    }
}

applyFocusableComponentMixin(Button);

export default Button;
