/**
 * GestureView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform GestureView component.
 * It provides much of the standard work necessary to support combinations of
 * pinch-and-zoom, panning, single tap and double tap gestures.
 */

import * as React from 'react';
import * as RN from 'react-native';

import App from '../native-common/App';
import GestureViewCommon from '../common/GestureView';
import { Types } from '../common/Interfaces';

import { MacComponentAccessibilityProps } from './Accessibility';
import AccessibilityUtil from './AccessibilityUtil';
import EventHelpers from './utils/EventHelpers';
import Platform from './Platform';
import UserInterface from './UserInterface';
import ViewBase from './ViewBase';

const _defaultImportantForAccessibility = Types.ImportantForAccessibility.Yes;
const _isNativeMacOs = Platform.getType() === 'macos';

export abstract class GestureView extends GestureViewCommon {
    private _panResponder: RN.PanResponderInstance;

    private _view: RN.View | undefined;

    constructor(props: Types.GestureViewProps) {
        super(props);

        // Setup Pan Responder
        this._panResponder = RN.PanResponder.create({
            onStartShouldSetPanResponder: (e: RN.GestureResponderEvent, gestureState: RN.PanResponderGestureState) => {
                const event = (e as any).nativeEvent as Types.TouchEvent;
                UserInterface.evaluateTouchLatency(e as any);
                return this._onTouchSeriesStart(event);
            },

            onMoveShouldSetPanResponder: (e: RN.GestureResponderEvent, gestureState: RN.PanResponderGestureState) => {
                const event = (e as any).nativeEvent as Types.TouchEvent;
                UserInterface.evaluateTouchLatency(e as any);
                return this._onTouchChange(event, gestureState);
            },

            onPanResponderRelease: (e: RN.GestureResponderEvent, gestureState: RN.PanResponderGestureState) => {
                const event = (e as any).nativeEvent as Types.TouchEvent;
                this._onTouchSeriesFinished(event, gestureState);
            },

            onPanResponderTerminate: (e: RN.GestureResponderEvent, gestureState: RN.PanResponderGestureState) => {
                const event = (e as any).nativeEvent as Types.TouchEvent;
                this._onTouchSeriesFinished(event, gestureState);
            },

            onPanResponderMove: (e: RN.GestureResponderEvent, gestureState: RN.PanResponderGestureState) => {
                const event = (e as any).nativeEvent as Types.TouchEvent;
                UserInterface.evaluateTouchLatency(e as any);
                this._onTouchChange(event, gestureState);
            },

            // Something else wants to become responder. Should this view release the responder?
            // Returning true allows release
            onPanResponderTerminationRequest: (e: RN.GestureResponderEvent,
                    gestureState: RN.PanResponderGestureState) => !!this.props.releaseOnRequest,
        });
    }

    render() {
        const importantForAccessibility = AccessibilityUtil.importantForAccessibilityToString(this.props.importantForAccessibility,
            _defaultImportantForAccessibility);
        const accessibilityTrait = AccessibilityUtil.accessibilityTraitToString(this.props.accessibilityTraits);
        const accessibilityComponentType = AccessibilityUtil.accessibilityComponentTypeToString(this.props.accessibilityTraits);

        const extendedProps: RN.ExtendedViewProps & MacComponentAccessibilityProps = {
            onFocus: this.props.onFocus,
            onBlur: this.props.onBlur,
            onKeyPress: this.props.onKeyPress ? this._onKeyPress : undefined,
        };

        if (_isNativeMacOs && App.supportsExperimentalKeyboardNavigation && this.props.onTap) {
            extendedProps.onClick = this._macos_sendTapEvent;
            if (this.props.tabIndex === undefined || this.props.tabIndex >= 0) {
                extendedProps.acceptsKeyboardFocus = true;
                extendedProps.enableFocusRing = true;
            }
        }

        return (
            <RN.View
                ref={ this._onRef }
                style={ [ViewBase.getDefaultViewStyle(), this.props.style] as RN.StyleProp<RN.ViewStyle> }
                importantForAccessibility={ importantForAccessibility }
                accessibilityTraits={ accessibilityTrait }
                accessibilityComponentType={ accessibilityComponentType }
                accessibilityLabel={ this.props.accessibilityLabel }
                testID={ this.props.testId }
                { ...this._panResponder.panHandlers }
                { ...extendedProps }
            >
                { this.props.children }
            </RN.View>
        );
    }

    protected _macos_sendTapEvent = (e: Types.MouseEvent) => {
        const gsState = this._mouseEventToTapGestureState(e);
        this._sendTapEvent(gsState);
    };

    private _onRef = (ref: RN.View | null) => {
        this._view = ref || undefined;
    };

    private _onKeyPress = (e: RN.NativeSyntheticEvent<RN.TextInputKeyPressEventData>) => {
        if (this.props.onKeyPress) {
            this.props.onKeyPress(EventHelpers.toKeyboardEvent(e));
        }
    };

    focus() {
        if (this._view && this._view.focus) {
            this._view.focus();
        }
    }

    blur() {
        if (this._view && this._view.blur) {
            this._view.blur();
        }
    }
}

export default GestureView;
