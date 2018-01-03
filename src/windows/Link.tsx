/**
* Link.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN Desktop-specific implementation of the cross-platform Link abstraction.
*/

import React = require('react');
import RNW = require('react-native-windows');
import {applyFocusableComponentMixin, FocusManagerFocusableComponent} from '../native-desktop/utils/FocusManager';
import PropTypes = require('prop-types');

import EventHelpers from '../native-common/utils/EventHelpers';
import {Link as LinkCommon } from '../native-common/Link';

const KEY_CODE_ENTER = 13;
const KEY_CODE_SPACE = 32;

const DOWN_KEYCODES = [KEY_CODE_SPACE, KEY_CODE_ENTER];
const UP_KEYCODES = [KEY_CODE_SPACE];

export interface LinkContext {
    isRxParentAText?: boolean;
}

// Simple check for the presence of the updated React Native for Windows
const HasFocusableWindows = (RNW.FocusableWindows !== undefined);

export class Link extends LinkCommon implements FocusManagerFocusableComponent {
    static contextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool,
    };
    context: LinkContext;

    private _focusableElement : RNW.FocusableWindows | null = null;

    private _onFocusableRef = (btn: RNW.FocusableWindows | null): void => {
        this._focusableElement = btn;
    }

    render() {

        // Fallback to native-common fast if the keyboard enabled component is not available
        if (!HasFocusableWindows) {
            return super.render();
        }

        let content: JSX.Element = super.render();

        // The "in text parent" case requires a special nyi control.
        if (this.context && !this.context.isRxParentAText) {

            let tabIndex: number | undefined = this.getTabIndex();
            let windowsTabFocusable: boolean =  tabIndex !== undefined && tabIndex >= 0;

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
            };

            content = (
                <RNW.FocusableWindows
                    {...focusableViewProps}
                >
                    {content}
                </RNW.FocusableWindows>
            );
        }

        return content;
    }

    focus() {
        if (this._focusableElement &&
            this._focusableElement.focus) {
                this._focusableElement.focus();
        }
    }

    blur() {
        if (this._focusableElement &&
            this._focusableElement.blur) {
                this._focusableElement.blur();
        }
    }

    private _onKeyDown = (e: React.SyntheticEvent<any>): void => {
        if (this.props.onPress) {
            let keyEvent = EventHelpers.toKeyboardEvent(e);
            let key = keyEvent.keyCode;
            // ENTER triggers press on key down
            if (key === KEY_CODE_ENTER) {
                // Defer to base class
                this._onPress(keyEvent);
            }
        }
    }

    private _onKeyUp = (e: React.SyntheticEvent<any>): void => {
        if (this.props.onPress) {
            let keyEvent = EventHelpers.toKeyboardEvent(e);
            if (keyEvent.keyCode === KEY_CODE_SPACE) {
                 // Defer to base class
                this._onPress(keyEvent);
            }
        }
    }

    private _onFocus = (e: React.SyntheticEvent<any>): void => {
        this.onFocus();
    }

    // From FocusManagerFocusableComponent interface
    //
    onFocus() {
        // Focus Manager hook
    }

    getTabIndex(): number | undefined {
        // Focus Manager may override this
        return 0;
    }

    updateNativeTabIndex(): void {
        if (this._focusableElement) {
            let tabIndex: number | undefined = this.getTabIndex();
            let windowsTabFocusable: boolean = tabIndex !== undefined && tabIndex >= 0;

            this._focusableElement.setNativeProps({
                tabIndex: tabIndex,
                isTabStop: windowsTabFocusable
            });
        }
    }
}

applyFocusableComponentMixin(Link);

export default Link;
