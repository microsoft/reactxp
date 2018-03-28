/**
* RootView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* The top-most view that's used for proper layering or modals and popups.
*/

import React = require('react');
import RN = require('react-native');
import PropTypes = require('prop-types');

import { RootView as RootViewBase, RootViewUsingProps as RootViewUsingPropsBase,
    BaseRootViewProps, RootViewPropsWithMainViewType, RootViewState, BaseRootView } from '../native-common/RootView';
import Input from './Input';
import UserInterface from './UserInterface';
import EventHelpers from '../native-common/utils/EventHelpers';
import FocusManager from './utils/FocusManager';
import FrontLayerViewManager from '../native-common/FrontLayerViewManager';

type SyntheticEvent = React.SyntheticEvent<any>;

const KEY_CODE_TAB = 9;
const KEY_CODE_ESC = 27;

const styles = RN.StyleSheet.create({
    appWrapper: {
      flex: 1
    }
  });

//
// Mixin with keyboard management behaviors. It enhances the two RootView flavors by adding:
// 1. Support for maintaining UserInterface.keyboardNavigationEvent
//   React Native doesn't offer a convenient mechanism to peek into keyboard/mouse events globally (the way
// addEventListener achieves in the Web counterpart), so we rely on a spying view we render.
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
        _isNavigatingWithKeyboard: boolean = false;
        _isNavigatingWithKeyboardUpateTimer: number | undefined;

        constructor(...args: any[]) {
            super(...args);
            // Initialize the root FocusManager which is aware of all
            // focusable elements.
            this._focusManager = new FocusManager(undefined);
        }

        _onTouchStartCapture = (e: SyntheticEvent) => {
            this._updateKeyboardNavigationState(false);
        }

        _onKeyDownCapture = (e: SyntheticEvent) => {
            let kbdEvent = EventHelpers.toKeyboardEvent(e);
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

                this._isNavigatingWithKeyboardUpateTimer = setTimeout(() => {
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

            if (this._isNavigatingWithKeyboard !== isNavigatingWithKeyboard) {
                this._isNavigatingWithKeyboard = isNavigatingWithKeyboard;

                UserInterface.keyboardNavigationEvent.fire(isNavigatingWithKeyboard);
            }
        }

        _onKeyDown = (e: SyntheticEvent) => {
            let kbdEvent = EventHelpers.toKeyboardEvent(e);
            Input.dispatchKeyDown(kbdEvent);
        }

        _onKeyUp = (e: SyntheticEvent) => {
            let kbdEvent = EventHelpers.toKeyboardEvent(e);

            let activePopupId = FrontLayerViewManager.getActivePopupId();
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

        render() {
            let content = super.render();

            // Using "any" since onKeyDown/onKeyUp/etc. are not defined at RN.View property level
            // Yet the handlers are called as part of capturing/bubbling events for/from children.
            let internalProps: any = {
                onKeyDown: this._onKeyDown,
                onKeyDownCapture: this._onKeyDownCapture,
                onKeyUp: this._onKeyUp,
                onTouchStartCapture: this._onTouchStartCapture
            };

            return (
                <RN.View 
                    { ...internalProps }
                    style={ styles.appWrapper }
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
