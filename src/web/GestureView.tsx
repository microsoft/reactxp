/**
 * GestureView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform GestureView component.
 * It provides support for the scroll wheel, clicks and double clicks.
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import AccessibilityUtil from './AccessibilityUtil';
import { Types } from '../common/Interfaces';
import { clone, isUndefined } from './utils/lodashMini';
import MouseResponder, { MouseResponderSubscription } from './utils/MouseResponder';
import Styles from './Styles';
import Timers from '../common/utils/Timers';

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

const _longPressDurationThreshold = 750;
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

export interface GestureViewContext {
    isInRxMainView?: boolean;
}

let _idCounter = 1;

export class GestureView extends React.Component<Types.GestureViewProps, Types.Stateless> {
    private _id = _idCounter++;
    private _isMounted = false;

    private _container: HTMLElement | null |   undefined;

    // State for tracking long presses
    private _pendingLongPressEvent: React.MouseEvent<any> | undefined;
    private _longPressTimer: number | undefined;

    // State for tracking double taps
    private _doubleTapTimer: number | undefined;
    private _lastTapEvent: React.MouseEvent<any> | undefined;

    private _responder: MouseResponderSubscription | undefined;

    // private _pendingGestureState: Types.PanGestureState = null;
    private _pendingGestureType = GestureType.None;
    private _gestureTypeLocked = false;
    private _skipNextTap = false;

    static contextTypes: React.ValidationMap<any> = {
        isInRxMainView: PropTypes.bool
    };

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        // Dispose of timer before the component goes away.
        this._cancelDoubleTapTimer();
    }

    render() {
        const ariaRole = AccessibilityUtil.accessibilityTraitToString(this.props.accessibilityTraits);
        const isAriaHidden = AccessibilityUtil.isHidden(this.props.importantForAccessibility);

        return (
            <div
                style={ this._getStyles() }
                tabIndex={ this.props.tabIndex }
                ref={ this._setContainerRef }
                onMouseDown={ this._onMouseDown }
                onClick={ this._onClick }
                onWheel={ this._onWheel }
                onFocus={ this.props.onFocus }
                onBlur={ this.props.onBlur }
                onKeyPress={ this.props.onKeyPress }
                role={ ariaRole }
                aria-label={ this.props.accessibilityLabel }
                aria-hidden={ isAriaHidden }
                onContextMenu={ this.props.onContextMenu ? this._sendContextMenuEvent : undefined }
                data-test-id={ this.props.testId }
            >
                { this.props.children }
            </div>
        );
    }

    blur() {
        const el = this._getContainer();
        if (el) {
            el.blur();
        }
    }

    focus() {
        const el = this._getContainer();
        if (el) {
            el.focus();
        }
    }

    protected _getContainer(): HTMLElement | null {
        if (!this._isMounted) {
            return null;
        }
        try {
            return ReactDOM.findDOMNode(this) as HTMLElement | null;
        } catch {
            // Handle exception due to potential unmount race condition.
            return null;
        }
    }

    private _createMouseResponder(container: HTMLElement) {
        this._disposeMouseResponder();

        this._responder = MouseResponder.create({
            id: this._id,
            target: container,
            disableWhenModal: !!this.context.isInRxMainView,
            shouldBecomeFirstResponder: (event: MouseEvent) => {
                if (!this.props.onPan && !this.props.onPanHorizontal && !this.props.onPanVertical) {
                    return false;
                }

                const boundingRect = this._getGestureViewClientRect();
                if (!boundingRect) {
                    return false;
                }

                const { top, left, bottom, right } = boundingRect;
                const { clientX, clientY } = event;

                if (clientX >= left && clientX <= right && clientY >= top && clientY <= bottom) {
                    return true;
                }

                return false;
            },
            onMove: (event: MouseEvent, gestureState: Types.PanGestureState) => {
                this._pendingGestureType = this._detectGestureType(gestureState);
                if (this._pendingGestureType !== GestureType.None) {
                    this._cancelLongPressTimer();
                }

                this._sendPanEvent(gestureState);
            },
            onTerminate: (event: MouseEvent, gestureState: Types.PanGestureState) => {
                this._cancelLongPressTimer();

                this._pendingGestureType = this._detectGestureType(gestureState);
                this._sendPanEvent(gestureState);

                this._pendingGestureType = GestureType.None;
                this._gestureTypeLocked = false;
            }
        });
    }

    private _disposeMouseResponder() {
        if (this._responder) {
            this._responder.dispose();
            delete this._responder;
        }
    }

    private _setContainerRef = (container: HTMLElement | null) => {
        // safe since div refs resolve into HTMLElement and not react element.
        this._container = container;

        if (container) {
            this._createMouseResponder(container);
        } else {
            this._disposeMouseResponder();
        }
    }

    private _getStyles(): any {
        const combinedStyles = Styles.combine([_styles.defaultView, this.props.style]) as any;

        let cursorName: string | undefined;
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
            combinedStyles.cursor = cursorName;
        }

        return combinedStyles;
    }

    private _onMouseDown = (e: React.MouseEvent<any>) => {
        if (this.props.onLongPress) {
            this._startLongPressTimer(e);
        }
    }

    private _onClick = (e: React.MouseEvent<any>) => {
        this._cancelLongPressTimer();

        if (!this.props.onDoubleTap) {
            // If there is no double-tap handler, we can invoke the tap handler immediately.
            this._sendTapEvent(e);
        } else if (this._isDoubleTap(e)) {
            // This is a double-tap, so swallow the previous single tap.
            this._cancelDoubleTapTimer();
            this._sendDoubleTapEvent(e);
            this._lastTapEvent = undefined;
        } else {
            // This wasn't a double-tap. Report any previous single tap and start the double-tap
            // timer so we can determine whether the current tap is a single or double.
            this._reportDelayedTap();
            this._startDoubleTapTimer(e);
        }
    }

    private _sendContextMenuEvent = (e: React.MouseEvent<any>) => {
        if (this.props.onContextMenu) {
            e.preventDefault();
            e.stopPropagation();

            const clientRect = this._getGestureViewClientRect();

            if (clientRect) {
                const tapEvent: Types.TapGestureState = {
                    pageX: e.pageX,
                    pageY: e.pageY,
                    clientX: e.clientX - clientRect.left,
                    clientY: e.clientY - clientRect.top,
                    timeStamp: e.timeStamp,
                    isTouch: false
                };

                this.props.onContextMenu(tapEvent);
            }
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
        return (!isUndefined(this.props.panPixelThreshold) && this.props.panPixelThreshold > 0) ?
            this.props.panPixelThreshold : _panPixelThreshold;
    }

    private _shouldRespondToPan(gestureState: Types.PanGestureState): boolean {
        if (!this.props.onPan) {
            return false;
        }

        const threshold = this._getPanPixelThreshold();
        const distance = this._calcDistance(
            gestureState.clientX - gestureState.initialClientX,
            gestureState.clientY - gestureState.initialClientY
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

    private _onWheel = (e: React.WheelEvent<any>) => {
        if (this.props.onScrollWheel) {
            const clientRect = this._getGestureViewClientRect();

            if (clientRect) {
                const scrollWheelEvent: Types.ScrollWheelGestureState = {
                    clientX: e.clientX - clientRect.left,
                    clientY: e.clientY - clientRect.top,
                    pageX: e.pageX,
                    pageY: e.pageY,
                    scrollAmount: e.deltaY,
                    timeStamp: e.timeStamp,
                    isTouch: false
                };

                this.props.onScrollWheel(scrollWheelEvent);
            }
        }
    }

    private _calcDistance(dx: number, dy: number) {
        return Math.sqrt(dx * dx + dy * dy);
    }

    // This method assumes that the caller has already determined that two
    // clicks have been detected in a row. It is responsible for determining if
    // they occurred within close proximity and within a certain threshold of time.
    private _isDoubleTap(e: React.MouseEvent<any>) {
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

    private _startLongPressTimer(event: React.MouseEvent<any>) {
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

    // Starts a timer that reports a previous tap if it's not canceled by a subsequent gesture.
    private _startDoubleTapTimer(e: React.MouseEvent<any>) {
        this._lastTapEvent = clone(e);

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
                pageX: this._pendingLongPressEvent!.pageX,
                pageY: this._pendingLongPressEvent!.pageY,
                clientX: this._pendingLongPressEvent!.clientX,
                clientY: this._pendingLongPressEvent!.clientY,
                timeStamp: this._pendingLongPressEvent!.timeStamp,
                isTouch: false
            };

            this.props.onLongPress(tapEvent);
        }

        this._pendingLongPressEvent = undefined;
    }

    private _sendTapEvent(e: React.MouseEvent<any>) {
        // we need to skip tap after succesfull pan event
        // mouse up would otherwise trigger both pan & tap
        if (this._skipNextTap) {
            this._skipNextTap = false;
            return;
        }

        if (this.props.onTap) {
            const clientRect = this._getGestureViewClientRect();

            if (clientRect) {
                const tapEvent: Types.TapGestureState = {
                    pageX: e.pageX,
                    pageY: e.pageY,
                    clientX: e.clientX - clientRect.left,
                    clientY: e.clientY - clientRect.top,
                    timeStamp: e.timeStamp,
                    isTouch: false
                };

                this.props.onTap(tapEvent);
            }
        }
    }

    private _sendDoubleTapEvent(e: React.MouseEvent<any>) {
        if (this.props.onDoubleTap) {
            const clientRect = this._getGestureViewClientRect();

            if (clientRect) {
                const tapEvent: Types.TapGestureState = {
                    pageX: e.pageX,
                    pageY: e.pageY,
                    clientX: e.clientX - clientRect.left,
                    clientY: e.clientY - clientRect.top,
                    timeStamp: e.timeStamp,
                    isTouch: false
                };

                this.props.onDoubleTap(tapEvent);
            }
        }
    }

    private _sendPanEvent = (gestureState: Types.PanGestureState) => {
        switch (this._pendingGestureType) {
            case GestureType.Pan:
                if (this.props.onPan) {
                    this.props.onPan(gestureState);
                }
                break;
            case GestureType.PanVertical:
                if (this.props.onPanVertical) {
                    this.props.onPanVertical(gestureState);
                }
                break;
            case GestureType.PanHorizontal:
                if (this.props.onPanHorizontal) {
                    this.props.onPanHorizontal(gestureState);
                }
                break;

            default:
                // do nothing;
        }

        // we need to clean taps in case there was a pan event in the meantime
        if (this._pendingGestureType !== GestureType.None) {
            this._lastTapEvent = undefined;
            this._cancelDoubleTapTimer();
            this._skipNextTap = true;
        }
    }

    private _getGestureViewClientRect() {
        return this._container ? this._container.getBoundingClientRect() : null;
    }
}

export default GestureView;
