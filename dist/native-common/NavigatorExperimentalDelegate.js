/**
* NavigatorExperimentalDelegate.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Delegate which encapsulates experimental react-native Navigator experience.
* The main difference of Experimental Navigator is that it uses Animated for navigation animation
* so we can enable useNativeDriver options for those animations.
*
* Currently, Android support on NativeAnimations is more stable and performant than iOS.
* That's why we need to have the ability to pick different implementations for different platforms.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("./lodashMini");
var assert = require("assert");
var React = require("react");
var RN = require("react-native");
var NavigatorCommon_1 = require("./NavigatorCommon");
var Navigation = RN.NavigationExperimental;
var Types = require("../common/Types");
var StateUtils = Navigation.StateUtils;
var NavigatorExperimentalDelegate = (function (_super) {
    __extends(NavigatorExperimentalDelegate, _super);
    function NavigatorExperimentalDelegate(navigator) {
        var _this = _super.call(this, navigator) || this;
        _this._onTransitionEnd = function () {
            _this._transitionSpec = _this._buildTransitionSpec(_this._state);
            console.log('onTransitionEnd', _this._transitionSpec);
            _this._owner.setState({ state: _this._state });
            if (_this._owner.props.transitionCompleted) {
                _this._owner.props.transitionCompleted();
            }
        };
        _this._onTransitionStart = function (transitionProps, prevTransitionProps) {
            console.log('onTransitionStart', _this._transitionSpec);
            if (_this._owner.props.transitionStarted) {
                var fromIndex = prevTransitionProps && prevTransitionProps.scene ? prevTransitionProps.scene.index : null;
                var toIndex = transitionProps.scene ? transitionProps.scene.index : null;
                var fromRouteId = prevTransitionProps && prevTransitionProps.scene ? prevTransitionProps.scene.route.key : null;
                var toRouteId = transitionProps.scene ? transitionProps.scene.route.key : null;
                _this._owner.props.transitionStarted(transitionProps.position, toRouteId, fromRouteId, toIndex, fromIndex);
            }
        };
        // Callback from Navigator.js to RX.Navigator
        _this._renderScene = function (props, navigator) {
            var parentState = props.navigationState;
            var sceneState = parentState.routes[parentState.index];
            // route exists?
            if (sceneState.route) {
                // call the renderScene callback sent from SkypeXNavigator
                return _this._owner.props.renderScene(sceneState.route);
            }
            // no route? return empty scene
            return React.createElement(RN.View, null);
        };
        /**
         * This method is going to be deprecated in later releases
        */
        _this._onNavigateBack = function (action) {
            _this.onBackPress();
        };
        var route = { key: '0', route: { routeId: 0, sceneConfigType: 0 } };
        _this._state = { index: 0, routes: [route] };
        _this._transitionSpec = _this._buildTransitionSpec(_this._state);
        console.log('initial transition spec is:', _this._transitionSpec);
        return _this;
    }
    NavigatorExperimentalDelegate.prototype.getRoutes = function () {
        return _.map(this._state.routes, function (element) {
            var routeState = element;
            return routeState.route;
        });
    };
    // Reset route stack with default route stack
    NavigatorExperimentalDelegate.prototype.immediatelyResetRouteStack = function (nextRouteStack) {
        console.log('Stack state before reset:', this._state);
        var prevState = this._state;
        this._state = this._createParentState(nextRouteStack, prevState);
        this._transitionSpec = this._buildTransitionSpec(this._state);
        console.log('Immediate stack reset:', this._state, this._transitionSpec);
        this._owner.setState({ state: this._state });
    };
    // Render without initial route to get a reference for Navigator object
    NavigatorExperimentalDelegate.prototype.render = function () {
        return (React.createElement(Navigation.CardStack, { direction: this._transitionSpec.direction, customTransitionConfig: this._transitionSpec.customTransitionConfig, navigationState: this._state, onNavigateBack: this._onNavigateBack, onTransitionStart: this._onTransitionStart, onTransitionEnd: this._onTransitionEnd, renderScene: this._renderScene, cardStyle: this._transitionSpec.cardStyle || this._owner.props.cardStyle, hideShadow: this._transitionSpec.hideShadow, enableGestures: this._transitionSpec.enableGesture, gestureResponseDistance: this._transitionSpec.gestureResponseDistance }));
    };
    NavigatorExperimentalDelegate.prototype._convertCustomTransitionConfig = function (config) {
        if (!config) {
            return null;
        }
        var nativeConfig = {
            transitionStyle: config.transitionStyle,
            presentBelowPrevious: config.presentBelowPrevious
        };
        if (config.transitionSpec) {
            var transitionSpec = {};
            if (config.transitionSpec.duration) {
                transitionSpec.duration = config.transitionSpec.duration;
            }
            if (config.transitionSpec.easing) {
                transitionSpec.easing = config.transitionSpec.easing.function;
            }
            nativeConfig.transitionSpec = transitionSpec;
        }
        return nativeConfig;
    };
    NavigatorExperimentalDelegate.prototype._buildTransitionSpec = function (state) {
        var route = state.routes[state.index].route;
        var direction = 'horizontal';
        var customSceneConfig = null;
        var enableGesture = null;
        var responseDistance = null;
        var hideShadow = route && route.customSceneConfig && route.customSceneConfig.hideShadow;
        var cardStyle = route && route.customSceneConfig
            ? route.customSceneConfig.cardStyle
            : null;
        var gestureDistanceSet = false;
        if (route) {
            // If defined, use the gestureResponseDistance override
            if (route.gestureResponseDistance !== undefined && route.gestureResponseDistance !== null) {
                responseDistance = route.gestureResponseDistance;
                gestureDistanceSet = true;
            }
            customSceneConfig = this._convertCustomTransitionConfig(route.customSceneConfig);
            switch (route.sceneConfigType) {
                case Types.NavigatorSceneConfigType.FloatFromBottom:
                    direction = 'vertical';
                    if (!gestureDistanceSet) {
                        responseDistance = 150;
                        gestureDistanceSet = true;
                    }
                    break;
                case Types.NavigatorSceneConfigType.Fade:
                case Types.NavigatorSceneConfigType.FadeWithSlide:
                    direction = 'fade';
                    if (!gestureDistanceSet) {
                        responseDistance = 0;
                        gestureDistanceSet = true;
                    }
                    break;
                // Currently we support only right to left animation
                //case Types.NavigatorSceneConfigType.FloatFromRight:
                //case Types.NavigatorSceneConfigType.FloatFromLeft:
                default:
                    break;
            }
        }
        // Fall back to 30 as a default for responseDistance
        if (!gestureDistanceSet) {
            responseDistance = 30;
        }
        // Conditionally enable gestures
        enableGesture = responseDistance > 0;
        return {
            enableGesture: enableGesture,
            gestureResponseDistance: responseDistance,
            direction: direction,
            customTransitionConfig: customSceneConfig,
            cardStyle: cardStyle,
            hideShadow: hideShadow,
        };
    };
    NavigatorExperimentalDelegate.prototype.handleBackPress = function () {
        this._owner.pop();
    };
    NavigatorExperimentalDelegate.prototype.processCommand = function (commandQueue) {
        // Return if nothing to process
        if (!commandQueue.length) {
            return;
        }
        var previousState = this._state;
        var useNewStateAsScene = false;
        var command = commandQueue.shift();
        var route = command.param.route;
        var value = command.param.value;
        console.log('processing navigation command:', JSON.stringify(command), 'on stack:', JSON.stringify(this._state));
        switch (command.type) {
            case NavigatorCommon_1.CommandType.Push:
                useNewStateAsScene = true;
                this._state = StateUtils.push(this._state, this._createState(route));
                break;
            case NavigatorCommon_1.CommandType.Pop:
                if (route !== undefined) {
                    this._state = this._popToRoute(this._state, route);
                }
                else if (value !== undefined) {
                    if (value > 0) {
                        this._state = this._popN(this._state, value);
                    }
                    else {
                        this._state = this._popToTop(this._state);
                    }
                }
                else {
                    this._state = StateUtils.pop(this._state);
                }
                break;
            case NavigatorCommon_1.CommandType.Replace:
                if (value === -1) {
                    this._state = StateUtils.replaceAtIndex(this._state, this._state.routes.length - 2, this._createState(route));
                }
                else {
                    this._state = StateUtils.replaceAtIndex(this._state, this._state.routes.length - 1, this._createState(route));
                }
                break;
            default:
                console.error('Undefined Navigation command: ', command.type);
                break;
        }
        console.log('stack after execution is:', JSON.stringify(this._state));
        if (previousState !== this._state) {
            if (useNewStateAsScene) {
                this._transitionSpec = this._buildTransitionSpec(this._state);
            }
            else {
                this._transitionSpec = this._buildTransitionSpec(previousState);
            }
            console.log('transition spec:', this._transitionSpec, useNewStateAsScene);
            this._owner.setState({ state: this._state });
        }
    };
    NavigatorExperimentalDelegate.prototype._createState = function (route) {
        return { key: route.routeId.toString(), route: route };
    };
    NavigatorExperimentalDelegate.prototype._createParentState = function (routes, prevState) {
        var _this = this;
        var prevRoutes = prevState.routes;
        var children = _.map(routes, function (element, index) {
            if (prevRoutes.length > index) {
                var prevRoute = prevRoutes[index];
                // Navigator state reducer is a little bit naive,
                // let's make sure it's scene rendering caching would work properly
                if (prevRoute.route.routeId === element.routeId) {
                    return prevRoute;
                }
            }
            return _this._createState(element);
        });
        return { routes: children, index: routes.length - 1 };
    };
    NavigatorExperimentalDelegate.prototype._popToTop = function (state) {
        var popCount = state.routes.length - 1;
        if (popCount > 0) {
            return this._popN(state, popCount);
        }
        return state;
    };
    NavigatorExperimentalDelegate.prototype._popN = function (state, n) {
        assert.ok(n > 0, 'n < 0 please pass positive value');
        var initialRoutes = state.routes;
        var initialLength = initialRoutes.length;
        assert.ok(initialLength >= n, 'navigation stack underflow');
        var result = _.clone(state);
        result.routes = initialRoutes.slice(0, initialLength - n);
        result.index = initialLength - n - 1;
        return result;
    };
    NavigatorExperimentalDelegate.prototype._popToRoute = function (state, route) {
        var popCount = 0;
        for (var i = state.routes.length - 1; i >= 0; i--) {
            var child = state.routes[i];
            if (route.routeId === child.route.routeId) {
                break;
            }
            else {
                popCount++;
            }
        }
        if (popCount > 0) {
            return this._popN(state, popCount);
        }
        else {
            return state;
        }
    };
    return NavigatorExperimentalDelegate;
}(NavigatorCommon_1.NavigatorDelegate));
exports.NavigatorExperimentalDelegate = NavigatorExperimentalDelegate;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NavigatorExperimentalDelegate;
