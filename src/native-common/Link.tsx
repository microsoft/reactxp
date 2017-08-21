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
import Types = require('../common/Types');

export class Link extends React.Component<Types.LinkProps, {}> {
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
                onLongPress={ this._onLongPress }
                allowFontScaling={ this.props.allowFontScaling }
                maxContentSizeMultiplier={ this.props.maxContentSizeMultiplier }
            >
                { this.props.children }
            </RN.Text>
        );
    }

    private _onPress = (e: RX.Types.SyntheticEvent) => {
        if (this.props.onPress) {
            this.props.onPress(e, this.props.url);
            return;
        }

        // The default action is to launch a browser.
        if (this.props.url) {
            Linking.openUrl(this.props.url).catch(err => {
                // Catch the exception so it doesn't propagate.
            });
        }
    }

    private _onLongPress = (e: RX.Types.SyntheticEvent) => {
        if (this.props.onLongPress) {
            this.props.onLongPress(e, this.props.url);
        }
    }    
}

export default Link;
