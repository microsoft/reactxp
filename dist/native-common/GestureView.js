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
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var assert = require("assert");
var React = require("react");
var RN = require("react-native");
var Types = require("../common/Types");
var ViewBase_1 = require("./ViewBase");
var GestureType;
(function (GestureType) {
    GestureType[GestureType["None"] = 0] = "None";
    GestureType[GestureType["MultiTouch"] = 1] = "MultiTouch";
    GestureType[GestureType["Pan"] = 2] = "Pan";
    GestureType[GestureType["PanVertical"] = 3] = "PanVertical";
    GestureType[GestureType["PanHorizontal"] = 4] = "PanHorizontal";
})(GestureType || (GestureType = {}));
// These threshold values were chosen empirically.
var _pinchZoomPixelThreshold = 3;
var _panPixelThreshold = 10;
var _tapDurationThreshold = 500;
var _tapPixelThreshold = 4;
var _doubleTapDurationThreshold = 250;
var _doubleTapPixelThreshold = 20;
var GestureView = (function (_super) {
    __extends(GestureView, _super);
    function GestureView(props) {
        var _this = _super.call(this, props) || this;
        _this._doubleTapTimer = null;
        // State for tracking move gestures (pinch/zoom or pan)
        _this._pendingGestureType = GestureType.None;
        _this._pendingGestureState = null;
        // State for tracking double taps
        _this._lastTapEvent = null;
        // State for tracking single taps
        _this._lastGestureStartEvent = null;
        _this._setUpPanResponder();
        return _this;
    }
    GestureView.prototype.componentWillUnmount = function () {
        // Dispose of timer before the component goes away.
        this._cancelDoubleTapTimer();
    };
    GestureView.prototype._setUpPanResponder = function () {
        var _this = this;
        this._panResponder = RN.PanResponder.create({
            onStartShouldSetPanResponder: function (e, gestureState) {
                var event = e.nativeEvent;
                _this._lastGestureStartEvent = event;
                // If we're trying to detect a tap, set this as the responder immediately.
                if (_this.props.onTap || _this.props.onDoubleTap) {
                    return true;
                }
                return false;
            },
            onMoveShouldSetPanResponder: function (e, gestureState) {
                var event = e.nativeEvent;
                _this._lastGestureStartEvent = event;
                _this._pendingGestureType = _this._detectMoveGesture(event, gestureState);
                if (_this._pendingGestureType === GestureType.MultiTouch) {
                    // Handle multi-touch gestures.
                    _this._setPendingGestureState(_this._sendMultiTouchEvents(event, gestureState, true, false));
                    return true;
                }
                else if (_this._pendingGestureType === GestureType.Pan ||
                    _this._pendingGestureType === GestureType.PanVertical ||
                    _this._pendingGestureType === GestureType.PanHorizontal) {
                    // Handle a pan gesture.
                    _this._setPendingGestureState(_this._sendPanEvent(event, gestureState, _this._pendingGestureType, true, false));
                    return true;
                }
                return false;
            },
            onPanResponderRelease: function (e, gestureState) {
                _this._onPanResponderEnd(e, gestureState);
            },
            onPanResponderTerminate: function (e, gestureState) {
                _this._onPanResponderEnd(e, gestureState);
            },
            onPanResponderMove: function (e, gestureState) {
                var event = e.nativeEvent;
                var initializeFromEvent = false;
                // If this is the first movement we've seen, try to match it against
                // the various move gestures that we're looking for.
                if (_this._pendingGestureType === GestureType.None) {
                    _this._pendingGestureType = _this._detectMoveGesture(event, gestureState);
                    initializeFromEvent = true;
                }
                if (_this._pendingGestureType === GestureType.MultiTouch) {
                    _this._setPendingGestureState(_this._sendMultiTouchEvents(event, gestureState, initializeFromEvent, false));
                }
                else if (_this._pendingGestureType === GestureType.Pan ||
                    _this._pendingGestureType === GestureType.PanVertical ||
                    _this._pendingGestureType === GestureType.PanHorizontal) {
                    _this._setPendingGestureState(_this._sendPanEvent(event, gestureState, _this._pendingGestureType, initializeFromEvent, false));
                }
            },
            // Something else wants to become responder. Should this view release the responder?
            // Returning true allows release
            onPanResponderTerminationRequest: function (e) { return _this.props.releaseOnRequest; }
        });
    };
    GestureView.prototype._onPanResponderEnd = function (e, gestureState) {
        var event = e.nativeEvent;
        // Close out any of the pending move gestures.
        if (this._pendingGestureType === GestureType.MultiTouch) {
            this._sendMultiTouchEvents(event, gestureState, false, true);
            this._pendingGestureState = null;
            this._pendingGestureType = GestureType.None;
        }
        else if (this._pendingGestureType === GestureType.Pan ||
            this._pendingGestureType === GestureType.PanVertical ||
            this._pendingGestureType === GestureType.PanHorizontal) {
            this._sendPanEvent(event, gestureState, this._pendingGestureType, false, true);
            this._pendingGestureState = null;
            this._pendingGestureType = GestureType.None;
        }
        else if (this._isTap(event)) {
            if (!this.props.onDoubleTap) {
                // If there is no double-tap handler, we can invoke the tap handler immediately.
                this._sendTapEvent(event);
            }
            else if (this._isDoubleTap(event)) {
                // This is a double-tap, so swallow the previous single tap.
                this._cancelDoubleTapTimer();
                this._sendDoubleTapEvent(event);
                this._lastTapEvent = null;
            }
            else {
                // This wasn't a double-tap. Report any previous single tap and start the double-tap
                // timer so we can determine whether the current tap is a single or double.
                this._reportDelayedTap();
                this._startDoubleTapTimer(event);
            }
        }
        else {
            this._reportDelayedTap();
            this._cancelDoubleTapTimer();
        }
    };
    GestureView.prototype._setPendingGestureState = function (gestureState) {
        this._reportDelayedTap();
        this._cancelDoubleTapTimer();
        this._pendingGestureState = gestureState;
    };
    GestureView.prototype._detectMoveGesture = function (e, gestureState) {
        if (this._shouldRespondToPinchZoom(e, gestureState) || this._shouldRespondToRotate(e, gestureState)) {
            return GestureType.MultiTouch;
        }
        else if (this._shouldRespondToPan(gestureState)) {
            return GestureType.Pan;
        }
        else if (this._shouldRespondToPanVertical(gestureState)) {
            return GestureType.PanVertical;
        }
        else if (this._shouldRespondToPanHorizontal(gestureState)) {
            return GestureType.PanHorizontal;
        }
        return GestureType.None;
    };
    // Determines whether a touch event constitutes a tap. The "finger up"
    // event must be within a certain distance and within a certain time
    // from where the "finger down" event occurred.
    GestureView.prototype._isTap = function (e) {
        if (!this._lastGestureStartEvent) {
            return false;
        }
        var initialTimeStamp = this._getEventTimestamp(this._lastGestureStartEvent);
        var initialPageX = this._lastGestureStartEvent.pageX;
        var initialPageY = this._lastGestureStartEvent.pageY;
        var timeStamp = this._getEventTimestamp(e);
        return (timeStamp - initialTimeStamp <= _tapDurationThreshold &&
            this._calcDistance(initialPageX - e.pageX, initialPageY - e.pageY) <= _tapPixelThreshold);
    };
    // This method assumes that the caller has already determined that two
    // taps have been detected in a row with no intervening gestures. It
    // is responsible for determining if they occurred within close proximity
    // and within a certain threshold of time.
    GestureView.prototype._isDoubleTap = function (e) {
        var timeStamp = this._getEventTimestamp(e);
        if (!this._lastTapEvent) {
            return false;
        }
        return (timeStamp - this._getEventTimestamp(this._lastTapEvent) <= _doubleTapDurationThreshold &&
            this._calcDistance(this._lastTapEvent.pageX - e.pageX, this._lastTapEvent.pageY - e.pageY) <=
                _doubleTapPixelThreshold);
    };
    // Starts a timer that reports a previous tap if it's not canceled by a subsequent gesture.
    GestureView.prototype._startDoubleTapTimer = function (e) {
        var _this = this;
        this._lastTapEvent = e;
        this._doubleTapTimer = setTimeout(function () {
            _this._reportDelayedTap();
            _this._doubleTapTimer = null;
        }, _doubleTapDurationThreshold);
    };
    // Cancels any pending double-tap timer.
    GestureView.prototype._cancelDoubleTapTimer = function () {
        if (this._doubleTapTimer) {
            clearTimeout(this._doubleTapTimer);
            this._doubleTapTimer = null;
        }
    };
    // If there was a previous tap recorded but we haven't yet reported it because we were
    // waiting for a potential second tap, report it now.
    GestureView.prototype._reportDelayedTap = function () {
        if (this._lastTapEvent && this.props.onTap) {
            this._sendTapEvent(this._lastTapEvent);
            this._lastTapEvent = null;
        }
    };
    GestureView.prototype._shouldRespondToPinchZoom = function (e, gestureState) {
        if (!this.props.onPinchZoom) {
            return false;
        }
        // Do we see two touches?
        if (!e.touches || e.touches.length !== 2) {
            return false;
        }
        // Has the user started to pinch or zoom?
        if (this._calcDistance(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY) >=
            _pinchZoomPixelThreshold) {
            return true;
        }
        return false;
    };
    GestureView.prototype._shouldRespondToRotate = function (e, gestureState) {
        if (!this.props.onRotate) {
            return false;
        }
        // Do we see two touches?
        if (!e.touches || e.touches.length !== 2) {
            return false;
        }
        return true;
    };
    GestureView.prototype._shouldRespondToPan = function (gestureState) {
        if (!this.props.onPan) {
            return false;
        }
        // Has the user started to pan?
        var panThreshold = this.props.panPixelThreshold > 0 ? this.props.panPixelThreshold : _panPixelThreshold;
        return (this._calcDistance(gestureState.dx, gestureState.dy) >= panThreshold);
    };
    GestureView.prototype._shouldRespondToPanVertical = function (gestureState) {
        if (!this.props.onPanVertical) {
            return false;
        }
        // Has the user started to pan?
        var panThreshold = this.props.panPixelThreshold > 0 ? this.props.panPixelThreshold : _panPixelThreshold;
        var isPan = Math.abs(gestureState.dy) >= panThreshold;
        if (isPan && this.props.preferredPan === Types.PreferredPanGesture.Horizontal) {
            return Math.abs(gestureState.dy) > Math.abs(gestureState.dx * this._getPreferredPanRatio());
        }
        return isPan;
    };
    GestureView.prototype._shouldRespondToPanHorizontal = function (gestureState) {
        if (!this.props.onPanHorizontal) {
            return false;
        }
        // Has the user started to pan?
        var panThreshold = this.props.panPixelThreshold > 0 ? this.props.panPixelThreshold : _panPixelThreshold;
        var isPan = Math.abs(gestureState.dx) >= panThreshold;
        if (isPan && this.props.preferredPan === Types.PreferredPanGesture.Vertical) {
            return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * this._getPreferredPanRatio());
        }
        return isPan;
    };
    GestureView.prototype._calcDistance = function (dx, dy) {
        return Math.sqrt(dx * dx + dy * dy);
    };
    GestureView.prototype._calcAngle = function (touches) {
        var a = touches[0];
        var b = touches[1];
        var degrees = this._radiansToDegrees(Math.atan2(b.pageY - a.pageY, b.pageX - a.pageX));
        if (degrees < 0) {
            degrees += 360;
        }
        return degrees;
    };
    GestureView.prototype._radiansToDegrees = function (rad) {
        return rad * 180 / Math.PI;
    };
    GestureView.prototype._sendMultiTouchEvents = function (e, gestureState, initializeFromEvent, isComplete) {
        var p = this._pendingGestureState;
        var multiTouchEvent;
        // If the user lifted up one or both fingers, the multitouch gesture
        // is halted. Just return the existing gesture state.
        if (!e.touches || e.touches.length !== 2) {
            multiTouchEvent = p;
            p.isComplete = isComplete;
        }
        else {
            var centerPageX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
            var centerPageY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
            var centerClientX = (e.touches[0].locationX + e.touches[1].locationX) / 2;
            var centerClientY = (e.touches[0].locationY + e.touches[1].locationY) / 2;
            var width = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
            var height = Math.abs(e.touches[0].pageY - e.touches[1].pageY);
            var distance = this._calcDistance(width, height);
            var angle = this._calcAngle(e.touches);
            var initialCenterPageX = initializeFromEvent ? centerPageX : p.initialCenterPageX;
            var initialCenterPageY = initializeFromEvent ? centerPageY : p.initialCenterPageY;
            var initialCenterClientX = initializeFromEvent ? centerClientX : p.initialCenterClientX;
            var initialCenterClientY = initializeFromEvent ? centerClientY : p.initialCenterClientY;
            var initialWidth = initializeFromEvent ? width : p.initialWidth;
            var initialHeight = initializeFromEvent ? height : p.initialHeight;
            var initialDistance = initializeFromEvent ? distance : p.initialDistance;
            var initialAngle = initializeFromEvent ? angle : p.initialAngle;
            var velocityX = initializeFromEvent ? 0 : gestureState.vx;
            var velocityY = initializeFromEvent ? 0 : gestureState.vy;
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
    };
    GestureView.prototype._sendPanEvent = function (e, gestureState, gestureType, initializeFromEvent, isComplete) {
        var state = this._pendingGestureState;
        var pageX = e.pageX;
        var pageY = e.pageY;
        var clientX = e.locationX;
        var clientY = e.locationY;
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
        var initialPageX = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.pageX
            : initializeFromEvent ? pageX : state.initialPageX;
        var initialPageY = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.pageY
            : initializeFromEvent ? pageY : state.initialPageY;
        var initialClientX = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.locationX
            : initializeFromEvent ? clientX : state.initialClientX;
        var initialClientY = this._lastGestureStartEvent
            ? this._lastGestureStartEvent.locationY
            : initializeFromEvent ? clientY : state.initialClientY;
        var velocityX = initializeFromEvent ? 0 : gestureState.vx;
        var velocityY = initializeFromEvent ? 0 : gestureState.vy;
        var panEvent = {
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
        var callback = gestureType === GestureType.Pan ? this.props.onPan :
            (gestureType === GestureType.PanVertical ? this.props.onPanVertical :
                this.props.onPanHorizontal);
        callback(panEvent);
        return panEvent;
    };
    GestureView.prototype._sendTapEvent = function (e) {
        if (this.props.onTap) {
            var tapEvent = {
                pageX: e.pageX,
                pageY: e.pageY,
                clientX: e.locationX,
                clientY: e.locationY,
                timeStamp: e.timeStamp
            };
            this.props.onTap(tapEvent);
        }
    };
    GestureView.prototype._sendDoubleTapEvent = function (e) {
        if (this.props.onDoubleTap) {
            var tapEvent = {
                pageX: e.pageX,
                pageY: e.pageY,
                clientX: e.locationX,
                clientY: e.locationY,
                timeStamp: e.timeStamp
            };
            this.props.onDoubleTap(tapEvent);
        }
    };
    GestureView.prototype.render = function () {
        return (React.createElement(RN.View, __assign({ style: this._getStyles(this.props) }, this._panResponder.panHandlers), this.props.children));
    };
    return GestureView;
}(ViewBase_1.default));
exports.GestureView = GestureView;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GestureView;
