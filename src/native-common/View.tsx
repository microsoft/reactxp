/**
* View.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform View abstraction.
*/

import _ = require('./lodashMini');

import React = require('react');
import RN = require('react-native');

import AccessibilityUtil from './AccessibilityUtil';

import AnimateListEdits from './listAnimations/AnimateListEdits';
import Button from './Button';
import Types = require('../common/Types');
import ViewBase from './ViewBase';

export class View extends ViewBase<Types.ViewProps, {}> {
    private _internalProps: any = {};

    constructor(props: Types.ViewProps) {
        super(props);

        this._buildInternalProps(props);
    }

    componentWillReceiveProps(nextProps: Types.ViewProps) {
        this._buildInternalProps(nextProps);
    }

    /**
     * Attention:
     * be careful with setting any non layout properties unconditionally in this method to any value
     * as on android that would lead to extra layers of Views.
     */
    private _buildInternalProps(props: Types.ViewProps) {
        this._internalProps = _.clone(props) as any;
        this._internalProps.style = this._getStyles(props);
        this._internalProps.ref = this._setNativeView;

        const importantForAccessibility = AccessibilityUtil.importantForAccessibilityToString(props.importantForAccessibility);
        const accessibilityLabel = props.accessibilityLabel || props.title;
        // Set accessibility props on Native only if we have valid importantForAccessibility value or accessibility label or
        // if this view is not a button.
        // For a button, we let the Button component compute its own accessibility props.
        const shouldSetAccessibilityProps = this._internalProps && !this._isButton(props) &&
            !!(importantForAccessibility || accessibilityLabel);

        if (shouldSetAccessibilityProps) {
            this._internalProps.importantForAccessibility = importantForAccessibility;
            this._internalProps.accessibilityLabel = accessibilityLabel;
            this._internalProps.accessibilityTraits = AccessibilityUtil.accessibilityTraitToString(props.accessibilityTraits);
            this._internalProps.accessibilityComponentType = AccessibilityUtil.accessibilityComponentTypeToString(
                props.accessibilityTraits);
        }

        if (props.onLayout) {
            this._internalProps.onLayout = this._onLayout;
        }

        if (this.props.blockPointerEvents) {
            this._internalProps.pointerEvents = 'none';
        } else {
            if (this.props.ignorePointerEvents) {
                this._internalProps.pointerEvents = 'box-none';
            }
        }
    }

    private _isButton (viewProps: Types.ViewProps): boolean {
        return !!(viewProps.onPress || viewProps.onLongPress);
    }

    render() {
        if (this.props.animateChildEnter || this.props.animateChildMove || this.props.animateChildLeave) {
            return (
                <AnimateListEdits { ...this._internalProps }>
                    { this.props.children }
                </AnimateListEdits>
            );
        } else if (this._isButton(this.props)) {
            return (
                <Button { ...this._internalProps }>
                    { this.props.children }
                </Button>
            );
        } else {
            return (
                <RN.View { ...this._internalProps }>
                    { this.props.children }
                </RN.View>
            );
        }
    }
}

export default View;
