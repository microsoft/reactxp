/**
* FrontLayerViewManager.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Manages stackable modals and popup views that are posted and dismissed
* by the Types showModal/dismissModal/showPopup/dismissPopup methods.
*/
"use strict";
var _ = require("./lodashMini");
var React = require("react");
var RN = require("react-native");
var ModalContainer_1 = require("../native-common/ModalContainer");
var SubscribableEvent = require("../common/SubscribableEvent");
var PopupContainerView_1 = require("./PopupContainerView");
var ModalStackContext = (function () {
    function ModalStackContext(modalId, modal) {
        this.modalId = modalId;
        this.modal = modal;
    }
    return ModalStackContext;
}());
var PopupStackContext = (function () {
    function PopupStackContext(popupId, popupOptions, anchorHandle) {
        this.popupId = popupId;
        this.popupOptions = popupOptions;
        this.anchorHandle = anchorHandle;
    }
    return PopupStackContext;
}());
var _styles = {
    fullScreenView: {
        flex: 1,
        alignSelf: 'stretch',
        overflow: 'visible'
    }
};
var FrontLayerViewManager = (function () {
    function FrontLayerViewManager() {
        var _this = this;
        this._overlayStack = [];
        this.event_changed = new SubscribableEvent.SubscribableEvent();
        this._onBackgroundPressed = function (e) {
            e.persist();
            var activePopupContext = _this._getActiveOverlay();
            if (!(activePopupContext instanceof PopupStackContext)) {
                return;
            }
            if (activePopupContext.popupOptions && activePopupContext.popupOptions.onAnchorPressed) {
                RN.NativeModules.UIManager.measureInWindow(activePopupContext.anchorHandle, function (x, y, width, height, pageX, pageY) {
                    var touchEvent = e.nativeEvent;
                    var anchorRect = { left: x, top: y, right: x + width, bottom: y + height, width: width, height: height };
                    // Find out if the press event was on the anchor so we can notify the caller about it.
                    if (touchEvent.pageX >= anchorRect.left && touchEvent.pageX < anchorRect.right
                        && touchEvent.pageY >= anchorRect.top && touchEvent.pageY < anchorRect.bottom) {
                        // Showing another animation while dimissing the popup creates a conflict in the UI making it not doing one of the
                        // two animations (i.e.: Opening an actionsheet while dismissing a popup). We introduce this delay to make sure
                        // the popup dimissing animation has finished before we call the event handler.
                        setTimeout(function () { activePopupContext.popupOptions.onAnchorPressed(e); }, 500);
                    }
                });
            }
            _this._dismissActivePopup();
        };
        this._onRequestClose = function () {
            _this._dismissActivePopup();
        };
    }
    FrontLayerViewManager.prototype.showModal = function (modal, modalId) {
        var index = this._findIndexOfModal(modalId);
        if (index === -1) {
            this._overlayStack.push(new ModalStackContext(modalId, modal));
            this.event_changed.fire();
        }
    };
    FrontLayerViewManager.prototype.isModalDisplayed = function (modalId) {
        return this._findIndexOfModal(modalId) !== -1;
    };
    FrontLayerViewManager.prototype.dismissModal = function (modalId) {
        var index = this._findIndexOfModal(modalId);
        if (index >= 0) {
            this._overlayStack.splice(index, 1);
            this.event_changed.fire();
        }
    };
    FrontLayerViewManager.prototype.dismissAllmodals = function () {
        if (this._overlayStack.length > 0) {
            this._overlayStack = _.filter(this._overlayStack, function (iter) { return !(iter instanceof ModalStackContext); });
            this.event_changed.fire();
        }
    };
    FrontLayerViewManager.prototype.showPopup = function (popupOptions, popupId, delay) {
        if (!popupId || popupId === '') {
            console.error('FrontLayerViewManager: popupId must be valid!');
            return false;
        }
        if (!popupOptions.getAnchor()) {
            console.error('FrontLayerViewManager: getAnchor() must be valid!');
            return false;
        }
        var index = this._findIndexOfPopup(popupId);
        if (index === -1) {
            this._overlayStack.push(new PopupStackContext(popupId, popupOptions, RN.findNodeHandle(popupOptions.getAnchor())));
            this.event_changed.fire();
            return true;
        }
        return false;
    };
    FrontLayerViewManager.prototype.dismissPopup = function (popupId) {
        var index = this._findIndexOfPopup(popupId);
        if (index >= 0) {
            var popupContext = this._overlayStack[index];
            if (popupContext.popupOptions.onDismiss) {
                popupContext.popupOptions.onDismiss();
            }
            this._overlayStack.splice(index, 1);
            this.event_changed.fire();
        }
    };
    FrontLayerViewManager.prototype.dismissAllPopups = function () {
        if (this._overlayStack.length > 0) {
            this._overlayStack = _.filter(this._overlayStack, function (iter) { return !(iter instanceof PopupStackContext); });
            this.event_changed.fire();
        }
    };
    FrontLayerViewManager.prototype.getModalLayerView = function (rootView) {
        var overlayContext = _.findLast(this._overlayStack, function (context) { return context instanceof ModalStackContext; });
        if (overlayContext) {
            return (React.createElement(ModalContainer_1.ModalContainer, null, overlayContext.modal));
        }
        return null;
    };
    FrontLayerViewManager.prototype.getPopupLayerView = function (rootView) {
        var _this = this;
        var overlayContext = _.findLast(this._overlayStack, function (context) { return context instanceof PopupStackContext; });
        if (overlayContext) {
            return (React.createElement(ModalContainer_1.ModalContainer, null,
                React.createElement(RN.TouchableWithoutFeedback, { onPressOut: this._onBackgroundPressed, importantForAccessibility: 'no' },
                    React.createElement(RN.View, { style: _styles.fullScreenView },
                        React.createElement(PopupContainerView_1.default, { activePopupOptions: overlayContext.popupOptions, anchorHandle: overlayContext.anchorHandle, onDismissPopup: function () { return _this.dismissPopup(overlayContext.popupId); } })))));
        }
        return null;
    };
    FrontLayerViewManager.prototype._dismissActivePopup = function () {
        // Dismiss any currently visible popup:
        var activePopupContext = this._getActiveOverlay();
        if (activePopupContext instanceof PopupStackContext) {
            this.dismissPopup(activePopupContext.popupId);
        }
    };
    FrontLayerViewManager.prototype._findIndexOfModal = function (modalId) {
        return _.findIndex(this._overlayStack, function (iter) { return iter instanceof ModalStackContext && iter.modalId === modalId; });
    };
    FrontLayerViewManager.prototype._findIndexOfPopup = function (popupId) {
        return _.findIndex(this._overlayStack, function (iter) { return iter instanceof PopupStackContext && iter.popupId === popupId; });
    };
    FrontLayerViewManager.prototype._getActiveOverlay = function () {
        // Check for any Popup in queue
        return this._overlayStack.length === 0 ? null : _.last(this._overlayStack);
    };
    return FrontLayerViewManager;
}());
exports.FrontLayerViewManager = FrontLayerViewManager;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new FrontLayerViewManager();
