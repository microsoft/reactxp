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

import assert = require('assert');
import React = require('react');
import RN = require('react-native');

import AccessibilityUtil from './AccessibilityUtil';

import Types = require('../common/Types');
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
const _tapPixelThreshold = 4;
const _doubleTapDurationThreshold = 250;
const _doubleTapPixelThreshold = 20;

const _defaultImportantForAccessibility = Types.ImportantForAccessibility.Yes;

export abstract class GestureView extends ViewBase<Types.GestureViewProps, {}> {
    private _panResponder: RN.PanResponder;
    private _doubleTapTimer: any = null;

    // State for tracking move gestures (pinch/zoom or pan)
    private _pendingGestureType: GestureType = GestureType.None;
    private _pendingGestureState: Types.MultiTouchGestureState | Types.PanGestureState | Types.TapGestureState = null;

    // State for tracking double taps
    private _lastTapEvent: Types.TouchEvent = null;

    // State for tracking single taps
    private _lastGestureStartEvent: Types.TouchEvent = null;

    constructor(props: Types.GestureViewProps) {
        super(props);

        this._setUpPanResponder();
    }

    componentWillUnmount() {
        // Dispose of timer before the component goes away.
        this._cancelDoubleTapTimer();
    }

    // Get preferred pan ratio for platform.
    protected abstract _getPreferredPanRatio(): number;

    // Returns the timestamp for the touch event in milliseconds.
    protected abstract _getEventTimestamp(e: Types.TouchEvent): number;

    private _setUpPanResponder(): void {
        this._panResponder = RN.PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) => {
                const event = (e.nativeEvent as any) as Types.TouchEvent;
                UserInterface.evaluateTouchLatency(e);

                this._lastGestureStartEvent = event;
                // If we're trying to detect a tap, set this as the responder immediately.
                if (this.props.onTap || this.props.onDoubleTap) {
                    return true;
                }
                return false;
            },

            onMoveShouldSetPanResponder: (e, gestureState) => {
                const event = (e.nativeEvent as any) as Types.TouchEvent;
                UserInterface.evaluateTouchLatency(e);

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

            onPanResponderRelease: (e, gestureState) => {
                this._onPanResponderEnd(e, gestureState);
            },

            onPanResponderTerminate: (e, gestureState) => {
                this._onPanResponderEnd(e, gestureState);
            },

            onPanResponderMove: (e, gestureState) => {
                const event = (e.nativeEvent as any) as Types.TouchEvent;
                UserInterface.evaluateTouchLatency(e);

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
            onPanResponderTerminationRequest: e => this.props.releaseOnRequest
        });
    }

    private _onPanResponderEnd(e: RN.ResponderSyntheticEvent, gestureState: RN.PanResponderGestureState) {
        const event = (e.nativeEvent as any) as Types.TouchEvent;

        // Close out any of the pending move gestures.
        if (this._pendingGestureType === GestureType.MultiTouch) {
            this._sendMultiTouchEvents(event, gestureState, false, true);
            this._pendingGestureState = null;
            this._pendingGestureType = GestureType.None;
        } else if (this._pendingGestureType === GestureType.Pan ||
            this._pendingGestureType === GestureType.PanVertical ||
            this._pendingGestureType === GestureType.PanHorizontal) {
            this._sendPanEvent(event, gestureState, this._pendingGestureType, false, true);
            this._pendingGestureState = null;
            this._pendingGestureType = GestureType.None;
        } else if (this._isTap(event)) {
            if (!this.props.onDoubleTap) {
                // If there is no double-tap handler, we can invoke the tap handler immediately.
                this._sendTapEvent(event);
            } else if (this._isDoubleTap(event)) {
                // This is a double-tap, so swallow the previous single tap.
                this._cancelDoubleTapTimer();
                this._sendDoubleTapEvent(event);
                this._lastTapEvent = null;
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
        const initialPageX = this._lastGestureStartEvent.pageX;
        const initialPageY = this._lastGestureStartEvent.pageY;

        const timeStamp = this._getEventTimestamp(e);

        return (timeStamp - initialTimeStamp <= _tapDurationThreshold &&
            this._calcDistance(initialPageX - e.pageX, initialPageY - e.pageY) <= _tapPixelThreshold);
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
            this._calcDistance(this._lastTapEvent.pageX - e.pageX, this._lastTapEvent.pageY - e.pageY) <=
                _doubleTapPixelThreshold);
    }

    // Starts a timer that reports a previous tap if it's not canceled by a subsequent gesture.
    private _startDoubleTapTimer(e: Types.TouchEvent) {
        this._lastTapEvent = e;

        this._doubleTapTimer = setTimeout(() => {
            this._reportDelayedTap();
            this._doubleTapTimer = null;
        }, _doubleTapDurationThreshold);
    }

    // Cancels any pending double-tap timer.
    private _cancelDoubleTapTimer() {
        if (this._doubleTapTimer) {
            clearTimeout(this._doubleTapTimer);
            this._doubleTapTimer = null;
        }
    }

    // If there was a previous tap recorded but we haven't yet reported it because we were
    // waiting for a potential second tap, report it now.
    private _reportDelayedTap() {
        if (this._lastTapEvent && this.props.onTap) {
            this._sendTapEvent(this._lastTapEvent);
            this._lastTapEvent = null;
        }
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
        const panThreshold = this.props.panPixelThreshold > 0 ? this.props.panPixelThreshold : _panPixelThreshold;
        return (this._calcDistance(gestureState.dx, gestureState.dy) >= panThreshold);
    }

    private _shouldRespondToPanVertical(gestureState: RN.PanResponderGestureState) {
        if (!this.props.onPanVertical) {
            return false;
        }

        // Has the user started to pan?
        const panThreshold = this.props.panPixelThreshold > 0 ? this.props.panPixelThreshold : _panPixelThreshold;
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
        const panThreshold = this.props.panPixelThreshold > 0 ? this.props.panPixelThreshold : _panPixelThreshold;
        const isPan = Math.abs(gestureState.dx) >= panThreshold;

        if (isPan && this.props.preferredPan === Types.PreferredPanGesture.Vertical) {
            return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * this._getPreferredPanRatio());
        }
        return isPan;
    }

    private _calcDistance(dx: number, dy: number) {
        return Math.sqrt(dx * dx + dy * dy);
    }

    private _calcAngle(touches: React.TouchList): number {
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
        let p = this._pendingGestureState as Types.MultiTouchGestureState;
        let multiTouchEvent: Types.MultiTouchGestureState;

        // If the user lifted up one or both fingers, the multitouch gesture
        // is halted. Just return the existing gesture state.
        if (!e.touches || e.touches.length !== 2) {
            multiTouchEvent = p;
            p.isComplete = isComplete;
        } else {
            let centerPageX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
            let centerPageY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
            let centerClientX = (e.touches[0].locationX + e.touches[1].locationX) / 2;
            let centerClientY = (e.touches[0].locationY + e.touches[1].locationY) / 2;
            let width = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
            let height = Math.abs(e.touches[0].pageY - e.touches[1].pageY);
            let distance = this._calcDistance(width, height);
            let angle = this._calcAngle(e.touches);

            let initialCenterPageX = initializeFromEvent ? centerPageX : p.initialCenterPageX;
            let initialCenterPageY = initializeFromEvent ? centerPageY : p.initialCenterPageY;
            let initialCenterClientX = initializeFromEvent ? centerClientX : p.initialCenterClientX;
            let initialCenterClientY = initializeFromEvent ? centerClientY : p.initialCenterClientY;
            let initialWidth = initializeFromEvent ? width : p.initialWidth;
            let initialHeight = initializeFromEvent ? height : p.initialHeight;
            let initialDistance = initializeFromEvent ? distance : p.initialDistance;
            let initialAngle = initializeFromEvent ? angle : p.initialAngle;

            let velocityX = initializeFromEvent ? 0 : gestureState.vx;
            let velocityY = initializeFromEvent ? 0 : gestureState.vy;

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
                timeStamp: e.timeStamp
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
        let state = this._pendingGestureState as Types.PanGestureState;

        let pageX = e.pageX;
        let pageY = e.pageY;
        let clientX = e.locationX;
        let clientY = e.locationY;

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

        let initialPageX = this._lastGestureStartEvent 
            ? this._lastGestureStartEvent.pageX 
            : initializeFromEvent ? pageX : state.initialPageX;
        let initialPageY = this._lastGestureStartEvent 
            ? this._lastGestureStartEvent.pageY 
            : initializeFromEvent ? pageY : state.initialPageY;
        let initialClientX = this._lastGestureStartEvent 
            ? this._lastGestureStartEvent.locationX 
            : initializeFromEvent ? clientX : state.initialClientX;
        let initialClientY = this._lastGestureStartEvent 
            ? this._lastGestureStartEvent.locationY 
            : initializeFromEvent ? clientY : state.initialClientY;

        let velocityX = initializeFromEvent ? 0 : gestureState.vx;
        let velocityY = initializeFromEvent ? 0 : gestureState.vy;

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
            timeStamp: e.timeStamp
        };

        let callback = gestureType === GestureType.Pan ? this.props.onPan :
            (gestureType === GestureType.PanVertical ? this.props.onPanVertical :
                this.props.onPanHorizontal);

        callback(panEvent);

        return panEvent;
    }

    private _sendTapEvent(e: Types.TouchEvent) {
        if (this.props.onTap) {
            const tapEvent: Types.TapGestureState = {
                pageX: e.pageX,
                pageY: e.pageY,
                clientX: e.locationX,
                clientY: e.locationY,
                timeStamp: e.timeStamp
            };

            this.props.onTap(tapEvent);
        }
    }

    private _sendDoubleTapEvent(e: Types.TouchEvent) {
        if (this.props.onDoubleTap) {
            const tapEvent: Types.TapGestureState = {
                pageX: e.pageX,
                pageY: e.pageY,
                clientX: e.locationX,
                clientY: e.locationY,
                timeStamp: e.timeStamp
            };

            this.props.onDoubleTap(tapEvent);
        }
    }

    render() {
        const importantForAccessibility = AccessibilityUtil.importantForAccessibilityToString(this.props.importantForAccessibility,
            _defaultImportantForAccessibility);
        const accessibilityTrait = AccessibilityUtil.accessibilityTraitToString(this.props.accessibilityTraits);
        const accessibilityComponentType = AccessibilityUtil.accessibilityComponentTypeToString(this.props.accessibilityTraits);

        return (
            <RN.View
                style={ this._getStyles(this.props) }
                importantForAccessibility={ importantForAccessibility }
                accessibilityTraits={ accessibilityTrait }
                accessibilityComponentType={ accessibilityComponentType }
                accessibilityLabel={ this.props.accessibilityLabel }
                { ...this._panResponder.panHandlers }
            >
                {this.props.children}
            </RN.View>
        );
    }
}

export default GestureView;
