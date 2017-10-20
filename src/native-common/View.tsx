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

        // Translate accessibilityProps from RX to RN, there are type diferrences for example:
        // accessibilityLiveRegion prop is number (RX.Types.AccessibilityLiveRegion) in RX, but
        // string is expected by RN.View.
        const accessibilityProps = {
            importantForAccessibility: AccessibilityUtil.importantForAccessibilityToString(props.importantForAccessibility),
            accessibilityLabel: props.accessibilityLabel || props.title,
            accessibilityTraits: AccessibilityUtil.accessibilityTraitToString(props.accessibilityTraits),
            accessibilityComponentType: AccessibilityUtil.accessibilityComponentTypeToString(props.accessibilityTraits),
            accessibilityLiveRegion: AccessibilityUtil.accessibilityLiveRegionToString(props.accessibilityLiveRegion),
        };

        // Don't merge accessibilityProps for Button, which translates them for RN on it's own.
        if (!this._isButton(props)) {
            this._internalProps = _.extend(this._internalProps, accessibilityProps);
        }

        if (props.onLayout) {
            this._internalProps.onLayout = this._onLayout;
        }

        if (props.blockPointerEvents) {
            this._internalProps.pointerEvents = 'none';
        } else {
            if (props.ignorePointerEvents) {
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

    focus() {
        AccessibilityUtil.setAccessibilityFocus(this);
    }

    setFocusRestricted(restricted: boolean) {
        // Nothing to do.
    }

    setFocusLimited(limited: boolean) {
        // Nothing to do.
    }
}

export default View;
