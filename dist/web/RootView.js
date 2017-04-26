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
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("./utils/lodashMini");
var React = require("react");
var ReactDOM = require("react-dom");
var Accessibility_1 = require("./Accessibility");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var Input_1 = require("./Input");
var ModalContainer_1 = require("./ModalContainer");
var Styles_1 = require("./Styles");
var Types = require("../common/Types");
// Width of the "alley" around popups so they don't get too close to the boundary of the window.
var _popupAlleyWidth = 8;
// How close to the edge of the popup should we allow the anchor offset to get before
// attempting a different position?
var _minAnchorOffset = 16;
// Button code for when right click is pressed in a mouse event
var _rightClickButtonCode = 2;
var _styles = {
    liveRegionContainer: Styles_1.default.createViewStyle({
        position: 'absolute',
        overflow: 'hidden',
        opacity: 0,
        top: -30,
        bottom: 0,
        left: 0,
        right: 0,
        height: 30
    })
};
var ESC_KEY_CODE = 27;
var RootView = (function (_super) {
    __extends(RootView, _super);
    function RootView(props) {
        var _this = _super.call(this, props) || this;
        _this._hidePopupTimer = null;
        _this._respositionPopupTimer = null;
        _this._clickHandlerInstalled = false;
        _this._lockForContextMenu = false;
        _this._keyboardHandlerInstalled = false;
        _this._newAnnouncementEventChangedSubscription = null;
        _this._tryClosePopup = function (e) {
            // Dismiss a visible popup if there's a click outside.
            var popupContainer = ReactDOM.findDOMNode(_this.refs['popupContainer']);
            var clickInPopup = false;
            var el = e.target;
            while (el) {
                if (el === popupContainer) {
                    clickInPopup = true;
                    break;
                }
                el = el.parentElement;
            }
            if (!clickInPopup && e.button !== _rightClickButtonCode) {
                _.defer(function () {
                    if (_this.props.activePopupOptions) {
                        var anchorReference = _this.props.activePopupOptions.getAnchor();
                        var isClickOnAnchor = _this._determineIfClickOnElement(anchorReference, e.srcElement);
                        var isClickOnContainer = void 0;
                        if (!isClickOnAnchor && _this.props.activePopupOptions.getElementTriggeringPopup) {
                            var containerRef = _this.props.activePopupOptions.getElementTriggeringPopup();
                            isClickOnContainer = _this._determineIfClickOnElement(containerRef, e.srcElement);
                        }
                        if (isClickOnAnchor || isClickOnContainer) {
                            // If the press event was on the anchor, we can notify the caller about it.
                            // Showing another animation while dimissing the popup creates a conflict in the UI making it not doing one of the
                            // two animations (i.e.: Opening an actionsheet while dismissing a popup). We introduce this delay to make sure
                            // the popup dimissing animation has finished before we call the event handler.
                            if (_this.props.activePopupOptions.onAnchorPressed) {
                                setTimeout(function () {
                                    // We can't pass through the DOM event argument to the anchor event handler as the event we have at this
                                    // point is a DOM Event and the anchor expect a Syntethic event. There doesn't seem to be any way to convert
                                    // between them. Passing null for now.
                                    _this.props.activePopupOptions.onAnchorPressed(null);
                                }, 500);
                            }
                            // If the popup is meant to behave like a toggle, we should not dimiss the popup from here since the event came
                            // from the anchor/container of the popup. The popup will be dismissed during the click handling of the
                            // anchor/container.
                            if (_this.props.activePopupOptions.dismissIfShown) {
                                return;
                            }
                        }
                    }
                    _this._dismissPopup();
                });
            }
        };
        _this._onMouseDown = function (e) {
            if (_this.state.focusClass !== _this.props.mouseFocusOutline) {
                _this.setState({ focusClass: _this.props.mouseFocusOutline });
            }
        };
        _this._onKeyDown = function (e) {
            if (_this.state.focusClass !== _this.props.keyBoardFocusOutline) {
                _this.setState({ focusClass: _this.props.keyBoardFocusOutline });
            }
            Input_1.default.dispatchKeyDown(e);
        };
        _this._onKeyUp = function (e) {
            if (_this.props.activePopupOptions && (e.keyCode === ESC_KEY_CODE)) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                _this._dismissPopup();
                return;
            }
            Input_1.default.dispatchKeyUp(e);
        };
        // Update announcement text.
        _this._newAnnouncementEventChangedSubscription =
            Accessibility_1.default.newAnnouncementReadyEvent.subscribe(function (announcement) {
                _this.setState({
                    announcementText: announcement
                });
            });
        _this.state = _this._getInitialState();
        return _this;
    }
    RootView.prototype._getInitialState = function () {
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
            isMouseInPopup: false,
            focusClass: this.props.mouseFocusOutline,
            announcementText: ''
        };
    };
    RootView.prototype.componentWillReceiveProps = function (prevProps) {
        if (this.props.activePopupOptions !== prevProps.activePopupOptions) {
            this._stopHidePopupTimer();
            // If the popup changes, reset our state.
            this.setState(this._getInitialState());
        }
    };
    RootView.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (this.props.activePopupOptions) {
            this._stopHidePopupTimer();
            this._recalcPosition();
            if (!this._respositionPopupTimer) {
                this._startRepositionPopupTimer();
            }
            if (!this.state.isMouseInPopup) {
                this._startHidePopupTimer();
            }
            if (!this._clickHandlerInstalled) {
                document.addEventListener('mousedown', this._tryClosePopup);
                document.addEventListener('touchstart', this._tryClosePopup);
                this._clickHandlerInstalled = true;
            }
        }
        else {
            this._stopRepositionPopupTimer();
            if (this._clickHandlerInstalled) {
                document.removeEventListener('mousedown', this._tryClosePopup);
                document.removeEventListener('touchstart', this._tryClosePopup);
                this._clickHandlerInstalled = false;
            }
        }
    };
    RootView.prototype.componentDidMount = function () {
        if (this.props.activePopupOptions) {
            this._recalcPosition();
        }
        if (!this.state.isMouseInPopup) {
            this._startHidePopupTimer();
        }
        if (this.props.activePopupOptions) {
            this._startRepositionPopupTimer();
        }
        if (!this._keyboardHandlerInstalled) {
            window.addEventListener('keydown', this._onKeyDown);
            window.addEventListener('keyup', this._onKeyUp);
            window.addEventListener('mousedown', this._onMouseDown);
            this._keyboardHandlerInstalled = true;
        }
    };
    RootView.prototype.componentWillUnmount = function () {
        this._stopHidePopupTimer();
        this._stopRepositionPopupTimer();
        this._newAnnouncementEventChangedSubscription.unsubscribe();
        this._newAnnouncementEventChangedSubscription = null;
        if (this._keyboardHandlerInstalled) {
            window.removeEventListener('keydown', this._onKeyDown);
            window.removeEventListener('keyup', this._onKeyUp);
            this._keyboardHandlerInstalled = false;
        }
    };
    RootView.prototype.render = function () {
        var _this = this;
        var rootViewStyle = {
            width: '100%',
            height: '100%',
            display: 'flex',
            cursor: 'default'
        };
        var optionalPopup = null;
        if (this.props.activePopupOptions) {
            var popupContainerStyle = {
                display: 'flex',
                position: 'fixed',
                top: this.state.popupTop,
                left: this.state.popupLeft,
                zIndex: 100001
            };
            // Are we artificially constraining the width and/or height?
            if (this.state.constrainedPopupWidth && this.state.constrainedPopupWidth !== this.state.popupWidth) {
                popupContainerStyle['width'] = this.state.constrainedPopupWidth;
            }
            if (this.state.constrainedPopupHeight && this.state.constrainedPopupHeight !== this.state.popupHeight) {
                popupContainerStyle['height'] = this.state.constrainedPopupHeight;
            }
            optionalPopup = (React.createElement("div", { style: popupContainerStyle, ref: 'popupContainer', onMouseEnter: function (e) { return _this._onMouseEnter(e); }, onMouseLeave: function (e) { return _this._onMouseLeave(e); } }, this.props.activePopupOptions.renderPopup(this.state.anchorPosition, this.state.anchorOffset, this.state.constrainedPopupWidth, this.state.constrainedPopupHeight)));
        }
        var optionalModal = null;
        if (this.props.modal) {
            optionalModal = (React.createElement(ModalContainer_1.default, null, this.props.modal));
        }
        return (React.createElement("div", { className: this.state.focusClass, style: rootViewStyle },
            this.props.mainView,
            optionalModal,
            optionalPopup,
            React.createElement("div", { style: _styles.liveRegionContainer, "aria-live": AccessibilityUtil_1.default.accessibilityLiveRegionToString(Types.AccessibilityLiveRegion.Polite), "aria-atomic": 'true' }, this.state.announcementText)));
    };
    RootView.prototype._determineIfClickOnElement = function (elementReference, eventSource) {
        var element = ReactDOM.findDOMNode(elementReference);
        var isClickOnElement = element && element.contains(eventSource);
        return isClickOnElement;
    };
    RootView.prototype._onMouseEnter = function (e) {
        this.setState({
            isMouseInPopup: true
        });
        this._stopHidePopupTimer();
    };
    RootView.prototype._onMouseLeave = function (e) {
        this.setState({
            isMouseInPopup: false
        });
        this._startHidePopupTimer();
    };
    RootView.prototype._startHidePopupTimer = function () {
        var _this = this;
        if (this.props.autoDismiss) {
            // Should we immediately hide it, or did the caller request a delay?
            if (this.props.autoDismissDelay > 0) {
                this._hidePopupTimer = window.setTimeout(function () {
                    _this._hidePopupTimer = null;
                    _this._dismissPopup();
                }, this.props.autoDismissDelay);
            }
            else {
                this._dismissPopup();
            }
        }
    };
    RootView.prototype._stopHidePopupTimer = function () {
        if (this._hidePopupTimer) {
            clearTimeout(this._hidePopupTimer);
            this._hidePopupTimer = null;
        }
    };
    RootView.prototype._dismissPopup = function () {
        if (this.props.onDismissPopup) {
            this.props.onDismissPopup();
        }
    };
    RootView.prototype._startRepositionPopupTimer = function () {
        var _this = this;
        this._respositionPopupTimer = setInterval(function () {
            _this._recalcPosition();
        }, 500);
    };
    RootView.prototype._stopRepositionPopupTimer = function () {
        if (this._respositionPopupTimer) {
            clearInterval(this._respositionPopupTimer);
            this._respositionPopupTimer = null;
        }
    };
    // Recalculates the position and constrained size of the popup based on the current position of the anchor and the
    // window size. If necessary, it also measures the unconstrained size of the popup.
    RootView.prototype._recalcPosition = function () {
        // Make a copy of the old state.
        var newState = _.extend({}, this.state);
        if (this.state.isMeasuringPopup) {
            // Get the width/height of the popup.
            var popup = ReactDOM.findDOMNode(this.refs['popupContainer']);
            if (!popup) {
                return;
            }
            newState.isMeasuringPopup = false;
            newState.popupHeight = popup.clientHeight;
            newState.popupWidth = popup.clientWidth;
        }
        // Get the anchor element.
        var anchor = ReactDOM.findDOMNode(this.props.activePopupOptions.getAnchor());
        // If the anchor has disappeared, dismiss the popup.
        if (!anchor) {
            this._dismissPopup();
            return;
        }
        // Start by assuming that we'll be unconstrained.
        newState.constrainedPopupHeight = newState.popupHeight;
        newState.constrainedPopupWidth = newState.popupWidth;
        // Get the width/height of the full window.
        var windowHeight = window.innerHeight;
        var windowWidth = window.innerWidth;
        // Calculate the absolute position of the anchor element's top/left.
        var anchorRect = anchor.getBoundingClientRect();
        // If the anchor is no longer in the window's bounds, cancel the popup.
        if (anchorRect.left >= windowWidth || anchorRect.right <= 0 ||
            anchorRect.bottom <= 0 || anchorRect.top >= windowHeight) {
            this._dismissPopup();
            return;
        }
        var positionsToTry = this.props.activePopupOptions.positionPriorities;
        if (!positionsToTry || positionsToTry.length === 0) {
            positionsToTry = ['bottom', 'right', 'top', 'left'];
        }
        if (this.props.activePopupOptions.useInnerPositioning) {
            // If the popup is meant to be shown inside the anchor we need to recalculate
            // the position differently.
            this._recalcInnerPosition(anchorRect, newState);
            return;
        }
        var foundPerfectFit = false;
        var foundPartialFit = false;
        positionsToTry.forEach(function (pos) {
            if (!foundPerfectFit) {
                var absLeft = 0;
                var absTop = 0;
                var anchorOffset = 0;
                var constrainedWidth = 0;
                var constrainedHeight = 0;
                switch (pos) {
                    case 'bottom':
                        absTop = anchorRect.bottom;
                        absLeft = anchorRect.left + (anchorRect.width - newState.popupWidth) / 2;
                        anchorOffset = newState.popupWidth / 2;
                        if (newState.popupHeight <= windowHeight - _popupAlleyWidth - anchorRect.bottom) {
                            foundPerfectFit = true;
                        }
                        else if (!foundPartialFit) {
                            constrainedHeight = windowHeight - _popupAlleyWidth - anchorRect.bottom;
                        }
                        break;
                    case 'top':
                        absTop = anchorRect.top - newState.popupHeight;
                        absLeft = anchorRect.left + (anchorRect.width - newState.popupWidth) / 2;
                        anchorOffset = newState.popupWidth / 2;
                        if (newState.popupHeight <= anchorRect.top - _popupAlleyWidth) {
                            foundPerfectFit = true;
                        }
                        else if (!foundPartialFit) {
                            constrainedHeight = anchorRect.top - _popupAlleyWidth;
                        }
                        break;
                    case 'right':
                        absLeft = anchorRect.right;
                        absTop = anchorRect.top + (anchorRect.height - newState.popupHeight) / 2;
                        anchorOffset = newState.popupHeight / 2;
                        if (newState.popupWidth <= windowWidth - _popupAlleyWidth - anchorRect.right) {
                            foundPerfectFit = true;
                        }
                        else if (!foundPartialFit) {
                            constrainedWidth = windowWidth - _popupAlleyWidth - anchorRect.right;
                        }
                        break;
                    case 'left':
                        absLeft = anchorRect.left - newState.popupWidth;
                        absTop = anchorRect.top + (anchorRect.height - newState.popupHeight) / 2;
                        anchorOffset = newState.popupHeight / 2;
                        if (newState.popupWidth <= anchorRect.left - _popupAlleyWidth) {
                            foundPerfectFit = true;
                        }
                        else if (!foundPartialFit) {
                            constrainedWidth = anchorRect.left - _popupAlleyWidth;
                        }
                        break;
                }
                var effectiveWidth = constrainedWidth || newState.popupWidth;
                var effectiveHeight = constrainedHeight || newState.popupHeight;
                // Make sure we're not hanging off the bounds of the window.
                if (absLeft < _popupAlleyWidth) {
                    if (pos === 'top' || pos === 'bottom') {
                        anchorOffset -= _popupAlleyWidth - absLeft;
                        if (anchorOffset < _minAnchorOffset || anchorOffset > effectiveWidth - _minAnchorOffset) {
                            foundPerfectFit = false;
                        }
                    }
                    absLeft = _popupAlleyWidth;
                }
                else if (absLeft > windowWidth - _popupAlleyWidth - effectiveWidth) {
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
                }
                else if (absTop > windowHeight - _popupAlleyWidth - effectiveHeight) {
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
    };
    RootView.prototype._recalcInnerPosition = function (anchorRect, newState) {
        // For inner popups we only accept the first position of the priorities since there should always be room for the bubble.
        var pos = this.props.activePopupOptions.positionPriorities[0];
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
    };
    return RootView;
}(React.Component));
exports.RootView = RootView;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootView;
