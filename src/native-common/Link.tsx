/**
* Link.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Link abstraction.
*/

import PropTypes = require('prop-types');
import React = require('react');
import RN = require('react-native');

import AccessibilityUtil from './AccessibilityUtil';
import EventHelpers from './utils/EventHelpers';
import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import Linking from '../native-common/Linking';
import RX = require('../common/Interfaces');
import Types = require('../common/Types');

export interface LinkContext {
    focusArbitrator?: FocusArbitratorProvider;
    isRxParentAText?: boolean;
}

export class LinkBase<S> extends React.Component<Types.LinkProps, S> {
    static contextTypes = {
        focusArbitrator: PropTypes.object,
        isRxParentAText: PropTypes.bool
    };

    context!: LinkContext;

    protected _mountedComponent: RN.ReactNativeBaseComponent<any, any>|null = null;

    // To be able to use Link inside TouchableHighlight/TouchableOpacity
    public setNativeProps(nativeProps: RN.TextProps) {
        if (this._mountedComponent) {
            this._mountedComponent.setNativeProps(nativeProps);
        }
    }

    render() {
        let internalProps: RN.ExtendedTextProps = {
            style: this.props.style,
            numberOfLines: this.props.numberOfLines === 0 ? undefined : this.props.numberOfLines,
            onPress: this._onPress,
            onLongPress: this._onLongPress,
            allowFontScaling: this.props.allowFontScaling,
            maxContentSizeMultiplier: this.props.maxContentSizeMultiplier,
            children: this.props.children,
            tooltip: this.props.title
        } as RN.ExtendedTextProps;

        return this._render(internalProps, this._onMount);
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    }

    protected _render(internalProps: RN.TextProps, onMount: (text: any) => void) {
        return (
            <RN.Text { ...internalProps } ref={ onMount }/>
        );
    }

    protected _onMount = (component: any) => {
        this._mountedComponent = component;
    }

    protected _onPress = (e: RX.Types.SyntheticEvent) => {
        if (EventHelpers.isRightMouseButton(e)) {
            if (this.props.onContextMenu) {
                this.props.onContextMenu(EventHelpers.toMouseEvent(e));
            }
            return;
        }

        if (this.props.onPress) {
            this.props.onPress(EventHelpers.toMouseEvent(e), this.props.url);
            return;
        }

        // The default action is to launch a browser.
        if (this.props.url) {
            Linking.openUrl(this.props.url).catch(err => {
                // Catch the exception so it doesn't propagate.
            });
        }
    }

    protected _onLongPress = (e: RX.Types.SyntheticEvent) => {
        // Right mouse button doesn't change behavior based on press length.
        if (EventHelpers.isRightMouseButton(e)) {
            if (this.props.onContextMenu) {
                this.props.onContextMenu(EventHelpers.toMouseEvent(e));
            }
            return;
        }

        if (!EventHelpers.isRightMouseButton(e) && this.props.onLongPress) {
            this.props.onLongPress(EventHelpers.toMouseEvent(e), this.props.url);
        }
    }

    requestFocus() {
        FocusArbitratorProvider.requestFocus(
            this,
            () => this.focus(),
            () => !!this._mountedComponent
        );
    }

    focus() {
        if (this._mountedComponent) {
            AccessibilityUtil.setAccessibilityFocus(this);
        }
    }

    blur() {
        // No-op
    }
}

export class Link extends LinkBase<{}> {

}

export default Link;
