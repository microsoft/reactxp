/**
 * RootView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * The top-most view (rendered into window.body) that's used for proper
 * layering or modals, etc. in the web implementation of the ReactXP
 * cross-platform library.
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import AccessibilityAnnouncer from './AccessibilityAnnouncer';
import FocusManager from './utils/FocusManager';
import Input from './Input';
import { Types } from '../common/Interfaces';
import * as _ from './utils/lodashMini';
import ModalContainer from './ModalContainer';
import PopupContainerView from './PopupContainerView';
import Timers from '../common/utils/Timers';
import UserInterface from './UserInterface';

export class PopupDescriptor {
    constructor(public popupId: string, public popupOptions: Types.PopupOptions) {}
}

export interface RootViewProps extends Types.CommonProps {
    mainView?: React.ReactNode;
    modal?: React.ReactElement<Types.ViewProps>;
    activePopup?: PopupDescriptor;
    cachedPopup?: PopupDescriptor[];
    autoDismiss?: boolean;
    autoDismissDelay?: number;
    onDismissPopup?: () => void;
    keyBoardFocusOutline?: string;
    mouseFocusOutline?: string;
    writingDirection?: 'auto' | 'rtl' | 'ltr';
}

export interface RootViewState {
    // We need to measure the popup before it can be positioned. This indicates that we're in the "measuring" phase.
    isMeasuringPopup: boolean;

    // Measured (unconstrained) dimensions of the popup; not valid if isMeasuringPopup is false.
    popupWidth: number;
    popupHeight: number;

    // Position of popup relative to its anchor (top, bottom, left, right)
    anchorPosition: Types.PopupPosition;

    // Top or left offset of the popup relative to the center of the anchor
    anchorOffset: number;

    // Absolute window location of the popup
    popupTop: number;
    popupLeft: number;

    // Constrained dimensions of the popup once it is placed
    constrainedPopupWidth: number;
    constrainedPopupHeight: number;

    // Assign css focus class if focus is due to Keyboard or mouse
    focusClass: string | undefined;
}

// Width of the "alley" around popups so they don't get too close to the boundary of the window.
const _popupAlleyWidth = 8;

// How close to the edge of the popup should we allow the anchor offset to get before
// attempting a different position?
const _minAnchorOffset = 16;

// Button code for when right click is pressed in a mouse event
const _rightClickButtonCode = 2;

const KEY_CODE_TAB = 9;
const KEY_CODE_ESC = 27;

// Setting the expected default box-sizing for everything.
if (typeof document !== 'undefined') {
    const defaultBoxSizing = '*, *:before, *:after { box-sizing: border-box; }';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(defaultBoxSizing));
    document.head.appendChild(style);
}

export interface MainViewContext {
    isInRxMainView?: boolean;
}

// This helper class wraps the main view and passes a boolean value
// "isInRxMainView" to all children found within it. This is used to
// prevent gesture handling within the main view when a modal is displayed.
export class MainViewContainer extends React.Component<Types.CommonProps, Types.Stateless>
        implements React.ChildContextProvider<MainViewContext> {
    static childContextTypes: React.ValidationMap<any> = {
        isInRxMainView: PropTypes.bool
    };

    getChildContext(): MainViewContext {
        return {
            isInRxMainView: true
        };
    }

    render() {
        return (
            this.props.children
        );
    }
}

export class RootView extends React.Component<RootViewProps, RootViewState> {
    static childContextTypes: React.ValidationMap<any> = {
        focusManager: PropTypes.object
    };

    private _mountedComponent: Element | undefined;
    private _hidePopupTimer: number | undefined;
    private _respositionPopupTimer: number | undefined;
    private _clickHandlerInstalled = false;
    private _keyboardHandlerInstalled = false;
    private _focusManager: FocusManager;
    private _isNavigatingWithKeyboardUpateTimer: number | undefined;

    private _shouldEnableKeyboardNavigationModeOnFocus = false;
    private _applicationIsNotActive = false;
    private _applicationIsNotActiveTimer: number | undefined;
    private _prevFocusedElement: HTMLElement | undefined;
    private _updateKeyboardNavigationModeOnFocusTimer: number | undefined;

    constructor(props: RootViewProps) {
        super(props);

        this.state = this._getInitialState();

        // Initialize the root FocusManager which is aware of all
        // focusable elements.
        this._focusManager = new FocusManager(undefined);
    }

    getChildContext() {
        // Provide the context with root FocusManager to all descendants.
        return {
            focusManager: this._focusManager
        };
    }

    private _getInitialState(): RootViewState {
        return {
            isMeasuringPopup: true,
            anchorPosition: 'left',
            anchorOffset: 0,
            popupTop: 0,
            popupLeft: 0,
            popupWidth: 0,
            popupHeight: 0,
            constrainedPopupWidth: 0,
            constrainedPopupHeight: 0,
            focusClass: this.props.mouseFocusOutline
        };
    }

    componentWillReceiveProps(prevProps: RootViewProps) {
        if (this.props.activePopup !== prevProps.activePopup) {
            this._stopHidePopupTimer();

            // If the popup changes, reset our state.
            this.setState(this._getInitialState());
        }
    }

    componentDidUpdate(prevProps: RootViewProps, prevState: RootViewState) {
        if (this.props.activePopup) {
            this._stopHidePopupTimer();
            this._recalcPosition();

            if (!this._respositionPopupTimer) {
                this._startRepositionPopupTimer();
            }

            if (!this._clickHandlerInstalled) {
                document.addEventListener('mousedown', this._tryClosePopup);
                document.addEventListener('touchstart', this._tryClosePopup);
                this._clickHandlerInstalled = true;
            }
        } else {
            this._stopRepositionPopupTimer();

            if (this._clickHandlerInstalled) {
                document.removeEventListener('mousedown', this._tryClosePopup);
                document.removeEventListener('touchstart', this._tryClosePopup);
                this._clickHandlerInstalled = false;
            }
        }
    }

    componentDidMount() {
        if (this.props.activePopup) {
            this._recalcPosition();
        }

        if (this.props.activePopup) {
            this._startRepositionPopupTimer();
        }

        if (!this._keyboardHandlerInstalled) {
            window.addEventListener('keydown', this._onKeyDown);
            window.addEventListener('keyup', this._onKeyUp);

            window.addEventListener('keydown', this._onKeyDownCapture, true); // Capture!
            window.addEventListener('mousedown', this._onMouseDownCapture, true); // Capture!
            window.addEventListener('focusin', this._onFocusIn);
            window.addEventListener('focusout', this._onFocusOut);

            this._keyboardHandlerInstalled = true;
        }
    }

    componentWillUnmount() {
        this._stopHidePopupTimer();
        this._stopRepositionPopupTimer();

        if (this._keyboardHandlerInstalled) {
            window.removeEventListener('keydown', this._onKeyDown);
            window.removeEventListener('keyup', this._onKeyUp);

            window.removeEventListener('keydown', this._onKeyDownCapture, true);
            window.removeEventListener('mousedown', this._onMouseDownCapture, true);
            window.removeEventListener('focusin', this._onFocusIn);
            window.removeEventListener('focusout', this._onFocusOut);

            this._keyboardHandlerInstalled = false;
        }
    }

    private _renderPopup(popup: PopupDescriptor, hidden: boolean): JSX.Element {
        const popupContainerStyle: React.CSSProperties = {
            display: 'flex',
            position: 'fixed',
            zIndex: 100001
        };

        if (!hidden) {
            popupContainerStyle.top = this.state.popupTop;
            popupContainerStyle.left = this.state.popupLeft;

            // Are we artificially constraining the width and/or height?
            if (this.state.constrainedPopupWidth && this.state.constrainedPopupWidth !== this.state.popupWidth) {
                popupContainerStyle.width = this.state.constrainedPopupWidth;
            }

            if (this.state.constrainedPopupHeight && this.state.constrainedPopupHeight !== this.state.popupHeight) {
                popupContainerStyle.height = this.state.constrainedPopupHeight;
            }
        }

        const key = (popup.popupOptions.cacheable ? 'CP:' : 'P:') + popup.popupId;
        const renderedPopup = (hidden ?
            popup.popupOptions.renderPopup('top', 0, 0, 0) :
            popup.popupOptions.renderPopup(
                this.state.anchorPosition, this.state.anchorOffset,
                this.state.constrainedPopupWidth, this.state.constrainedPopupHeight)
            );
        return (
            <PopupContainerView
                key={ key }
                style={ popupContainerStyle }
                hidden={ hidden }
                ref={ hidden ? undefined : this._onMount }
                onMouseEnter={ e => this._onMouseEnter(e) }
                onMouseLeave={ e => this._onMouseLeave(e) }
            >
                { renderedPopup }
            </PopupContainerView>
        );
    }

    render() {
        const rootViewStyle = {
            width: '100%',
            height: '100%',
            display: 'flex',
            cursor: 'default'
        };

        const optionalPopups: JSX.Element[] = [];
        if (this.props.activePopup) {
            optionalPopups.push(this._renderPopup(this.props.activePopup, false));
        }
        if (this.props.cachedPopup) {
            this.props.cachedPopup.forEach(popup => optionalPopups.push(this._renderPopup(popup, true)));
        }

        let optionalModal: JSX.Element | null = null;
        if (this.props.modal) {
            optionalModal = (
                <ModalContainer>
                    { this.props.modal }
                </ModalContainer>
            );
        }

        return (
            <div
                className={ this.state.focusClass }
                style={ rootViewStyle }
                dir={ this.props.writingDirection }
            >
                <MainViewContainer>
                    { this.props.mainView }
                </MainViewContainer>
                { optionalModal }
                { optionalPopups }
                <AccessibilityAnnouncer />
            </div>
        );
    }

    protected _onMount = (component: PopupContainerView | null) => {
        const domNode = component && ReactDOM.findDOMNode(component) as HTMLElement | null;
        this._mountedComponent = domNode ? domNode : undefined;
    }

    private _tryClosePopup = (e: MouseEvent) => {
        // Dismiss a visible popup if there's a click outside.
        const popupContainer = this._mountedComponent;
        if (!popupContainer) {
            return;
        }
        let clickInPopup = false;
        let el = e.target as HTMLElement | undefined;
        while (el) {
            if (el === popupContainer) {
                clickInPopup = true;
                break;
            }
            el = el.parentElement || undefined;
        }

        if (!clickInPopup && e.button !== _rightClickButtonCode) {
            _.defer(() => {
                if (this.props.activePopup) {
                    const anchorReference = this.props.activePopup.popupOptions.getAnchor();
                    const isClickOnAnchor = this._determineIfClickOnElement(anchorReference, e.srcElement);

                    let isClickOnContainer = false;
                    if (!isClickOnAnchor && this.props.activePopup.popupOptions.getElementTriggeringPopup) {
                        const containerRef = this.props.activePopup.popupOptions.getElementTriggeringPopup();
                        isClickOnContainer = this._determineIfClickOnElement(containerRef, e.srcElement);
                    }

                    if (isClickOnAnchor || isClickOnContainer) {
                        // If the press event was on the anchor, we can notify the caller about it.
                        // Showing another animation while dimissing the popup creates a conflict in the UI making it not doing one of the
                        // two animations (i.e.: Opening an actionsheet while dismissing a popup). We introduce this delay to make sure
                        // the popup dimissing animation has finished before we call the event handler.
                        if (this.props.activePopup.popupOptions.onAnchorPressed) {
                            setTimeout(() => {
                                // We can't pass through the DOM event argument to the anchor event handler as the event we have at this
                                // point is a DOM Event and the anchor expect a Synthetic event. There doesn't seem to be any way to convert
                                // between them. Passing null for now.
                                this.props.activePopup!.popupOptions.onAnchorPressed!(undefined);
                            }, 500);
                        }

                        // If the popup is meant to behave like a toggle, we should not dimiss the popup from here since the event came
                        // from the anchor/container of the popup. The popup will be dismissed during the click handling of the
                        // anchor/container.
                        if (this.props.activePopup.popupOptions.dismissIfShown) {
                            return;
                        }
                    }

                    if (this.props.activePopup.popupOptions.preventDismissOnPress) {
                        return;
                    }
                }

                this._dismissPopup();
            });
        }
    }

    private _determineIfClickOnElement(elementReference: React.Component<any, any>, eventSource: Element | null | undefined): boolean {
        try {
            const element = ReactDOM.findDOMNode(elementReference) as HTMLElement | null;
            const isClickOnElement = !!element && !!eventSource && element.contains(eventSource);
            return isClickOnElement;
        } catch {
            // Exception is due to race condition with unmounting.
            return false;
        }
    }

    private _onMouseDownCapture = (e: MouseEvent) => {
        if (e &&
                (e.clientX === 0) && (e.clientY === 0) &&
                (e.screenX === 0) && (e.screenY === 0)) {
            // This is most likely an event triggered by NVDA when Enter or
            // Space is pressed, do not dismiss the keyboard navigation mode.
            return;
        }

        this._shouldEnableKeyboardNavigationModeOnFocus = false;
        this._updateKeyboardNavigationState(false);
    }

    private _onKeyDownCapture = (e: KeyboardEvent) => {
        if (e.keyCode === KEY_CODE_TAB) {
            this._updateKeyboardNavigationState(true);
        }

        if (e.keyCode === KEY_CODE_ESC) {
            // If Esc is pressed and the focused element stays the same after some time,
            // switch the keyboard navigation off to dismiss the outline.
            const activeElement = document.activeElement;

            if (this._isNavigatingWithKeyboardUpateTimer) {
                clearTimeout(this._isNavigatingWithKeyboardUpateTimer);
            }

            this._isNavigatingWithKeyboardUpateTimer = window.setTimeout(() => {
                this._isNavigatingWithKeyboardUpateTimer = undefined;

                if ((document.activeElement === activeElement) && activeElement && (activeElement !== document.body)) {
                    this._updateKeyboardNavigationState(false);
                }
            }, 500);
        }
    }

    private _onFocusIn = (e: FocusEvent) => {
        // When the screen reader is being used, we need to enable the keyboard navigation
        // mode. It's not possible to detect the screen reader on web. To work it around we
        // apply the following assumption: if the focus is moved without using the mouse and
        // not from the application code with focus() method, it is most likely moved by the
        // screen reader.
        this._cancelApplicationIsNotActive();

        const target = e.target as HTMLElement;

        if (this._updateKeyboardNavigationModeOnFocusTimer) {
            clearTimeout(this._updateKeyboardNavigationModeOnFocusTimer);
        }

        this._updateKeyboardNavigationModeOnFocusTimer = Timers.setTimeout(() => {
            this._updateKeyboardNavigationModeOnFocusTimer = undefined;

            const prev = this._prevFocusedElement;
            const curShouldEnable = this._shouldEnableKeyboardNavigationModeOnFocus;

            this._prevFocusedElement = target;
            this._shouldEnableKeyboardNavigationModeOnFocus = true;

            if (this._applicationIsNotActive) {
                this._applicationIsNotActive = false;
                return;
            }

            if ((prev === target) || (target === FocusManager.getLastFocusedProgrammatically(true))) {
                return;
            }

            if (!UserInterface.isNavigatingWithKeyboard() && curShouldEnable) {
                this._updateKeyboardNavigationState(true);
            }
        }, 0);
    }

    private _onFocusOut = (e: FocusEvent) => {
        // If the focus is out and nothing is focused after some time, most likely
        // the application has been deactivated, so the next focusin will be about
        // activating the application back again and should be ignored.
        // This is a safety pillow for checking that _prevFocusedElement is changed,
        // as _prevFocusedElement might be gone while the application is not active.
        this._requestApplicationIsNotActive();
    }

    private _requestApplicationIsNotActive() {
        this._cancelApplicationIsNotActive();

        this._applicationIsNotActiveTimer = Timers.setTimeout(() => {
            this._applicationIsNotActiveTimer = undefined;
            this._applicationIsNotActive = true;
        }, 100);
    }

    private _cancelApplicationIsNotActive() {
        if (this._applicationIsNotActiveTimer) {
            clearTimeout(this._applicationIsNotActiveTimer);
            this._applicationIsNotActiveTimer = undefined;
        }
    }

    private _updateKeyboardNavigationState(isNavigatingWithKeyboard: boolean) {
        if (this._isNavigatingWithKeyboardUpateTimer) {
            clearTimeout(this._isNavigatingWithKeyboardUpateTimer);
            this._isNavigatingWithKeyboardUpateTimer = undefined;
        }

        if (UserInterface.isNavigatingWithKeyboard() !== isNavigatingWithKeyboard) {
            UserInterface.keyboardNavigationEvent.fire(isNavigatingWithKeyboard);

            const focusClass = isNavigatingWithKeyboard ? this.props.keyBoardFocusOutline : this.props.mouseFocusOutline;

            if (this.state.focusClass !== focusClass) {
                this.setState({ focusClass: focusClass });
            }
        }
    }

    private _onKeyDown = (e: KeyboardEvent) => {
        Input.dispatchKeyDown(e as any);
    }

    private _onKeyUp = (e: KeyboardEvent) => {
        if (this.props.activePopup && (e.keyCode === KEY_CODE_ESC)) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            this._dismissPopup();
            return;
        }

        Input.dispatchKeyUp(e as any);
    }

    private _onMouseEnter(e: React.MouseEvent<any>) {
        this._stopHidePopupTimer();
    }

    private _onMouseLeave(e: React.MouseEvent<any>) {
        this._startHidePopupTimer();
    }

    private _startHidePopupTimer() {
        if (this.props.autoDismiss) {
            // Should we immediately hide it, or did the caller request a delay?
            if (!_.isUndefined(this.props.autoDismissDelay) && this.props.autoDismissDelay > 0) {
                this._hidePopupTimer = window.setTimeout(() => {
                    this._hidePopupTimer = undefined;
                    this._dismissPopup();
                }, this.props.autoDismissDelay);
            } else {
                this._dismissPopup();
            }
        }
    }

    private _stopHidePopupTimer() {
        if (this._hidePopupTimer) {
            clearTimeout(this._hidePopupTimer);
            this._hidePopupTimer = undefined;
        }
    }

    private _dismissPopup() {
        if (this.props.onDismissPopup) {
            this.props.onDismissPopup();
        }
    }

    private _startRepositionPopupTimer() {
        this._respositionPopupTimer = Timers.setInterval(() => {
            this._recalcPosition();
        }, 500);
    }

    private _stopRepositionPopupTimer() {
        if (this._respositionPopupTimer) {
            clearInterval(this._respositionPopupTimer);
            this._respositionPopupTimer = undefined;
        }
    }

    // Recalculates the position and constrained size of the popup based on the current position of the anchor and the
    // window size. If necessary, it also measures the unconstrained size of the popup.
    private _recalcPosition() {
        // Make a copy of the old state.
        const newState: RootViewState = _.extend({}, this.state);

        if (this.state.isMeasuringPopup) {
            // Get the width/height of the popup.
            const popup = this._mountedComponent;
            if (!popup) {
                return;
            }

            newState.isMeasuringPopup = false;
            newState.popupHeight = popup.clientHeight;
            newState.popupWidth = popup.clientWidth;
        }

        // Get the anchor element.
        const anchorComponent = this.props.activePopup!.popupOptions.getAnchor();
        // if the anchor is unmounted, dismiss the popup.
        // Prevents app crash when we try to get dom node from unmounted Component
        if (!anchorComponent) {
            this._dismissPopup();
            return;
        }

        let anchor: HTMLElement | null = null;
        try {
            anchor = ReactDOM.findDOMNode(anchorComponent) as HTMLElement | null;
        } catch {
            anchor = null;
        }

        // If the anchor has disappeared, dismiss the popup.
        if (!anchor) {
            this._dismissPopup();
            return;
        }

        // Start by assuming that we'll be unconstrained.
        newState.constrainedPopupHeight = newState.popupHeight;
        newState.constrainedPopupWidth = newState.popupWidth;

        // Get the width/height of the full window.
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;

        // Calculate the absolute position of the anchor element's top/left.
        const anchorRect = anchor.getBoundingClientRect();

        // If the anchor is no longer in the window's bounds, cancel the popup.
        if (anchorRect.left >= windowWidth || anchorRect.right <= 0 ||
                anchorRect.bottom <= 0 || anchorRect.top >= windowHeight) {
            this._dismissPopup();
            return;
        }

        let positionsToTry = this.props.activePopup!.popupOptions.positionPriorities;
        if (!positionsToTry || positionsToTry.length === 0) {
            positionsToTry = ['bottom', 'right', 'top', 'left'];
        }

        if (this.props.activePopup!.popupOptions.useInnerPositioning) {
            // If the popup is meant to be shown inside the anchor we need to recalculate
            // the position differently.
            this._recalcInnerPosition(anchorRect, newState);
            return;
        }

        let foundPerfectFit = false;
        let foundPartialFit = false;
        positionsToTry.forEach(pos => {
            if (!foundPerfectFit) {
                let absLeft = 0;
                let absTop = 0;
                let anchorOffset = 0;
                let constrainedWidth = 0;
                let constrainedHeight = 0;

                switch (pos) {
                    case 'bottom':
                        absTop = anchorRect.bottom;
                        absLeft = anchorRect.left + (anchorRect.width - newState.popupWidth) / 2;
                        anchorOffset = newState.popupWidth / 2;

                        if (newState.popupHeight <= windowHeight - _popupAlleyWidth - anchorRect.bottom) {
                            foundPerfectFit = true;
                        } else if (!foundPartialFit) {
                            constrainedHeight = windowHeight - _popupAlleyWidth - anchorRect.bottom;
                        }
                        break;

                    case 'top':
                        absTop = anchorRect.top - newState.popupHeight;
                        absLeft = anchorRect.left + (anchorRect.width - newState.popupWidth) / 2;
                        anchorOffset = newState.popupWidth / 2;

                        if (newState.popupHeight <= anchorRect.top - _popupAlleyWidth) {
                            foundPerfectFit = true;
                        } else if (!foundPartialFit) {
                            constrainedHeight = anchorRect.top - _popupAlleyWidth;
                        }
                        break;

                    case 'right':
                        absLeft = anchorRect.right;
                        absTop = anchorRect.top + (anchorRect.height - newState.popupHeight) / 2;
                        anchorOffset = newState.popupHeight / 2;

                        if (newState.popupWidth <= windowWidth - _popupAlleyWidth - anchorRect.right) {
                            foundPerfectFit = true;
                        } else if (!foundPartialFit) {
                            constrainedWidth = windowWidth - _popupAlleyWidth - anchorRect.right;
                        }
                        break;

                    case 'left':
                        absLeft = anchorRect.left - newState.popupWidth;
                        absTop = anchorRect.top + (anchorRect.height - newState.popupHeight) / 2;
                        anchorOffset = newState.popupHeight / 2;

                        if (newState.popupWidth <= anchorRect.left - _popupAlleyWidth) {
                            foundPerfectFit = true;
                        } else if (!foundPartialFit) {
                            constrainedWidth = anchorRect.left - _popupAlleyWidth;
                        }
                        break;
                }

                const effectiveWidth = constrainedWidth || newState.popupWidth;
                const effectiveHeight = constrainedHeight || newState.popupHeight;

                // Make sure we're not hanging off the bounds of the window.
                if (absLeft < _popupAlleyWidth) {
                    if (pos === 'top' || pos === 'bottom') {
                        anchorOffset -= _popupAlleyWidth - absLeft;
                        if (anchorOffset < _minAnchorOffset || anchorOffset > effectiveWidth - _minAnchorOffset) {
                            foundPerfectFit = false;
                        }
                    }
                    absLeft = _popupAlleyWidth;
                } else if (absLeft > windowWidth - _popupAlleyWidth - effectiveWidth) {
                    if (pos === 'top' || pos === 'bottom') {
                        anchorOffset -= (windowWidth - _popupAlleyWidth - effectiveWidth - absLeft);
                        if (anchorOffset < _minAnchorOffset || anchorOffset > effectiveWidth - _minAnchorOffset) {
                            foundPerfectFit = false;
                        }
                    }
                    absLeft = windowWidth - _popupAlleyWidth - effectiveWidth;
                }

                if (absTop < _popupAlleyWidth) {
                    if (pos === 'right' || pos === 'left') {
                        anchorOffset += absTop - _popupAlleyWidth;
                        if (anchorOffset < _minAnchorOffset || anchorOffset > effectiveHeight - _minAnchorOffset) {
                            foundPerfectFit = false;
                        }
                    }
                    absTop = _popupAlleyWidth;
                } else if (absTop > windowHeight - _popupAlleyWidth - effectiveHeight) {
                    if (pos === 'right' || pos === 'left') {
                        anchorOffset -= (windowHeight - _popupAlleyWidth - effectiveHeight - absTop);
                        if (anchorOffset < _minAnchorOffset || anchorOffset > effectiveHeight - _minAnchorOffset) {
                            foundPerfectFit = false;
                        }
                    }
                    absTop = windowHeight - _popupAlleyWidth - effectiveHeight;
                }

                if (foundPerfectFit || effectiveHeight > 0 || effectiveWidth > 0) {
                    newState.popupTop = absTop;
                    newState.popupLeft = absLeft;
                    newState.anchorOffset = anchorOffset;
                    newState.anchorPosition = pos;
                    newState.constrainedPopupWidth = effectiveWidth;
                    newState.constrainedPopupHeight = effectiveHeight;

                    foundPartialFit = true;
                }
            }
        });

        if (!_.isEqual(newState, this.state)) {
            this.setState(newState);
        }
    }

    private _recalcInnerPosition(anchorRect: ClientRect, newState: RootViewState) {
        // For inner popups we only accept the first position of the priorities since there should always be room for the bubble.
        const pos = this.props.activePopup!.popupOptions.positionPriorities![0];

        switch (pos) {
            case 'top':
                newState.popupTop = anchorRect.top + anchorRect.height - newState.constrainedPopupHeight;
                newState.popupLeft = anchorRect.left + anchorRect.height / 2 - newState.constrainedPopupWidth / 2;
                newState.anchorOffset = newState.popupWidth / 2;
                break;

            case 'bottom':
                newState.popupTop = anchorRect.top + newState.constrainedPopupHeight;
                newState.popupLeft = anchorRect.left + anchorRect.height / 2 - newState.constrainedPopupWidth / 2;
                newState.anchorOffset = newState.popupWidth / 2;
                break;

            case 'left':
                newState.popupTop = anchorRect.top + anchorRect.height / 2 - newState.constrainedPopupHeight / 2;
                newState.popupLeft = anchorRect.left + anchorRect.width - newState.constrainedPopupWidth;
                newState.anchorOffset = newState.popupHeight / 2;
                break;

            case 'right':
                newState.popupTop = anchorRect.top + anchorRect.height / 2 - newState.constrainedPopupHeight / 2;
                newState.popupLeft = anchorRect.left;
                newState.anchorOffset = newState.popupHeight / 2;
                break;
        }

        newState.anchorPosition = pos;

        if (!_.isEqual(newState, this.state)) {
            this.setState(newState);
        }
    }
}

export default RootView;
