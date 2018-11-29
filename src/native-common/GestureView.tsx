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

import * as assert from 'assert';
import * as React from 'react';
import * as RN from 'react-native';

import { MacComponentAccessibilityProps } from './Accessibility';
import AccessibilityUtil from './AccessibilityUtil';
import App from '../native-common/App';
import EventHelpers from './utils/EventHelpers';
import { Types } from '../common/Interfaces';
import { isUndefined } from './utils/lodashMini';
import Platform from './Platform';
import Timers from '../common/utils/Timers';
import UserInterface from './UserInterface';
import ViewBase from './ViewBase';

enum GestureType {
    None,
    MultiTouch,
    Pan,
    PanVertical,
    PanHorizontal
}

// These threshold values were chosen empirically.
const _pinchZoomPixelThreshold = 3;
const _panPixelThreshold = 10;
const _tapDurationThreshold = 500;
const _longPressDurationThreshold = 750;
const _tapPixelThreshold = 4;
const _doubleTapDurationThreshold = 250;
const _doubleTapPixelThreshold = 20;

const _defaultImportantForAccessibility = Types.ImportantForAccessibility.Yes;
const _isNativeMacOs = Platform.getType() === 'macos';

export abstract class GestureView extends React.Component<Types.GestureViewProps, Types.Stateless> {
    private _panResponder: RN.PanResponderInstance;
    private _doubleTapTimer: number | undefined;

    private _pendingLongPressEvent: Types.TouchEvent | undefined;
    private _longPressTimer: number | undefined;

    // State for tracking move gestures (pinch/zoom or pan)
    private _pendingGestureType: GestureType = GestureType.None;
    private _pendingGestureState: Types.MultiTouchGestureState | Types.PanGestureState | Types.TapGestureState | undefined;

    // State for tracking double taps
    private _lastTapEvent: Types.TouchEvent | undefined;

    // State for tracking single taps
    private _lastGestureStartEvent: Types.TouchEvent | undefined;

    private _view: RN.View | undefined;

    constructor(props: Types.GestureViewProps) {
        super(props);

        // Setup Pan Responder
        this._panResponder = RN.PanResponder.create({
            onStartShouldSetPanResponder: (e: RN.GestureResponderEvent, gestureState: RN.PanResponderGestureState) => {
                const event = (e as any).nativeEvent as Types.TouchEvent;
                UserInterface.evaluateTouchLatency(e as any);

                this._lastGestureStartEvent = event;
                // If we're trying to detect a tap, set this as the responder immediately.
                if (this.props.onTap || this.props.onDoubleTap || this.props.onLongPress || this.props.onContextMenu) {
                    if (this.props.onLongPress) {
                        this._startLongPressTimer(event);
                    }

                    return true;
                }
                return false;
            },

            onMoveShouldSetPanResponder: (e: RN.GestureResponderEvent, gestureState: RN.PanResponderGestureState) => {
                const event = (e as any).nativeEvent as Types.TouchEvent;
                UserInterface.evaluateTouchLatency(e as any);

                this._lastGestureStartEvent = event;
                this._pendingGestureType = this._detectMoveGesture(event, gestureState);

                if (this._pendingGestureType === GestureType.MultiTouch) {
                    // Handle multi-touch gestures.
                    this._setPendingGestureState(this._sendMultiTouchEvents(event, gestureState, true, false));
                    return true;
                } else if (this._pendingGestureType === GestureType.Pan ||
                    this._pendingGestureType === GestureType.PanVertical ||
                    this._pendingGestureType === GestureType.PanHorizontal) {
                    // Handle a pan gesture.
                    this._setPendingGestureState(this._sendPanEvent(event, gestureState,
                        this._pendingGestureType, true, false));
                    return true;
                }

                return false;
            },

            onPanResponderRelease: (e: RN.GestureResponderEvent, gestureState: RN.PanResponderGestureState) => {
                this._onPanResponderEnd(e, gestureState);
            },

            onPanResponderTerminate: (e: RN.GestureResponderEvent, gestureState: RN.PanResponderGestureState) => {
                this._onPanResponderEnd(e, gestureState);
            },

            onPanResponderMove: (e: RN.GestureResponderEvent, gestureState: RN.PanResponderGestureState) => {
                const event = (e as any).nativeEvent as Types.TouchEvent;
                UserInterface.evaluateTouchLatency(e as any);

                let initializeFromEvent = false;

                // If this is the first movement we've seen, try to match it against
                // the various move gestures that we're looking for.
                if (this._pendingGestureType === GestureType.None) {
                    this._pendingGestureType = this._detectMoveGesture(event, gestureState);
                    initializeFromEvent = true;
                }

                if (this._pendingGestureType === GestureType.MultiTouch) {
                    this._setPendingGestureState(this._sendMultiTouchEvents(event, gestureState,
                        initializeFromEvent, false));
                } else if (this._pendingGestureType === GestureType.Pan ||
                        this._pendingGestureType === GestureType.PanVertical ||
                        this._pendingGestureType === GestureType.PanHorizontal) {
                    this._setPendingGestureState(this._sendPanEvent(event, gestureState,
                        this._pendingGestureType, initializeFromEvent, false));
                }
            },

            // Something else wants to become responder. Should this view release the responder?
            // Returning true allows release
            onPanResponderTerminationRequest: (e: RN.GestureResponderEvent, gestureState:
                RN.PanResponderGestureState) => !!this.props.releaseOnRequest
        });
    }

    componentWillUnmount() {
        // Dispose of timer before the component goes away.
        this._cancelDoubleTapTimer();
    }

    // Get preferred pan ratio for platform.
    protected abstract _getPreferredPanRatio(): number;

    // Returns the timestamp for the touch event in milliseconds.
    protected abstract _getEventTimestamp(e: Types.TouchEvent): number;

    private _onPanResponderEnd(e: RN.GestureResponderEvent, gestureState: RN.PanResponderGestureState) {
        const event = (e as any).nativeEvent as Types.TouchEvent;

        // Can't possibly be a long press if the touch ended.
        this._cancelLongPressTimer();

        // Close out any of the pending move gestures.
        if (this._pendingGestureType === GestureType.MultiTouch) {
            this._sendMultiTouchEvents(event, gestureState, false, true);
            this._pendingGestureState = undefined;
            this._pendingGestureType = GestureType.None;
        } else if (this._pendingGestureType === GestureType.Pan ||
            this._pendingGestureType === GestureType.PanVertical ||
            this._pendingGestureType === GestureType.PanHorizontal) {
            this._sendPanEvent(event, gestureState, this._pendingGestureType, false, true);
            this._pendingGestureState = undefined;
            this._pendingGestureType = GestureType.None;
        } else if (this._isTap(event)) {
            if (!this.props.onDoubleTap) {
                // If there is no double-tap handler, we can invoke the tap handler immediately.
                this._sendTapEvent(event);
            } else if (this._isDoubleTap(event)) {
                // This is a double-tap, so swallow the previous single tap.
                this._cancelDoubleTapTimer();
                this._sendDoubleTapEvent(event);
                this._lastTapEvent = undefined;
            } else {
                // This wasn't a double-tap. Report any previous single tap and start the double-tap
                // timer so we can determine whether the current tap is a single or double.
                this._reportDelayedTap();
                this._startDoubleTapTimer(event);
            }
        } else {
            this._reportDelayedTap();
            this._cancelDoubleTapTimer();
        }
    }

    private _setPendingGestureState(gestureState: Types.MultiTouchGestureState | Types.PanGestureState | Types.TapGestureState) {
        this._reportDelayedTap();
        this._cancelDoubleTapTimer();
        this._cancelLongPressTimer();
        this._pendingGestureState = gestureState;
    }

    private _detectMoveGesture(e: Types.TouchEvent, gestureState: RN.PanResponderGestureState): GestureType {
        if (this._shouldRespondToPinchZoom(e, gestureState) || this._shouldRespondToRotate(e, gestureState)) {
            return GestureType.MultiTouch;
        } else if (this._shouldRespondToPan(gestureState)) {
            return GestureType.Pan;
        } else if (this._shouldRespondToPanVertical(gestureState)) {
            return GestureType.PanVertical;
        } else if (this._shouldRespondToPanHorizontal(gestureState)) {
            return GestureType.PanHorizontal;
        }

        return GestureType.None;
    }

    // Determines whether a touch event constitutes a tap. The "finger up"
    // event must be within a certain distance and within a certain time
    // from where the "finger down" event occurred.
    private _isTap(e: Types.TouchEvent): boolean {
        if (!this._lastGestureStartEvent) {
            return false;
        }

        const initialTimeStamp = this._getEventTimestamp(this._lastGestureStartEvent);
        const initialPageX = this._lastGestureStartEvent.pageX!;
        const initialPageY = this._lastGestureStartEvent.pageY!;

        const timeStamp = this._getEventTimestamp(e);

        return (timeStamp - initialTimeStamp <= _tapDurationThreshold &&
            this._calcDistance(initialPageX - e.pageX!, initialPageY - e.pageY!) <= _tapPixelThreshold);
    }

    // This method assumes that the caller has already determined that two
    // taps have been detected in a row with no intervening gestures. It
    // is responsible for determining if they occurred within close proximity
    // and within a certain threshold of time.
    private _isDoubleTap(e: Types.TouchEvent) {
        const timeStamp = this._getEventTimestamp(e);

        if (!this._lastTapEvent) {
            return false;
        }

        return (timeStamp - this._getEventTimestamp(this._lastTapEvent) <= _doubleTapDurationThreshold &&
            this._calcDistance((this._lastTapEvent.pageX || 0) - (e.pageX || 0), (this._lastTapEvent.pageY || 0) - (e.pageY || 0)) <=
                _doubleTapPixelThreshold);
    }

    // Starts a timer that reports a previous tap if it's not canceled by a subsequent gesture.
    private _startDoubleTapTimer(e: Types.TouchEvent) {
        this._lastTapEvent = e;

        this._doubleTapTimer = Timers.setTimeout(() => {
            this._reportDelayedTap();
            this._doubleTapTimer = undefined;
        }, _doubleTapDurationThreshold);
    }

    // Cancels any pending double-tap timer.
    private _cancelDoubleTapTimer() {
        if (this._doubleTapTimer) {
            clearTimeout(this._doubleTapTimer);
            this._doubleTapTimer = undefined;
        }
    }

    private _startLongPressTimer(event: Types.TouchEvent) {
        this._pendingLongPressEvent = event;

        this._longPressTimer = Timers.setTimeout(() => {
            this._reportLongPress();
            this._longPressTimer = undefined;
        }, _longPressDurationThreshold);
    }

    private _cancelLongPressTimer() {
        if (this._longPressTimer) {
            clearTimeout(this._longPressTimer);
            this._longPressTimer = undefined;
        }
        this._pendingLongPressEvent = undefined;
    }

    // If there was a previous tap recorded but we haven't yet reported it because we were
    // waiting for a potential second tap, report it now.
    private _reportDelayedTap() {
        if (this._lastTapEvent && this.props.onTap) {
            this._sendTapEvent(this._lastTapEvent);
            this._lastTapEvent = undefined;
        }
    }

    private _reportLongPress() {
        if (this.props.onLongPress) {
            const tapEvent: Types.TapGestureState = {
                isTouch: !EventHelpers.isActuallyMouseEvent(this._pendingLongPressEvent!),
                pageX: this._pendingLongPressEvent!.pageX!,
                pageY: this._pendingLongPressEvent!.pageY!,
                clientX: this._pendingLongPressEvent!.locationX!,
                clientY: this._pendingLongPressEvent!.locationY!,
                timeStamp: this._pendingLongPressEvent!.timeStamp
            };

            this.props.onLongPress(tapEvent);
        }

        this._pendingLongPressEvent = undefined;
    }

    private _shouldRespondToPinchZoom(e: Types.TouchEvent, gestureState: RN.PanResponderGestureState) {
        if (!this.props.onPinchZoom) {
            return false;
        }

        // Do we see two touches?
        if (!e.touches || e.touches.length !== 2) {
            return false;
        }

        // Has the user started to pinch or zoom?
        if (this._calcDistance(e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY) >=
                    _pinchZoomPixelThreshold) {
            return true;
        }

        return false;
    }

    private _shouldRespondToRotate(e: Types.TouchEvent, gestureState: RN.PanResponderGestureState) {
        if (!this.props.onRotate) {
            return false;
        }

        // Do we see two touches?
        if (!e.touches || e.touches.length !== 2) {
            return false;
        }

        return true;
    }

    private _shouldRespondToPan(gestureState: RN.PanResponderGestureState) {
        if (!this.props.onPan) {
            return false;
        }

        // Has the user started to pan?
        const panThreshold = (!isUndefined(this.props.panPixelThreshold) && this.props.panPixelThreshold > 0) ?
            this.props.panPixelThreshold : _panPixelThreshold;
        return (this._calcDistance(gestureState.dx, gestureState.dy) >= panThreshold);
    }

    private _shouldRespondToPanVertical(gestureState: RN.PanResponderGestureState) {
        if (!this.props.onPanVertical) {
            return false;
        }

        // Has the user started to pan?
        const panThreshold = (!isUndefined(this.props.panPixelThreshold) && this.props.panPixelThreshold > 0) ?
            this.props.panPixelThreshold : _panPixelThreshold;
        const isPan = Math.abs(gestureState.dy) >= panThreshold;

        if (isPan && this.props.preferredPan === Types.PreferredPanGesture.Horizontal) {
            return Math.abs(gestureState.dy) > Math.abs(gestureState.dx * this._getPreferredPanRatio());
        }
        return isPan;
    }

    private _shouldRespondToPanHorizontal(gestureState: RN.PanResponderGestureState) {
        if (!this.props.onPanHorizontal) {
            return false;
        }

        // Has the user started to pan?
        const panThreshold = (!isUndefined(this.props.panPixelThreshold) && this.props.panPixelThreshold > 0) ?
            this.props.panPixelThreshold : _panPixelThreshold;
        const isPan = Math.abs(gestureState.dx) >= panThreshold;

        if (isPan && this.props.preferredPan === Types.PreferredPanGesture.Vertical) {
            return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * this._getPreferredPanRatio());
        }
        return isPan;
    }

    private _calcDistance(dx: number, dy: number) {
        return Math.sqrt(dx * dx + dy * dy);
    }

    private _calcAngle(touches: Types.TouchList): number {
        const a = touches[0];
        const b = touches[1];

        let degrees = this._radiansToDegrees(Math.atan2(b.pageY - a.pageY, b.pageX - a.pageX));
        if (degrees < 0) {
            degrees += 360;
        }

        return degrees;
    }

    private _radiansToDegrees(rad: number): number {
        return rad * 180 / Math.PI;
    }

    private _sendMultiTouchEvents(e: Types.TouchEvent, gestureState: RN.PanResponderGestureState,
            initializeFromEvent: boolean, isComplete: boolean) {
        const p = this._pendingGestureState as Types.MultiTouchGestureState;
        let multiTouchEvent: Types.MultiTouchGestureState;

        // If the user lifted up one or both fingers, the multitouch gesture
        // is halted. Just return the existing gesture state.
        if (!e.touches || e.touches.length !== 2) {
            multiTouchEvent = p;
            p.isComplete = isComplete;
        } else {
            const centerPageX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
            const centerPageY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
            const centerClientX = (e.touches[0].locationX + e.touches[1].locationX) / 2;
            const centerClientY = (e.touches[0].locationY + e.touches[1].locationY) / 2;
            const width = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
            const height = Math.abs(e.touches[0].pageY - e.touches[1].pageY);
            const distance = this._calcDistance(width, height);
            const angle = this._calcAngle(e.touches);

            const initialCenterPageX = initializeFromEvent ? centerPageX : p.initialCenterPageX;
            const initialCenterPageY = initializeFromEvent ? centerPageY : p.initialCenterPageY;
            const initialCenterClientX = initializeFromEvent ? centerClientX : p.initialCenterClientX;
            const initialCenterClientY = initializeFromEvent ? centerClientY : p.initialCenterClientY;
            const initialWidth = initializeFromEvent ? width : p.initialWidth;
            const initialHeight = initializeFromEvent ? height : p.initialHeight;
            const initialDistance = initializeFromEvent ? distance : p.initialDistance;
            const initialAngle = initializeFromEvent ? angle : p.initialAngle;

            const velocityX = initializeFromEvent ? 0 : gestureState.vx;
            const velocityY = initializeFromEvent ? 0 : gestureState.vy;

            multiTouchEvent = {
                initialCenterPageX: initialCenterPageX,
                initialCenterPageY: initialCenterPageY,
                initialCenterClientX: initialCenterClientX,
                initialCenterClientY: initialCenterClientY,
                initialWidth: initialWidth,
                initialHeight: initialHeight,
                initialDistance: initialDistance,
                initialAngle: initialAngle,

                centerPageX: centerPageX,
                centerPageY: centerPageY,
                centerClientX: centerClientX,
                centerClientY: centerClientY,
                velocityX: velocityX,
                velocityY: velocityY,
                width: width,
                height: height,
                distance: distance,
                angle: angle,

                isComplete: isComplete,
                timeStamp: e.timeStamp,
                isTouch: !EventHelpers.isActuallyMouseEvent(e)
            };
        }

        if (this.props.onPinchZoom) {
            this.props.onPinchZoom(multiTouchEvent);
        }

        if (this.props.onRotate) {
            this.props.onRotate(multiTouchEvent);
        }

        return multiTouchEvent;
    }

    private _sendPanEvent(e: Types.TouchEvent, gestureState: RN.PanResponderGestureState,
            gestureType: GestureType, initializeFromEvent: boolean, isComplete: boolean) {
        const state = this._pendingGestureState as Types.PanGestureState;

        let pageX = e.pageX!;
        let pageY = e.pageY!;
        let clientX = e.locationX!;
        let clientY = e.locationY!;

        // Grab the first touch. If the user adds additional touch events,
        // we will ignore them. If we use e.pageX/Y, we will be using the average
        // of the touches, so we'll see a discontinuity.
        if (e.touches && e.touches.length > 0) {
            pageX = e.touches[0].pageX;
            pageY = e.touches[0].pageY;
            clientX = e.touches[0].locationX;
            clientY = e.touches[0].locationY;
        }

        assert.ok(this._lastGestureStartEvent, 'Gesture start event must not be null.');

        const initialPageX = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.pageX!
            : initializeFromEvent ? pageX : state.initialPageX;
        const initialPageY = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.pageY!
            : initializeFromEvent ? pageY : state.initialPageY;
        const initialClientX = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.locationX!
            : initializeFromEvent ? clientX : state.initialClientX;
        const initialClientY = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.locationY!
            : initializeFromEvent ? clientY : state.initialClientY;

        const velocityX = initializeFromEvent ? 0 : gestureState.vx;
        const velocityY = initializeFromEvent ? 0 : gestureState.vy;

        const panEvent: Types.PanGestureState = {
            initialPageX: initialPageX,
            initialPageY: initialPageY,
            initialClientX: initialClientX,
            initialClientY: initialClientY,

            pageX: pageX,
            pageY: pageY,
            clientX: clientX,
            clientY: clientY,
            velocityX: velocityX,
            velocityY: velocityY,

            isComplete: isComplete,
            timeStamp: e.timeStamp,
            isTouch: !EventHelpers.isActuallyMouseEvent(this._lastGestureStartEvent)
        };

        switch (gestureType) {
            case GestureType.Pan:
                if (this.props.onPan) {
                    this.props.onPan(panEvent);
                }
                break;
            case GestureType.PanVertical:
                if (this.props.onPanVertical) {
                    this.props.onPanVertical(panEvent);
                }
                break;
            case GestureType.PanHorizontal:
                if (this.props.onPanHorizontal) {
                    this.props.onPanHorizontal(panEvent);
                }
                break;

            default:
                // do nothing;
        }

        return panEvent;
    }

    private _sendTapEvent = (e: Types.TouchEvent) => {
        const button = EventHelpers.toMouseButton(e);
        if (button === 2) {
            // Always handle secondary button, even if context menu is not set - it shouldn't trigger onTap.
            if (this.props.onContextMenu) {
                const tapEvent: Types.TapGestureState = {
                    pageX: e.pageX!,
                    pageY: e.pageY!,
                    clientX: e.locationX!,
                    clientY: e.locationY!,
                    timeStamp: e.timeStamp,
                    isTouch: !EventHelpers.isActuallyMouseEvent(e)
                };

                this.props.onContextMenu(tapEvent);
            }
        } else if (this.props.onTap) {
            const tapEvent: Types.TapGestureState = {
                pageX: e.pageX!,
                pageY: e.pageY!,
                clientX: e.locationX!,
                clientY: e.locationY!,
                timeStamp: e.timeStamp,
                isTouch: !EventHelpers.isActuallyMouseEvent(e)
            };

            this.props.onTap(tapEvent);
        }
    }

    private _sendDoubleTapEvent(e: Types.TouchEvent) {
        // If user did a double click with different mouse buttons, eg. left (50ms) right
        // both clicks need to be registered as separate events.
        const lastButton = EventHelpers.toMouseButton(this._lastTapEvent!);
        const button = EventHelpers.toMouseButton(e);
        if (lastButton !== button || button === 2) {
            this._sendTapEvent(this._lastTapEvent!);
            this._sendTapEvent(e);
            return;
        }

        if (this.props.onDoubleTap) {
            const tapEvent: Types.TapGestureState = {
                pageX: e.pageX!,
                pageY: e.pageY!,
                clientX: e.locationX!,
                clientY: e.locationY!,
                timeStamp: e.timeStamp,
                isTouch: !EventHelpers.isActuallyMouseEvent(e)
            };

            this.props.onDoubleTap(tapEvent);
        }
    }

    render() {
        const importantForAccessibility = AccessibilityUtil.importantForAccessibilityToString(this.props.importantForAccessibility,
            _defaultImportantForAccessibility);
        const accessibilityTrait = AccessibilityUtil.accessibilityTraitToString(this.props.accessibilityTraits);
        const accessibilityComponentType = AccessibilityUtil.accessibilityComponentTypeToString(this.props.accessibilityTraits);

        const extendedProps: RN.ExtendedViewProps & MacComponentAccessibilityProps = {
            onFocus: this.props.onFocus,
            onBlur: this.props.onBlur,
            onKeyPress: this.props.onKeyPress ? this._onKeyPress : undefined
        };

        if (_isNativeMacOs && App.supportsExperimentalKeyboardNavigation && this.props.onTap) {
            extendedProps.onClick = this._sendTapEvent;
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
                testID={this.props.testId}
                { ...this._panResponder.panHandlers }
                { ...extendedProps }
            >
                {this.props.children}
            </RN.View>
        );
    }

    private _onRef = (ref: RN.View | null) => {
        this._view = ref || undefined;
    }

    private _onKeyPress = (e: RN.NativeSyntheticEvent<RN.TextInputKeyPressEventData>) => {
        if (this.props.onKeyPress) {
            this.props.onKeyPress(EventHelpers.toKeyboardEvent(e));
        }
    }

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
