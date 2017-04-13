/**
* Text.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Text abstraction.
*/

import React = require('react');
import RN = require('react-native');

import AccessibilityUtil from './AccessibilityUtil';
import RX = require('../common/Interfaces');
import Styles from './Styles';
import Types = require('../common/Types');

const _styles = {
    defaultText: Styles.createTextStyle({
        overflow: 'hidden'
    })
};

export class Text extends RX.Text<{}> {
    // To be able to use Text inside TouchableHighlight/TouchableOpacity
    public setNativeProps(nativeProps: RN.TextProps) {
        (this.refs['nativeText'] as any).setNativeProps(nativeProps);
    }

    render() {
        const importantForAccessibility = AccessibilityUtil.importantForAccessibilityToString(this.props.importantForAccessibility);
        return (
            <RN.Text
                style={ this._getStyles() }
                ref='nativeText'
                importantForAccessibility={ importantForAccessibility }
                numberOfLines={ this.props.numberOfLines }
                allowFontScaling={ this.props.allowFontScaling }
                onPress={ this.props.onPress }
                selectable={ this.props.selectable }
                textBreakStrategy={ 'simple' }
                ellipsizeMode={ this.props.ellipsizeMode }
                elevation={ this.props.elevation }
            >
                { this.props.children }
            </RN.Text>
        );
    }

    protected _getStyles(): Types.TextStyleRuleSet {
        return Styles.combine(_styles.defaultText, this.props.style);
    }

    focus() {
        // No-op
    }

    blur() {
        // No-op
    }
}

export default Text;
