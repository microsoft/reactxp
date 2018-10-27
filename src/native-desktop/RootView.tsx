/**
 * RootView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * The top-most view that's used for proper layering or modals and popups.
 */

// tslint:disable:function-name

import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as RN from 'react-native';

import EventHelpers from '../native-common/utils/EventHelpers';
import FocusManager from './utils/FocusManager';
import FrontLayerViewManager from '../native-common/FrontLayerViewManager';
import Input from './Input';
import {
    BaseRootView,
    BaseRootViewProps,
    RootView as RootViewBase,
    RootViewPropsWithMainViewType,
    RootViewState,
    RootViewUsingProps as RootViewUsingPropsBase
} from '../native-common/RootView';
import Timers from '../common/utils/Timers';
import UserInterface from '../native-common/UserInterface';

const KEY_CODE_TAB = 9;
const KEY_CODE_ESC = 27;

const _styles = RN.StyleSheet.create({
    appWrapperStyle : {
        flex: 1
    }
});

//
// Mixin with keyboard management behaviors. It enhances the two RootView flavors by adding:
// 1. Support for maintaining UserInterface.keyboardNavigationEvent
//   React Native doesn't offer a convenient mechanism to peek into keyboard/mouse events globally (the way
// addEventListener achieves in the Web counterpart), so we rely on a spying view we render and/or more custom mechanisms.
// 2. Redirection to Input.ts
// 3. A place for the root FocusManager
type Constructor<T extends React.Component> = new (...args: any[]) => T;

function applyDesktopBehaviorMixin<TRootViewBase extends Constructor<React.Component>>(RootViewBase: TRootViewBase) {
    return class RootView extends RootViewBase implements React.ChildContextProvider<any> {
        static childContextTypes: React.ValidationMap<any> = {
            focusManager: PropTypes.object
        };

        _focusManager: FocusManager;
        _keyboardHandlerInstalled = false;
        _isNavigatingWithKeyboardUpateTimer: number | undefined;

        constructor(...args: any[]) {
            super(...args);
            // Initialize the root FocusManager which is aware of all
            // focusable elements.
            this._focusManager = new FocusManager(undefined);
        }

        _onTouchStartCapture = (e: RN.NativeSyntheticEvent<any>) => {
            this._updateKeyboardNavigationState(false);
        }

        _onKeyDownCapture = (e: RN.NativeSyntheticEvent<any>) => {
            const kbdEvent = EventHelpers.toKeyboardEvent(e);
            if (kbdEvent.keyCode === KEY_CODE_TAB) {
                this._updateKeyboardNavigationState(true);
            }

            if (kbdEvent.keyCode === KEY_CODE_ESC) {
                // If Esc is pressed and the focused element stays the same after some time,
                // switch the keyboard navigation off to dismiss the outline.
                const activeComponent = FocusManager.getCurrentFocusedComponent();

                if (this._isNavigatingWithKeyboardUpateTimer) {
                    clearTimeout(this._isNavigatingWithKeyboardUpateTimer);
                }

                this._isNavigatingWithKeyboardUpateTimer = Timers.setTimeout(() => {
                    this._isNavigatingWithKeyboardUpateTimer = undefined;

                    if (activeComponent === FocusManager.getCurrentFocusedComponent()) {
                        this._updateKeyboardNavigationState(false);
                    }
                }, 500);
            }
        }

        _updateKeyboardNavigationState(isNavigatingWithKeyboard: boolean) {
            if (this._isNavigatingWithKeyboardUpateTimer) {
                clearTimeout(this._isNavigatingWithKeyboardUpateTimer);
                this._isNavigatingWithKeyboardUpateTimer = undefined;
            }

            if (UserInterface.isNavigatingWithKeyboard() !== isNavigatingWithKeyboard) {
                UserInterface.keyboardNavigationEvent.fire(isNavigatingWithKeyboard);
            }
        }

        _onKeyDown = (e: RN.NativeSyntheticEvent<any>) => {
            const kbdEvent = EventHelpers.toKeyboardEvent(e);
            Input.dispatchKeyDown(kbdEvent);
        }

        _onKeyPress = (e: RN.NativeSyntheticEvent<any>) => {
            const kbdEvent = EventHelpers.toKeyboardEvent(e);
            // This is temporary fix while we still have both keyPress and keyDown
            // events bubbling up for the same situation of user pressing down a key.
            // TODO: consolidate key events #602
            Input.dispatchKeyDown(kbdEvent);
        }

        _onKeyUp = (e: RN.NativeSyntheticEvent<any>) => {
            const kbdEvent = EventHelpers.toKeyboardEvent(e);

            const activePopupId = FrontLayerViewManager.getActivePopupId();
            if (activePopupId && (kbdEvent.keyCode === KEY_CODE_ESC)) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                FrontLayerViewManager.dismissPopup(activePopupId);
                return;
            }

            Input.dispatchKeyUp(kbdEvent);
        }

        getChildContext() {
            // Provide the context with root FocusManager to all descendants.
            return {
                focusManager: this._focusManager
            };
        }

        renderTopView(content: JSX.Element) : JSX.Element {
            //
            // As a default implementation we use a regular RN.View to intercept keyboard/touches.
            // this is not perfect since the keyboard events are not standardized in RN.
            // Per platform specializations may provide a better way
            //

            // Using "any" since onKeyDown/onKeyUp/etc. are not defined at RN.View property level
            // Yet the handlers are called as part of capturing/bubbling events for/from children.
            const internalProps: any = {
                onKeyDown: this._onKeyDown,
                onKeyPress: this._onKeyPress,
                onKeyDownCapture: this._onKeyDownCapture,
                onKeyUp: this._onKeyUp,
                onTouchStartCapture: this._onTouchStartCapture,
                collapsable: false
            };

            return  (
                <RN.View
                    { ...internalProps }
                     style={ _styles.appWrapperStyle }
                >
                    { content }
                </RN.View>
            );
        }
    };
}

const RootViewUsingStore = applyDesktopBehaviorMixin(RootViewBase);
const RootViewUsingProps = applyDesktopBehaviorMixin(RootViewUsingPropsBase);

export {
    BaseRootViewProps,
    RootViewPropsWithMainViewType,
    RootViewState,
    BaseRootView,
    RootViewUsingStore as RootView,
    RootViewUsingProps
};

export default RootViewUsingStore;
