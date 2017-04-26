/**
* NavigatorStandardDelegate.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Delegate which encapsulates standard react-native Navigator experience.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("./lodashMini");
var React = require("react");
var RN = require("react-native");
var NavigatorCommon_1 = require("./NavigatorCommon");
var Types = require("../common/Types");
var NavigatorStandardDelegate = (function (_super) {
    __extends(NavigatorStandardDelegate, _super);
    function NavigatorStandardDelegate(navigator) {
        var _this = _super.call(this, navigator) || this;
        // Callback from Navigator.js to RX.Navigator
        _this._renderScene = function (route, navigator) {
            // route exists?
            if (route) {
                // call the renderScene callback sent from SkypeXNavigator
                return _this._owner.props.renderScene(route);
            }
            // no route? return empty scene
            return React.createElement(RN.View, null);
        };
        // Returns object from RN.Navigator.SceneConfigs types (looks like NavigatorSceneConfig for web)
        _this._configureNativeScene = function (route, routeStack) {
            // route exists?
            if (route) {
                switch (route.sceneConfigType) {
                    case Types.NavigatorSceneConfigType.FloatFromRight:
                        return RN.Navigator.SceneConfigs.FloatFromRight;
                    case Types.NavigatorSceneConfigType.FloatFromLeft:
                        return RN.Navigator.SceneConfigs.FloatFromLeft;
                    case Types.NavigatorSceneConfigType.FloatFromBottom:
                        return RN.Navigator.SceneConfigs.FloatFromBottom;
                    case Types.NavigatorSceneConfigType.Fade:
                        // FadeAndroid is also supported on iOS.
                        return RN.Navigator.SceneConfigs.FadeAndroid;
                    case Types.NavigatorSceneConfigType.FadeWithSlide:
                        // TODO: Task http://skype.vso.io/544843 - Implement the FadeWithSlide animation for RN
                        // FadeAndroid is also supported on iOS.
                        return RN.Navigator.SceneConfigs.FadeAndroid;
                    default:
                        return RN.Navigator.SceneConfigs.FloatFromRight;
                }
            }
        };
        _this._onRouteWillFocus = function (route) {
            if (!_this._navigator) {
                return;
            }
            // Check if we've popped via gesture.  This is kind of gross, but RN doesn't
            // provide an interface we can use to check this
            if (_this._navigator.state.activeGesture !== 'pop') {
                return;
            }
            var currentRoutes = _this._navigator.getCurrentRoutes();
            var focusIndex = _.findIndex(currentRoutes, function (currRoute) { return route.routeId === currRoute.routeId; });
            if (focusIndex === -1) {
                // Not found, nothing to do
                return;
            }
            if (_this._owner.props.transitionStarted) {
                _this._owner.props.transitionStarted();
            }
            if (focusIndex === currentRoutes.length - 2) {
                // A swipe-back pop occurred since we're focusing the view 1 below the top
                if (_this._owner.props.navigateBackCompleted) {
                    _this._owner.props.navigateBackCompleted();
                }
            }
        };
        _this._onRouteDidFocus = function (route) {
            if (_this._owner.props.transitionCompleted) {
                _this._owner.props.transitionCompleted();
            }
        };
        return _this;
    }
    NavigatorStandardDelegate.prototype.getRoutes = function () {
        return (this._navigator && this._navigator.getCurrentRoutes()) || [];
    };
    // Reset route stack with default route stack
    NavigatorStandardDelegate.prototype.immediatelyResetRouteStack = function (nextRouteStack) {
        this._navigator.immediatelyResetRouteStack(nextRouteStack);
    };
    NavigatorStandardDelegate.prototype.render = function () {
        var _this = this;
        return (React.createElement(RN.Navigator, { renderScene: this._renderScene, configureScene: this._configureNativeScene, sceneStyle: this._owner.props.cardStyle, onWillFocus: this._onRouteWillFocus, onDidFocus: this._onRouteDidFocus, ref: function (navigator) { return _this._navigator = navigator; } }));
    };
    // Try to remove this handling by scheduling as it's done in experimental
    NavigatorStandardDelegate.prototype.handleBackPress = function () {
        this._navigator.pop();
    };
    NavigatorStandardDelegate.prototype.processCommand = function (commandQueue) {
        // Return if nothing to process
        if (!this._navigator || !commandQueue.length) {
            return;
        }
        var command = commandQueue.shift();
        var route = command.param.route;
        var value = command.param.value;
        switch (command.type) {
            case NavigatorCommon_1.CommandType.Push:
                // console.log('[Navigator] <== push(route)');
                this._navigator.push(route);
                break;
            case NavigatorCommon_1.CommandType.Pop:
                if (route !== undefined) {
                    // console.log(`[Navigator] <== popToRoute(${this._findIOSRouteIndex(route)})`);
                    this._navigator.popToRoute(route);
                }
                else if (value !== undefined) {
                    // console.log(`[Navigator] <== ${value > 0 ? 'popN' : 'popToTop'}(${value}))`);
                    if (value > 0) {
                        var popCount = value;
                        while (popCount > 0) {
                            this._navigator.pop();
                            popCount--;
                        }
                    }
                    else {
                        this._navigator.popToTop();
                    }
                }
                else {
                    // console.log(`[Navigator] <== pop()`);
                    this._navigator.pop();
                }
                break;
            case NavigatorCommon_1.CommandType.Replace:
                // console.log(`[Navigator] <== replace(${this._findIOSRouteIndex(route)}, ${value})`);
                value === -1 ? this._navigator.replacePrevious(route) : this._navigator.replace(route);
                break;
            default:
                console.error('Undefined Navigation command: ', command.type);
                break;
        }
    };
    return NavigatorStandardDelegate;
}(NavigatorCommon_1.NavigatorDelegate));
exports.NavigatorStandardDelegate = NavigatorStandardDelegate;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NavigatorStandardDelegate;
