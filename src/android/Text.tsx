/**
* Text.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific implementation of Text component.
*/

import React = require('react');
import RN = require('react-native');

import AccessibilityUtil from './AccessibilityUtil';
import { Text as CommonText } from '../native-common/Text';
import Types = require('../common/Types');
import Styles from '../native-common/Styles';

var _styles = {
    defaultText: Styles.createTextStyle({
        includeFontPadding: false,
        textAlignVertical: 'center'
    })
};

export class Text extends CommonText {
    protected _getStyles(): Types.TextStyleRuleSet {
        return Styles.combine(_styles.defaultText, this.props.style);
    }

    // We override the render method to work around a couple of Android-specific
    // bugs in RN. First, numberOfLines needs to be set to null rather than 0 to
    // indicate an unbounded number of lines. Second, ellipsizeMode needs to be set
    // to null to indicate the default behavior.
    render() {
        const importantForAccessibility = AccessibilityUtil.importantForAccessibilityToString(this.props.importantForAccessibility);
        return (
            <RN.Text
                style={ this._getStyles() }
                ref='nativeText'
                importantForAccessibility={ importantForAccessibility }
                numberOfLines={ this.props.numberOfLines === 0 ? null : this.props.numberOfLines }
                allowFontScaling={ this.props.allowFontScaling }
                ellipsizeMode={ this.props.ellipsizeMode }
                onPress={ this.props.onPress }
                textBreakStrategy={ this.props.textBreakStrategy }
            >
                { this.props.children }
            </RN.Text>
        );
    }

    focus() {
        AccessibilityUtil.setAccessibilityFocus(this);
    }
}

export default Text;
