/**
* Link.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN Desktop-specific implementation of the cross-platform Link abstraction.
*/

import React = require('react');
import RN = require('react-native');
import RNW = require('react-native-windows');
import { applyFocusableComponentMixin, FocusManagerFocusableComponent } from '../native-desktop/utils/FocusManager';
import PropTypes = require('prop-types');

import EventHelpers from '../native-common/utils/EventHelpers';
import { Link as LinkCommon } from '../native-common/Link';

const KEY_CODE_ENTER = 13;
const KEY_CODE_SPACE = 32;

const DOWN_KEYCODES = [KEY_CODE_SPACE, KEY_CODE_ENTER];
const UP_KEYCODES = [KEY_CODE_SPACE];

export interface LinkContext {
    isRxParentAText?: boolean;
}

let FocusableText = RNW.createFocusableComponent(RN.Text);

export class Link extends LinkCommon implements FocusManagerFocusableComponent {
    static contextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool
    };

    // Will be assiged by super - just re-typing here
    context!: LinkContext;

    protected _render(internalProps: RN.TextProps) {
        if (this.context && !this.context.isRxParentAText) {
            return this._renderLinkAsFocusableText(internalProps);
        } else if (RNW.HyperlinkWindows) {
            return this._renderLinkAsNativeHyperlink(internalProps);
        } else {
            return super._render(internalProps);
        }
    }

    private _renderLinkAsFocusableText(internalProps: RN.TextProps) {
        let focusableTextProps = this._createFocusableTextProps(internalProps);
        return (
            <FocusableText
                { ...focusableTextProps }
            />
        );    
    }

    private _focusableElement : RNW.FocusableWindows<RN.TextProps> | null = null;

    private _onFocusableRef = (btn: RNW.FocusableWindows<RN.TextProps> | null): void => {
        this._focusableElement = btn;
    }

    private _createFocusableTextProps(internalProps: RN.TextProps) {
        let tabIndex: number | undefined = this.getTabIndex();
        let windowsTabFocusable: boolean =  tabIndex !== undefined && tabIndex >= 0;

        // We don't use 'string' ref type inside ReactXP
        let originalRef = internalProps.ref;
        if (typeof originalRef === 'string') {
            throw new Error('Link: ReactXP must not use string refs internally');
        }
        let componentRef: Function = originalRef as Function;

        let focusableTextProps: RNW.FocusableWindowsProps<RN.TextProps> = {
            ...internalProps,
            componentRef: componentRef,
            ref: this._onFocusableRef,
            isTabStop: windowsTabFocusable,
            tabIndex: tabIndex,
            disableSystemFocusVisuals: false,
            handledKeyDownKeys: DOWN_KEYCODES,
            handledKeyUpKeys: UP_KEYCODES,
            onKeyDown: this._onKeyDown,
            onKeyUp: this._onKeyUp,
            onFocus: this._onFocus,
            onAccessibilityTap: this._onPress
        };
        
        return focusableTextProps;
    }

    private _nativeHyperlinkElement : RNW.HyperlinkWindows | null = null;

    private _onNativeHyperlinkRef = (ref: RNW.HyperlinkWindows | null): void => {
        this._nativeHyperlinkElement = ref;
    }

    private _renderLinkAsNativeHyperlink(internalProps: RN.TextProps) {

        // We don't use 'string' ref type inside ReactXP
        let originalRef = internalProps.ref;
        if (typeof originalRef === 'string') {
            throw new Error('Link: ReactXP must not use string refs internally');
        }

        return (
            <RNW.HyperlinkWindows
                { ...internalProps }
                ref={this._onNativeHyperlinkRef}
                onFocus={this._onFocus}
            />
        );
    }

    focus() {
        if (this._focusableElement && this._focusableElement.focus) {
            this._focusableElement.focus();
        } else if (this._nativeHyperlinkElement && this._nativeHyperlinkElement.focus) {
            this._nativeHyperlinkElement.focus();
        }
    }

    blur() {
        if (this._focusableElement && this._focusableElement.blur) {
            this._focusableElement.blur();
        } else if (this._nativeHyperlinkElement && this._nativeHyperlinkElement.blur) {
            this._nativeHyperlinkElement.blur();
        }
    }

    setNativeProps(nativeProps: RN.TextProps) {
        // Redirect to focusable component if present.
        if (this._focusableElement) {
            this._focusableElement.setNativeProps(nativeProps);
        } else {
            super.setNativeProps(nativeProps);
        }
    }

    private _onKeyDown = (e: React.SyntheticEvent<any>): void => {
        let keyEvent = EventHelpers.toKeyboardEvent(e);
        let key = keyEvent.keyCode;
        // ENTER triggers press on key down
        if (key === KEY_CODE_ENTER) {
            // Defer to base class
            this._onPress(keyEvent);
        }
    }

    private _onKeyUp = (e: React.SyntheticEvent<any>): void => {
        let keyEvent = EventHelpers.toKeyboardEvent(e);
        if (keyEvent.keyCode === KEY_CODE_SPACE) {
            // Defer to base class
            this._onPress(keyEvent);
        }
    }

    private _onFocus = (e: React.SyntheticEvent<any>): void => {
        if (e.currentTarget === e.target) {
            this.onFocus();
        }
    }

    // From FocusManagerFocusableComponent interface
    //
    onFocus() {
        // Focus Manager hook
    }

    getTabIndex(): number | undefined {
        // Link defaults to a tabIndex of 0
        // Focus Manager may override this
        return this.props.tabIndex || 0;
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
