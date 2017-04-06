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

import Linking from '../native-common/Linking';
import RX = require('../common/Interfaces');

export class Link extends RX.Link<{}> {
    // To be able to use Link inside TouchableHighlight/TouchableOpacity
    public setNativeProps(nativeProps: RN.TextProps) {
        (this.refs['nativeLink'] as any).setNativeProps(nativeProps);
    }

    render() {
        return (
            <RN.Text
                style={ this.props.style }
                ref='nativeLink'
                numberOfLines={ this.props.numberOfLines === 0 ? null : this.props.numberOfLines }
                onPress={ this._onPress }
            >
                { this.props.children }
            </RN.Text>
        );
    }

    private _onPress = () => {
        if (this.props.onPress) {
            this.props.onPress();
            return;
        }

        // The default action is to launch a browser.
        if (this.props.url) {
            Linking.openUrl(this.props.url);
        }
    };
}

export default Link;
