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

import GestureViewCommon, { GestureStatePoint, GestureStatePointVelocity, GestureType, TouchEventBasic,
    TouchListBasic } from '../common/GestureView';
import { Types } from '../common/Interfaces';

import AccessibilityUtil from './AccessibilityUtil';
import { clone } from './utils/lodashMini';
import MouseResponder, { MouseResponderSubscription } from './utils/MouseResponder';
import Styles from './Styles';

// Cast to any to allow merging of web and RX styles
const _styles = {
    defaultView: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        alignItems: 'stretch',
        justifyContent: 'center',
    } as any,
};

// Unique to web
const _preferredPanRatio = 3;

export interface GestureViewContext {
    isInRxMainView?: boolean;
}

let _idCounter = 1;

interface Point2D {
    x: number;
    y: number;
}

export abstract class GestureView extends GestureViewCommon {
    private _id = _idCounter++;
    private _isMounted = false;

    private _container: HTMLElement | null | undefined;

    private _initialTouch: Point2D | undefined;
    private _ongoingGesture: GestureStatePointVelocity | undefined;

    private _responder: MouseResponderSubscription | undefined;

    private _pendingMouseGestureType = GestureType.None;
    private _gestureTypeLocked = false;

    static contextTypes: React.ValidationMap<any> = {
        isInRxMainView: PropTypes.bool,
    };

    // Get preferred pan ratio for platform.
    protected _getPreferredPanRatio(): number {
        return _preferredPanRatio;
    }

    // Returns the timestamp for the touch event in milliseconds.
    protected _getEventTimestamp(e: Types.TouchEvent | Types.MouseEvent): number {
        return e.timeStamp;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this._isMounted = false;
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
                onTouchStart={ this._onTouchStart }
                onTouchMove={ this._onTouchMove }
                onTouchEnd={ this._onTouchEnd }
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
                this._pendingMouseGestureType = this._detectGestureType(gestureState);
                if (this._pendingMouseGestureType !== GestureType.None) {
                    this._cancelLongPressTimer();
                }

                this._sendMousePanEvent(gestureState);
            },
            onTerminate: (event: MouseEvent, gestureState: Types.PanGestureState) => {
                this._cancelLongPressTimer();

                this._pendingMouseGestureType = this._detectGestureType(gestureState);
                this._sendMousePanEvent(gestureState);

                this._pendingMouseGestureType = GestureType.None;
                this._gestureTypeLocked = false;
            },
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
    };

    private _getStyles(): any {
        const combinedStyles = Styles.combine([_styles.defaultView, this.props.style]);

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

            case Types.GestureMouseCursor.NSResize:
                cursorName = 'ns-resize';
                break;

            case Types.GestureMouseCursor.EWResize:
                cursorName = 'ew-resize';
                break;

            case Types.GestureMouseCursor.NESWResize:
                cursorName = 'nesw-resize';
                break;

            case Types.GestureMouseCursor.NWSEResize:
                cursorName = 'nwse-resize';
                break;

            case Types.GestureMouseCursor.NotAllowed:
                cursorName = 'not-allowed';
                break;

            case Types.GestureMouseCursor.ZoomIn:
                cursorName = 'zoom-in';
                break;

            case Types.GestureMouseCursor.ZoomOut:
                cursorName = 'zoom-out';
                break;
        }

        if (cursorName) {
            combinedStyles.cursor = cursorName;
        }

        return combinedStyles;
    }

    private _onMouseDown = (e: React.MouseEvent<any>) => {
        if (this.props.onPan || this.props.onPanHorizontal || this.props.onPanVertical) {
            // Disable mousedown default action that initiates a drag/drop operation and breaks panning with a not-allowed cursor.
            // https://w3c.github.io/uievents/#mousedown
            e.preventDefault();
        }

        if (this.props.onLongPress) {
            const gsState = this._mouseEventToTapGestureState(e);
            this._startLongPressTimer(gsState, true);
        }
    };

    private _onClick = (e: React.MouseEvent<any>) => {
        this._cancelLongPressTimer();

        const gsState = this._mouseEventToTapGestureState(e);

        if (!this.props.onDoubleTap) {
            // If there is no double-tap handler, we can invoke the tap handler immediately.
            this._sendTapEvent(gsState);
        } else if (this._isDoubleTap(gsState)) {
            // This is a double-tap, so swallow the previous single tap.
            this._cancelDoubleTapTimer();
            this._sendDoubleTapEvent(gsState);
        } else {
            // This wasn't a double-tap. Report any previous single tap and start the double-tap
            // timer so we can determine whether the current tap is a single or double.
            this._reportDelayedTap();
            this._startDoubleTapTimer(gsState);
        }
    };

    private _sendContextMenuEvent = (e: React.MouseEvent<any>) => {
        if (this.props.onContextMenu) {
            e.preventDefault();
            e.stopPropagation();

            const tapEvent = this._mouseEventToTapGestureState(e);
            this.props.onContextMenu(tapEvent);
        }
    };

    // The RN and React touch event types are basically identical except that React uses "clientX/Y"
    // and RN uses "locationX/Y", so we need to map one to the other.  Unfortunately, due to inertia,
    // web loses.  So, we need these 3 ugly functions...
    private static _reactTouchEventToBasic(e: React.TouchEvent<any>): TouchEventBasic {
        const ne = clone(e) as any as TouchEventBasic;
        ne.changedTouches = this._mapReactTouchListToBasic(e.changedTouches);
        ne.targetTouches = this._mapReactTouchListToBasic(e.targetTouches);
        ne.touches = this._mapReactTouchListToBasic(e.touches);
        const ft = ne.touches[0];
        if (ft) {
            // RN also apparently shims the first touch's location info onto the root touch event
            ne.pageX = ft.pageX;
            ne.pageY = ft.pageY;
            ne.locationX = ft.locationX;
            ne.locationY = ft.locationY;
        }
        return ne;
    }

    private static _mapReactTouchListToBasic(l: React.TouchList): TouchListBasic {
        const nl: Types.Touch[] = new Array(l.length);
        for (let i = 0; i < l.length; i++) {
            nl[i] = this._mapReactTouchToRx(l[i]);
        }
        return nl;
    }

    private static _mapReactTouchToRx(l: React.Touch): Types.Touch {
        return {
            identifier: l.identifier,
            locationX: l.clientX,
            locationY: l.clientY,
            screenX: l.screenX,
            screenY: l.screenY,
            clientX: l.clientX,
            clientY: l.clientY,
            pageX: l.pageX,
            pageY: l.pageY,
        };
    }

    private _onTouchStart = (e: React.TouchEvent<any>) => {
        if (!this._initialTouch) {
            const ft = e.touches[0];
            this._initialTouch = { x: ft.clientX, y: ft.clientY };
            this._ongoingGesture = { dx: 0, dy: 0, vx: 0, vy: 0 };

            this._onTouchSeriesStart(GestureView._reactTouchEventToBasic(e));
        }
    };

    private _onTouchMove = (e: React.TouchEvent<any>) => {
        if (!this._initialTouch || !this._ongoingGesture) {
            return;
        }

        const ft = e.touches[0];
        this._ongoingGesture = {
            dx: ft.clientX - this._initialTouch.x,
            dy: ft.clientY - this._initialTouch.y,
            // TODO: calculate velocity?
            vx: 0,
            vy: 0,
        };
        this._onTouchChange(GestureView._reactTouchEventToBasic(e), this._ongoingGesture);
    };

    private _onTouchEnd = (e: React.TouchEvent<any>) => {
        if (!this._initialTouch || !this._ongoingGesture) {
            return;
        }

        if (e.touches.length === 0) {
            this._onTouchSeriesFinished(GestureView._reactTouchEventToBasic(e), this._ongoingGesture);
            this._initialTouch = undefined;
            this._ongoingGesture = undefined;
        }
    };

    private _detectGestureType = (gestureState: Types.PanGestureState) => {
        // we need to lock gesture type until it's completed
        if (this._gestureTypeLocked) {
            return this._pendingMouseGestureType;
        }

        this._gestureTypeLocked = true;

        const gsBasic: GestureStatePoint = {
            dx: gestureState.clientX - gestureState.initialClientX,
            dy: gestureState.clientY - gestureState.initialClientY,
        };

        if (this._shouldRespondToPan(gsBasic)) {
            return GestureType.Pan;
        } else if (this._shouldRespondToPanVertical(gsBasic)) {
            return GestureType.PanVertical;
        } else if (this._shouldRespondToPanHorizontal(gsBasic)) {
            return GestureType.PanHorizontal;
        }

        this._gestureTypeLocked = false;
        return GestureType.None;
    };

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
                    isTouch: false,
                };

                this.props.onScrollWheel(scrollWheelEvent);
            }
        }
    };

    private _sendMousePanEvent = (gestureState: Types.PanGestureState) => {
        switch (this._pendingMouseGestureType) {
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
        if (this._pendingMouseGestureType !== GestureType.None) {
            this._clearLastTap();
            this._cancelDoubleTapTimer();
            this._skipNextTap();
        }
    };

    protected _getClientXYOffset(): { x: number; y: number } {
        const rect = this._getGestureViewClientRect();
        return rect ? { x: rect.left, y: rect.top } : { x: 0, y: 0 };
    }

    private _getGestureViewClientRect() {
        return this._container ? this._container.getBoundingClientRect() : null;
    }
}

export default GestureView;
