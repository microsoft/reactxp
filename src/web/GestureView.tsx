/**
* GestureView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform GestureView component.
* It provides support for the scroll wheel, clicks and double clicks.
*/

import _ = require('./utils/lodashMini');
import React = require('react');

import AccessibilityUtil from './AccessibilityUtil';
import MouseResponder, { MouseResponderSubscription } from './utils/MouseResponder';
import RX = require('../common/Interfaces');
import Styles from './Styles';
import Types = require('../common/Types');

const _styles = {
    defaultView: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        alignItems: 'stretch',
        justifyContent: 'center'
    }
};

const _doubleTapDurationThreshold = 250;
const _doubleTapPixelThreshold = 20;
const _panPixelThreshold = 10;
const _preferredPanRatio = 3;

enum GestureType {
    None,
    Pan,
    PanVertical,
    PanHorizontal
}

let _idCounter = 1;

export class GestureView extends RX.ViewBase<Types.GestureViewProps, {}> {

    private _id: number;

    private _container: HTMLElement;
    // State for tracking double taps
    private _doubleTapTimer: any = null;
    private _lastTapEvent: Types.MouseEvent = null;

    private _responder: MouseResponderSubscription;

    // private _pendingGestureState: Types.PanGestureState = null;
    private _pendingGestureType = GestureType.None;
    private _gestureTypeLocked = false;
    private _skipNextTap = false;

    componentDidMount() {
        this._id = _idCounter++;
        this._responder = MouseResponder.create({
            id: this._id,
            target: this._container,
            shouldBecomeFirstResponder: (event: MouseEvent) => {
                if (!this.props.onPan && !this.props.onPanHorizontal && !this.props.onPanVertical) {
                    return false;
                }
                
                const { top, left, bottom, right } = this._container.getBoundingClientRect();
                const { clientX, clientY } = event;

                if (clientX >= left && clientX <= right && clientY >= top && clientY <= bottom) {
                    return true;
                }

                return false;
            },
            onMove: (event: MouseEvent, gestureState: Types.PanGestureState) => {
                this._pendingGestureType = this._detectGestureType(gestureState);
                this._sendPanEvent(gestureState);
            },
            onTerminate: (event: MouseEvent, gestureState: Types.PanGestureState) => {
                this._pendingGestureType = this._detectGestureType(gestureState);
                this._sendPanEvent(gestureState);

                this._pendingGestureType = GestureType.None;
                this._gestureTypeLocked = false;
            }
        });
    }

    componentWillUnmount() {
        // Dispose of timer before the component goes away.
        this._cancelDoubleTapTimer();
        if (this._responder) {
            this._responder.dispose();
        }
    }

    render() {
        const ariaRole = AccessibilityUtil.accessibilityTraitToString(this.props.accessibilityTraits);
        const isAriaHidden = AccessibilityUtil.isHidden(this.props.importantForAccessibility);

        return (
            <div
                style={ this._getStyles() }
                ref={ this._setContainerRef }
                onClick={ this._onClick }
                onWheel={ this._onWheel }
                role={ ariaRole }
                aria-label={ this.props.accessibilityLabel }
                aria-hidden={ isAriaHidden }
            >
                { this.props.children }
            </div>
        );
    }

    private _setContainerRef = (container: React.DOMComponent<React.HTMLAttributes>) => {
        // safe since div refs resolve into HTMLElement and not react element.
        this._container = container as any as HTMLElement;
    }

    private _getStyles(): any {
        let combinedStyles = Styles.combine([_styles.defaultView, this.props.style]) as any;

        let cursorName: string = null;
        switch (this.props.mouseOverCursor) {
            case Types.GestureMouseCursor.Grab:
                cursorName = 'grab';
                break;

            case Types.GestureMouseCursor.Move:
                cursorName = 'move';
                break;

            case Types.GestureMouseCursor.Pointer:
                cursorName = 'pointer';
                break;
        }

        if (cursorName) {
            combinedStyles['cursor'] = cursorName;
        }

        return combinedStyles;
    }

    private _onClick = (e: Types.MouseEvent) => {
        if (!this.props.onDoubleTap) {
            // If there is no double-tap handler, we can invoke the tap handler immediately.
            this._sendTapEvent(e);
        } else if (this._isDoubleTap(e)) {
            // This is a double-tap, so swallow the previous single tap.
            this._cancelDoubleTapTimer();
            this._sendDoubleTapEvent(e);
            this._lastTapEvent = null;
        } else {
            // This wasn't a double-tap. Report any previous single tap and start the double-tap
            // timer so we can determine whether the current tap is a single or double.
            this._reportDelayedTap();
            this._startDoubleTapTimer(e);
        }
    }

    private _detectGestureType = (gestureState: Types.PanGestureState) => {
        // we need to lock gesture type until it's completed
        if (this._gestureTypeLocked) {
            return this._pendingGestureType;
        }

        this._gestureTypeLocked = true;

        if (this._shouldRespondToPan(gestureState)) {
            return GestureType.Pan;
        } else if (this._shouldRespondToPanVertical(gestureState)) {
            return GestureType.PanVertical;
        } else if (this._shouldRespondToPanHorizontal(gestureState)) {
            return GestureType.PanHorizontal;
        }

        this._gestureTypeLocked = false;
        return GestureType.None;
    }

    private _getPanPixelThreshold = () => {
        return this.props.panPixelThreshold > 0 ? this.props.panPixelThreshold : _panPixelThreshold;
    }

    private _shouldRespondToPan(gestureState: Types.PanGestureState): boolean {
        if (!this.props.onPan) {
            return false;
        }

        const threshold = this._getPanPixelThreshold();
        const distance = this._calcDistance(
            gestureState.clientX - gestureState.initialClientX,
            gestureState.clientY - gestureState.initialClientY,
        );

        if (distance < threshold) {
            return false;
        }

        return true;
    }

    private _shouldRespondToPanVertical(gestureState: Types.PanGestureState) {
        if (!this.props.onPanVertical) {
            return false;
        }

        const dx = gestureState.clientX - gestureState.initialClientX;
        const dy = gestureState.clientY - gestureState.initialClientY;

        // Has the user started to pan?
        const panThreshold = this._getPanPixelThreshold();
        const isPan = Math.abs(dy) >= panThreshold;

        if (isPan && this.props.preferredPan === Types.PreferredPanGesture.Horizontal) {
            return Math.abs(dy) > Math.abs(dx * _preferredPanRatio);
        }
        return isPan;
    }

    private _shouldRespondToPanHorizontal(gestureState: Types.PanGestureState) {
        if (!this.props.onPanHorizontal) {
            return false;
        }

        const dx = gestureState.clientX - gestureState.initialClientX;
        const dy = gestureState.clientY - gestureState.initialClientY;

        // Has the user started to pan?
        const panThreshold = this._getPanPixelThreshold();
        const isPan = Math.abs(dx) >= panThreshold;

        if (isPan && this.props.preferredPan === Types.PreferredPanGesture.Vertical) {
            return Math.abs(dx) > Math.abs(dy * _preferredPanRatio);
        }
        return isPan;
    }

    private _onWheel = (e: React.WheelEvent) => {
        if (this.props.onScrollWheel) {
            const clientRect = this._getGestureViewClientRect();
            const scrollWheelEvent: Types.ScrollWheelGestureState = {
                clientX: e.clientX - clientRect.left,
                clientY: e.clientY - clientRect.top,
                pageX: e.pageX,
                pageY: e.pageY,
                scrollAmount: e.deltaY,
                timeStamp: e.timeStamp
            };

            this.props.onScrollWheel(scrollWheelEvent);
        }
    }

    private _calcDistance(dx: number, dy: number) {
        return Math.sqrt(dx * dx + dy * dy);
    }

    // This method assumes that the caller has already determined that two
    // clicks have been detected in a row. It is responsible for determining if
    // they occurred within close proximity and within a certain threshold of time.
    private _isDoubleTap(e: Types.MouseEvent) {
        const timeStamp = e.timeStamp.valueOf();
        const pageX = e.pageX;
        const pageY = e.pageY;

        if (!this._lastTapEvent) {
            return false;
        }

        return (timeStamp - this._lastTapEvent.timeStamp.valueOf() <= _doubleTapDurationThreshold &&
            this._calcDistance(this._lastTapEvent.pageX - pageX, this._lastTapEvent.pageY - pageY) <=
                _doubleTapPixelThreshold);
    }

    // Starts a timer that reports a previous tap if it's not canceled by a subsequent gesture.
    private _startDoubleTapTimer(e: Types.MouseEvent) {
        this._lastTapEvent = _.clone(e);

        this._doubleTapTimer = window.setTimeout(() => {
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

    private _sendTapEvent(e: Types.MouseEvent) {
        // we need to skip tap after succesfull pan event
        // mouse up would otherwise trigger both pan & tap
        if (this._skipNextTap) {
            this._skipNextTap = false;
            return;
        }

        if (this.props.onTap) {
            const clientRect = this._getGestureViewClientRect();
            const tapEvent: Types.TapGestureState = {
                pageX: e.pageX,
                pageY: e.pageY,
                clientX: e.clientX - clientRect.left,
                clientY: e.clientY - clientRect.top,
                timeStamp: e.timeStamp
            };

            this.props.onTap(tapEvent);
        }
    }

    private _sendDoubleTapEvent(e: Types.MouseEvent) {
        if (this.props.onDoubleTap) {
            const clientRect = this._getGestureViewClientRect();
            const tapEvent: Types.TapGestureState = {
                pageX: e.pageX,
                pageY: e.pageY,
                clientX: e.clientX - clientRect.left,
                clientY: e.clientY - clientRect.top,
                timeStamp: e.timeStamp
            };

            this.props.onDoubleTap(tapEvent);
        }
    }

    private _sendPanEvent = (gestureState: Types.PanGestureState) => {
        switch (this._pendingGestureType) {
            case GestureType.Pan:
                this.props.onPan(gestureState);
                break;
            case GestureType.PanVertical:
                this.props.onPanVertical(gestureState);
                break;
            case GestureType.PanHorizontal:
                this.props.onPanHorizontal(gestureState);
                break;

            default:
                // do nothing;
        }

        // we need to clean taps in case there was a pan event in the meantime
        if (this._pendingGestureType !== GestureType.None) {
            this._lastTapEvent = null;
            this._cancelDoubleTapTimer();
            this._skipNextTap = true;
        }
    }

    private _getGestureViewClientRect() {
        return this._container.getBoundingClientRect();
    }
}

export default GestureView;
