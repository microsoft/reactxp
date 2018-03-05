/**
* Link.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Link abstraction.
*/

import React = require('react');
import RN = require('react-native');

import EventHelpers from './utils/EventHelpers';
import Linking from '../native-common/Linking';
import RX = require('../common/Interfaces');
import Types = require('../common/Types');

export class Link extends React.Component<Types.LinkProps, {}> {
    protected _mountedComponent: RN.ReactNativeBaseComponent<any, any>|null = null;

    // To be able to use Link inside TouchableHighlight/TouchableOpacity
    public setNativeProps(nativeProps: RN.TextProps) {
        if (this._mountedComponent) {
            this._mountedComponent.setNativeProps(nativeProps);
        }
    }

    render() {
        let internalProps: RN.TextProps = {
            ref: this._onMount,
            style: this.props.style,
            numberOfLines: this.props.numberOfLines === 0 ? undefined : this.props.numberOfLines,
            onPress: this._onPress,
            onLongPress: this._onLongPress,
            allowFontScaling: this.props.allowFontScaling,
            maxContentSizeMultiplier: this.props.maxContentSizeMultiplier,
            children: this.props.children
        };

        return this._render(internalProps);
    }

    protected _render(internalProps: RN.TextProps) {
        return (
            <RN.Text
                { ...internalProps }
            />
        );
    }

    protected _onMount = (component: RN.ReactNativeBaseComponent<any, any>|null) => {
        this._mountedComponent = component;
    }

    protected _onPress = (e: RX.Types.SyntheticEvent) => {
        if (EventHelpers.isRightMouseButton(e)) {
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
        if (!EventHelpers.isRightMouseButton(e) && this.props.onLongPress) {
            this.props.onLongPress(EventHelpers.toMouseEvent(e), this.props.url);
        }
    }
}

export default Link;
