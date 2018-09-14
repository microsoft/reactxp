/**
 * Text.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Text abstraction.
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as RN from 'react-native';

import { compact } from './utils/lodashMini';
import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import { Types } from '../common/Interfaces';
import AccessibilityUtil from './AccessibilityUtil';
import EventHelpers from './utils/EventHelpers';
import Styles from './Styles';

const _styles = {
    defaultText: Styles.createTextStyle({
        overflow: 'hidden'
    })
};

export interface TextContext {
    isRxParentAText: boolean;
    focusArbitrator?: FocusArbitratorProvider;
    isRxParentAContextMenuResponder?: boolean;
}

export class Text extends React.Component<Types.TextProps, Types.Stateless> implements React.ChildContextProvider<TextContext> {
    static contextTypes: React.ValidationMap<any> = {
        focusArbitrator: PropTypes.object,
        isRxParentAContextMenuResponder: PropTypes.bool
    };

    context!: TextContext;

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

        // The presence of an onContextMenu on this instance or on the first responder parent up the tree
        // should disable any system provided context menu
        const disableContextMenu = !!this.props.onContextMenu || !!this.context.isRxParentAContextMenuResponder;

        const extendedProps: RN.ExtendedTextProps = {
            maxContentSizeMultiplier: this.props.maxContentSizeMultiplier,
            disableContextMenu: disableContextMenu
        };

        return (
            <RN.Text
                style={ this._getStyles() as RN.StyleProp<RN.TextStyle> }
                ref={ this._onMount as any }
                importantForAccessibility={ importantForAccessibility }
                numberOfLines={ this.props.numberOfLines }
                allowFontScaling={ this.props.allowFontScaling }
                onPress={ onPress }
                selectable={ this.props.selectable }
                textBreakStrategy={ 'simple' }
                ellipsizeMode={ this.props.ellipsizeMode }
                testID={ this.props.testId }
                { ...extendedProps }
            >
                { this.props.children }
            </RN.Text>
        );
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            this.requestFocus();
        }
    }

    protected _onMount = (component: any) => {
        this._mountedComponent = component;
    }

    protected _onPress = (e: RN.GestureResponderEvent) => {
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
        return compact([_styles.defaultText, this.props.style]);
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

    getSelectedText(): string {
        return ''; // Implemented for 'windows' only (requires support from RN).
    }
}

export default Text;
