/**
* Text.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Text abstraction.
*/

import _ = require('./lodashMini');
import PropTypes = require('prop-types');
import React = require('react');
import RN = require('react-native');

import AccessibilityUtil from './AccessibilityUtil';
import Styles from './Styles';
import Types = require('../common/Types');

const _styles = {
    defaultText: Styles.createTextStyle({
        overflow: 'hidden'
    })
};

export interface TextContext {
    isRxParentAText?: boolean;
}

export class Text extends React.Component<Types.TextProps, {}> implements React.ChildContextProvider<TextContext> {
    static childContextTypes: React.ValidationMap<any> = {
        isRxParentAText: PropTypes.bool.isRequired,
    };
    protected _mountedComponent: RN.ReactNativeBaseComponent<any, any>|null = null;

    // To be able to use Text inside TouchableHighlight/TouchableOpacity
    public setNativeProps(nativeProps: RN.TextProps) {
        if (this._mountedComponent) {
            this._mountedComponent.setNativeProps(nativeProps);
        }
    }

    render() {
        const importantForAccessibility = AccessibilityUtil.importantForAccessibilityToString(this.props.importantForAccessibility);
        return (
            <RN.Text
                style={ this._getStyles() }
                ref={ this._onMount }
                importantForAccessibility={ importantForAccessibility }
                numberOfLines={ this.props.numberOfLines }
                allowFontScaling={ this.props.allowFontScaling }
                maxContentSizeMultiplier={ this.props.maxContentSizeMultiplier }
                onPress={ this.props.onPress }
                selectable={ this.props.selectable }
                textBreakStrategy={ 'simple' }
                ellipsizeMode={ this.props.ellipsizeMode }
            >
                { this.props.children }
            </RN.Text>
        );
    }

    protected _onMount = (component: RN.ReactNativeBaseComponent<any, any>|null) => {
        this._mountedComponent = component;
    }

    getChildContext() {
        // Let descendant RX components know that their nearest RX ancestor is an RX.Text.
        // Because they're in an RX.Text, they should style themselves specially for appearing
        // inline with text.
        return { isRxParentAText: true };
    }

    protected _getStyles(): Types.StyleRuleSetRecursiveArray<Types.TextStyleRuleSet> {
        return _.compact([_styles.defaultText, this.props.style]);
    }

    focus() {
        AccessibilityUtil.setAccessibilityFocus(this);
    }

    blur() {
        // No-op
    }
}

export default Text;
