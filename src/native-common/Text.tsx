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
import { requestFocus } from '../common/utils/AutoFocusHelper';
import EventHelpers from './utils/EventHelpers';
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

        // The presence of any of the onPress or onContextMenu makes the RN.Text a potential touch responder
        const onPress = (this.props.onPress || this.props.onContextMenu) ? this._onPress : undefined;

        return (
            <RN.Text
                style={ this._getStyles() }
                ref={ this._onMount }
                importantForAccessibility={ importantForAccessibility }
                numberOfLines={ this.props.numberOfLines }
                allowFontScaling={ this.props.allowFontScaling }
                maxContentSizeMultiplier={ this.props.maxContentSizeMultiplier }
                onPress={ onPress }
                selectable={ this.props.selectable }
                textBreakStrategy={ 'simple' }
                ellipsizeMode={ this.props.ellipsizeMode }
            >
                { this.props.children }
            </RN.Text>
        );
    }

    componentDidMount() {
        const autoFocus = this.props.autoFocus;
        if (autoFocus) {
            requestFocus(autoFocus.id, this, autoFocus.focus || (() => { if (this._mountedComponent) { this.focus(); } }));
        }
    }

    protected _onMount = (component: RN.ReactNativeBaseComponent<any, any>|null) => {
        this._mountedComponent = component;
    }

    private _onPress = (e: RN.SyntheticEvent<any>) => {
        if (EventHelpers.isRightMouseButton(e)) {
            if (this.props.onContextMenu) {
                this.props.onContextMenu(EventHelpers.toMouseEvent(e));
            }
        } else {
            if (this.props.onPress) {
                this.props.onPress(EventHelpers.toMouseEvent(e));
            }
        }
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
