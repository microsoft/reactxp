/**
* RootView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* The top-most view that's used for proper layering or modals and popups.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var RN = require("react-native");
var Accessibility_1 = require("./Accessibility");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var FrontLayerViewManager_1 = require("./FrontLayerViewManager");
var MainViewStore_1 = require("./MainViewStore");
var Styles_1 = require("./Styles");
var Types = require("../common/Types");
var _styles = {
    rootViewStyle: Styles_1.default.createViewStyle({
        flex: 1,
        alignItems: 'stretch',
        overflow: 'visible'
    }),
    liveRegionContainer: Styles_1.default.createViewStyle({
        position: 'absolute',
        opacity: 0,
        top: -30,
        bottom: 0,
        left: 0,
        right: 0,
        height: 30
    })
};
var RootView = (function (_super) {
    __extends(RootView, _super);
    function RootView() {
        var _this = _super.call(this) || this;
        _this._changeListener = _this._onChange.bind(_this);
        _this._frontLayerViewChangedSubscription = null;
        _this._newAnnouncementEventChangedSubscription = null;
        _this.state = {
            mainView: null,
            announcementText: ''
        };
        return _this;
    }
    RootView.prototype.componentWillMount = function () {
        var _this = this;
        MainViewStore_1.default.subscribe(this._changeListener);
        this._frontLayerViewChangedSubscription = FrontLayerViewManager_1.default.event_changed.subscribe(function () {
            // Setting empty state will trigger a render.
            _this.setState({});
        });
        // Update announcement text.  
        this._newAnnouncementEventChangedSubscription =
            Accessibility_1.default.newAnnouncementReadyEvent.subscribe(function (announcement) {
                _this.setState({
                    announcementText: announcement
                });
            });
        this.setState(this._getStateFromStore());
    };
    RootView.prototype.componentWillUnmount = function () {
        this._frontLayerViewChangedSubscription.unsubscribe();
        this._frontLayerViewChangedSubscription = null;
        this._newAnnouncementEventChangedSubscription.unsubscribe();
        this._newAnnouncementEventChangedSubscription = null;
        MainViewStore_1.default.unsubscribe(this._changeListener);
    };
    RootView.prototype.render = function () {
        var modalLayerView = FrontLayerViewManager_1.default.getModalLayerView(this);
        var popupLayerView = FrontLayerViewManager_1.default.getPopupLayerView(this);
        // When showing a modal/popup we want to hide the mainView shown behind from an accessibility
        // standpoint to ensure that it won't get the focus and the screen reader's attention.
        var importantForAccessibility = (modalLayerView || popupLayerView) ?
            AccessibilityUtil_1.default.importantForAccessibilityToString(Types.ImportantForAccessibility.NoHideDescendants) :
            undefined; // default
        return (React.createElement(RN.Animated.View, { style: _styles.rootViewStyle },
            React.createElement(RN.View, { style: _styles.rootViewStyle, importantForAccessibility: importantForAccessibility }, this.state.mainView),
            modalLayerView,
            popupLayerView,
            React.createElement(RN.View, { style: _styles.liveRegionContainer, accessibilityLabel: this.state.announcementText, accessibilityLiveRegion: AccessibilityUtil_1.default.accessibilityLiveRegionToString(Types.AccessibilityLiveRegion.Polite) })));
    };
    RootView.prototype._onChange = function () {
        this.setState(this._getStateFromStore());
    };
    RootView.prototype._getStateFromStore = function () {
        return {
            mainView: MainViewStore_1.default.getMainView()
        };
    };
    return RootView;
}(React.Component));
exports.RootView = RootView;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootView;
