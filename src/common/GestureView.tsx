/**
 * GestureView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Cross-platform parts of the implementation of the GestureView component.
 * It provides much of the standard work necessary to support combinations of
 * pinch-and-zoom, panning, single tap and double tap gestures.
 */

import * as React from 'react';

import assert from '../common/assert';
import { Types } from '../common/Interfaces';
import Timers from '../common/utils/Timers';

export enum GestureType {
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

export interface GestureStatePoint {
    /**
     * accumulated distance of the gesture since the touch started
     */
    dx: number;

    /**
     * accumulated distance of the gesture since the touch started
     */
    dy: number;
}

export interface GestureStatePointVelocity extends GestureStatePoint {
    /**
     * current velocity of the gesture
     */
    vx: number;

    /**
     * current velocity of the gesture
     */
    vy: number;
}

// We need a method-less really-basic touch event basic type for allowing cross-platform adapting of
// web(React)-based touch events into RX touch events, since they're based on the RN type to allow
// for zero-work casting and manipulating.
export interface TouchListBasic {
    [index: number]: Types.Touch;
    length: number;
}

export interface TouchEventBasic extends Types.SyntheticEvent {
    // We override this definition because the public
    // type excludes location and page fields.
    altKey: boolean;
    changedTouches: TouchListBasic;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    targetTouches: TouchListBasic;
    locationX?: number;
    locationY?: number;
    pageX?: number;
    pageY?: number;
    touches: TouchListBasic;
}

export abstract class GestureView extends React.Component<Types.GestureViewProps, Types.Stateless> {
    private _doubleTapTimer: number | undefined;

    private _pendingLongPressEvent: Types.TapGestureState | undefined;
    private _longPressTimer: number | undefined;

    // State for tracking move gestures (pinch/zoom or pan)
    private _pendingGestureType: GestureType = GestureType.None;
    private _pendingGestureState: Types.MultiTouchGestureState | Types.PanGestureState | Types.TapGestureState | undefined;

    // State for tracking double taps
    private _lastTapEvent: Types.TapGestureState | undefined;

    // Skip ability for next tap to work around some event issues
    private _shouldSkipNextTap = false;

    // State for tracking single taps
    private _lastGestureStartEvent: TouchEventBasic | undefined;

    componentWillUnmount() {
        // Dispose of timer before the component goes away.
        this._cancelDoubleTapTimer();
    }

    // Returns true if we care about trapping/tracking the event
    protected _onTouchSeriesStart(event: TouchEventBasic): boolean {
        this._lastGestureStartEvent = event;

        // If we're trying to detect a tap, set this as the responder immediately.
        if (this.props.onTap || this.props.onDoubleTap || this.props.onLongPress || this.props.onContextMenu) {
            if (this.props.onLongPress) {
                const gsState = this._touchEventToTapGestureState(event);
                this._startLongPressTimer(gsState);
            }

            return true;
        }

        return false;
    }

    // Returns true if we care about trapping/tracking the event
    protected _onTouchChange(event: TouchEventBasic, gestureState: GestureStatePointVelocity): boolean {
        if (!this._lastGestureStartEvent) {
            this._lastGestureStartEvent = event;
        }

        // If this is the first movement we've seen, try to match it against
        // the various move gestures that we're looking for.
        let initializeFromEvent = false;
        if (this._pendingGestureType === GestureType.None) {
            this._pendingGestureType = this._detectMoveGesture(event, gestureState);
            initializeFromEvent = true;
        }

        if (this._pendingGestureType === GestureType.MultiTouch) {
            this._setPendingGestureState(this._sendMultiTouchEvents(event, gestureState,
                initializeFromEvent, false));
            return true;
        } else if (this._pendingGestureType === GestureType.Pan ||
                this._pendingGestureType === GestureType.PanVertical ||
                this._pendingGestureType === GestureType.PanHorizontal) {
            const spEvent = this._touchEventToTapGestureState(event);
            this._setPendingGestureState(this._sendPanEvent(spEvent, gestureState,
                this._pendingGestureType, initializeFromEvent, false));
            return true;
        }

        return false;
    }

    protected _onTouchSeriesFinished(touchEvent: TouchEventBasic, gestureState: GestureStatePointVelocity) {
        // Can't possibly be a long press if the touch ended.
        this._cancelLongPressTimer();

        // Close out any of the pending move gestures.
        if (this._pendingGestureType === GestureType.MultiTouch) {
            this._sendMultiTouchEvents(touchEvent, gestureState, false, true);
            this._pendingGestureState = undefined;
            this._pendingGestureType = GestureType.None;
        } else if (this._pendingGestureType === GestureType.Pan ||
            this._pendingGestureType === GestureType.PanVertical ||
            this._pendingGestureType === GestureType.PanHorizontal) {
            const spEvent = this._touchEventToTapGestureState(touchEvent);
            this._sendPanEvent(spEvent, gestureState, this._pendingGestureType, false, true);
            this._pendingGestureState = undefined;
            this._pendingGestureType = GestureType.None;
        } else if (this._isTap(touchEvent)) {
            const tapGestureState = this._touchEventToTapGestureState(touchEvent);
            if (!this.props.onDoubleTap) {
                // If there is no double-tap handler, we can invoke the tap handler immediately.
                this._sendTapEvent(tapGestureState);
            } else if (this._isDoubleTap(tapGestureState)) {
                // This is a double-tap, so swallow the previous single tap.
                this._cancelDoubleTapTimer();
                this._sendDoubleTapEvent(tapGestureState);
            } else {
                // This wasn't a double-tap. Report any previous single tap and start the double-tap
                // timer so we can determine whether the current tap is a single or double.
                this._reportDelayedTap();
                this._startDoubleTapTimer(tapGestureState);
            }
        } else {
            this._reportDelayedTap();
            this._cancelDoubleTapTimer();
        }
    }

    // Get preferred pan ratio for platform.
    protected abstract _getPreferredPanRatio(): number;

    // Returns the timestamp for the touch event in milliseconds.
    protected abstract _getEventTimestamp(e: TouchEventBasic | Types.MouseEvent): number;

    protected _skipNextTap() {
        this._shouldSkipNextTap = true;
    }

    private _setPendingGestureState(gestureState: Types.MultiTouchGestureState | Types.PanGestureState | Types.TapGestureState) {
        this._reportDelayedTap();
        this._cancelDoubleTapTimer();
        this._cancelLongPressTimer();
        this._pendingGestureState = gestureState;
    }

    private _detectMoveGesture(e: TouchEventBasic, gestureState: GestureStatePoint): GestureType {
        if (this._shouldRespondToPinchZoom(e) || this._shouldRespondToRotate(e)) {
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
    private _isTap(e: TouchEventBasic): boolean {
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
    protected _isDoubleTap(e: Types.TapGestureState) {
        if (!this._lastTapEvent) {
            return false;
        }

        return (e.timeStamp - this._lastTapEvent.timeStamp <= _doubleTapDurationThreshold &&
            this._calcDistance(this._lastTapEvent.pageX - e.pageX, this._lastTapEvent.pageY - e.pageY) <= _doubleTapPixelThreshold);
    }

    // Starts a timer that reports a previous tap if it's not canceled by a subsequent gesture.
    protected _startDoubleTapTimer(e: Types.TapGestureState) {
        this._lastTapEvent = e;

        this._doubleTapTimer = Timers.setTimeout(() => {
            this._reportDelayedTap();
            this._doubleTapTimer = undefined;
        }, _doubleTapDurationThreshold);
    }

    // Cancels any pending double-tap timer.
    protected _cancelDoubleTapTimer() {
        if (this._doubleTapTimer) {
            Timers.clearTimeout(this._doubleTapTimer);
            this._doubleTapTimer = undefined;
        }
    }

    protected _startLongPressTimer(gsState: Types.TapGestureState, isDefinitelyMouse = false) {
        if (this._pendingLongPressEvent) {
            return;
        }

        this._pendingLongPressEvent = gsState;

        this._longPressTimer = Timers.setTimeout(() => {
            this._reportLongPress();
            this._longPressTimer = undefined;
        }, _longPressDurationThreshold);
    }

    private _reportLongPress() {
        if (!this._pendingLongPressEvent) {
            return;
        }

        if (this.props.onLongPress) {
            this.props.onLongPress(this._pendingLongPressEvent);
        }

        this._pendingLongPressEvent = undefined;
    }

    protected _cancelLongPressTimer() {
        if (this._longPressTimer) {
            Timers.clearTimeout(this._longPressTimer);
            this._longPressTimer = undefined;
        }

        this._pendingLongPressEvent = undefined;
    }

    // If there was a previous tap recorded but we haven't yet reported it because we were
    // waiting for a potential second tap, report it now.
    protected _reportDelayedTap() {
        if (this._lastTapEvent && this.props.onTap) {
            this._sendTapEvent(this._lastTapEvent);
            this._lastTapEvent = undefined;
        }
    }

    protected _clearLastTap() {
        this._lastTapEvent = undefined;
    }

    private static _isActuallyMouseEvent(e: TouchEventBasic | undefined): boolean {
        if (!e) {
            return false;
        }

        const nativeEvent = e as any;
        if (nativeEvent.button !== undefined) {
            return true;
        } else if (nativeEvent.isRightButton || nativeEvent.IsRightButton) {
            return true;
        } else if (nativeEvent.isMiddleButton || nativeEvent.IsMiddleButton) {
            return true;
        }

        return false;
    }

    private _shouldRespondToPinchZoom(e: TouchEventBasic) {
        if (!this.props.onPinchZoom) {
            return false;
        }

        // Do we see two touches?
        if (!e.touches || e.touches.length !== 2) {
            return false;
        }

        // Has the user started to pinch or zoom?
        const distance = this._calcDistance(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        if (distance >= _pinchZoomPixelThreshold) {
            return true;
        }

        return false;
    }

    private _shouldRespondToRotate(e: TouchEventBasic) {
        if (!this.props.onRotate) {
            return false;
        }

        // Do we see two touches?
        if (!e.touches || e.touches.length !== 2) {
            return false;
        }

        return true;
    }

    protected _shouldRespondToPan(gestureState: GestureStatePoint) {
        if (!this.props.onPan) {
            return false;
        }

        // Has the user started to pan?
        const panThreshold = (this.props.panPixelThreshold !== undefined && this.props.panPixelThreshold > 0) ?
            this.props.panPixelThreshold : _panPixelThreshold;
        return (this._calcDistance(gestureState.dx, gestureState.dy) >= panThreshold);
    }

    protected _shouldRespondToPanVertical(gestureState: GestureStatePoint) {
        if (!this.props.onPanVertical) {
            return false;
        }

        // Has the user started to pan?
        const panThreshold = (this.props.panPixelThreshold !== undefined && this.props.panPixelThreshold > 0) ?
            this.props.panPixelThreshold : _panPixelThreshold;
        const isPan = Math.abs(gestureState.dy) >= panThreshold;

        if (isPan && this.props.preferredPan === Types.PreferredPanGesture.Horizontal) {
            return Math.abs(gestureState.dy) > Math.abs(gestureState.dx * this._getPreferredPanRatio());
        }
        return isPan;
    }

    protected _shouldRespondToPanHorizontal(gestureState: GestureStatePoint) {
        if (!this.props.onPanHorizontal) {
            return false;
        }

        // Has the user started to pan?
        const panThreshold = (this.props.panPixelThreshold !== undefined && this.props.panPixelThreshold > 0) ?
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

    private _calcAngle(touches: TouchListBasic): number {
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

    private _sendMultiTouchEvents(e: TouchEventBasic, gestureState: GestureStatePointVelocity,
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
                isTouch: !GestureView._isActuallyMouseEvent(e),
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

    protected _touchEventToTapGestureState(e: TouchEventBasic): Types.TapGestureState {
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

        return {
            timeStamp: this._getEventTimestamp(e),
            clientX,
            clientY,
            pageX,
            pageY,
            isTouch: !GestureView._isActuallyMouseEvent(e),
        };
    }

    protected _mouseEventToTapGestureState(e: Types.MouseEvent): Types.TapGestureState {
        const xyOffset = this._getClientXYOffset();
        return {
            timeStamp: this._getEventTimestamp(e),
            clientX: e.clientX - xyOffset.x,
            clientY: e.clientY - xyOffset.y,
            pageX: e.pageX || 0,
            pageY: e.pageY || 0,
            isTouch: false,
        };
    }

    protected _getClientXYOffset(): { x: number; y: number } {
        return { x: 0, y: 0 };
    }

    private _sendPanEvent(e: Types.TapGestureState, gestureState: GestureStatePointVelocity,
            gestureType: GestureType, initializeFromEvent: boolean, isComplete: boolean) {
        const state = this._pendingGestureState as Types.PanGestureState;

        assert(this._lastGestureStartEvent, 'Gesture start event must not be null.');

        const initialPageX = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.pageX!
            : initializeFromEvent ? e.pageX : state.initialPageX;
        const initialPageY = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.pageY!
            : initializeFromEvent ? e.pageY : state.initialPageY;
        const initialClientX = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.locationX!
            : initializeFromEvent ? e.clientX : state.initialClientX;
        const initialClientY = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.locationY!
            : initializeFromEvent ? e.clientY : state.initialClientY;

        const velocityX = initializeFromEvent ? 0 : gestureState.vx;
        const velocityY = initializeFromEvent ? 0 : gestureState.vy;

        const panEvent: Types.PanGestureState = {
            initialPageX: initialPageX,
            initialPageY: initialPageY,
            initialClientX: initialClientX,
            initialClientY: initialClientY,

            pageX: e.pageX,
            pageY: e.pageY,
            clientX: e.clientX,
            clientY: e.clientY,
            velocityX: velocityX,
            velocityY: velocityY,

            isComplete: isComplete,
            timeStamp: e.timeStamp,
            isTouch: !GestureView._isActuallyMouseEvent(this._lastGestureStartEvent),
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

    private static _toMouseButton(nativeEvent: any): number {
        if (nativeEvent.button !== undefined) {
            return nativeEvent.button;
        } else if (nativeEvent.isRightButton || nativeEvent.IsRightButton) {
            return 2;
        } else if (nativeEvent.isMiddleButton || nativeEvent.IsMiddleButton) {
            return 1;
        }

        return 0;
    }

    // Protected only as a hack for supporting keyboard nav clicking from native-common/GestureView
    protected _sendTapEvent = (tapEvent: Types.TapGestureState) => {
        // we need to skip tap after succesfull pan event
        // mouse up would otherwise trigger both pan & tap
        if (this._shouldSkipNextTap) {
            this._shouldSkipNextTap = false;
            return;
        }

        const button = GestureView._toMouseButton(tapEvent);
        if (button === 2) {
            // Always handle secondary button, even if context menu is not set - it shouldn't trigger onTap.
            if (this.props.onContextMenu) {
                this.props.onContextMenu(tapEvent);
            }
        } else if (this.props.onTap) {
            this.props.onTap(tapEvent);
        }
    };

    protected _sendDoubleTapEvent(e: Types.TapGestureState) {
        // If user did a double click with different mouse buttons, eg. left (50ms) right
        // both clicks need to be registered as separate events.
        const lastButton = GestureView._toMouseButton(this._lastTapEvent!);
        const button = GestureView._toMouseButton(e);
        if (lastButton !== button || button === 2) {
            this._sendTapEvent(this._lastTapEvent!);
            return;
        }

        if (this.props.onDoubleTap) {
            this.props.onDoubleTap(e);
        }

        this._lastTapEvent = undefined;
    }
}

export default GestureView;
