/*
* Navigator.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web specific implementation of Navigator. This is inspired from React.Navigator.
* This component is set with props, which are callback methods. It is primarily driven
* by state updates instigated by its public helpers like immediatelyResetRouteStack, push,
* pop, which update the state and cause transitions.
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
var rebound = require("rebound");
var NavigatorSceneConfigFactory_1 = require("./NavigatorSceneConfigFactory");
var RX = require("../common/Interfaces");
var Styles_1 = require("./Styles");
var View_1 = require("./View");
// Default styles
var _styles = {
    container: Styles_1.default.createViewStyle({
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'stretch',
        overflow: 'hidden'
    }),
    defaultSceneStyle: Styles_1.default.createViewStyle({
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
    }),
    baseScene: Styles_1.default.createViewStyle({
        position: 'absolute',
        overflow: 'hidden',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
    }),
    disabledScene: Styles_1.default.createViewStyle({
        top: 0,
        bottom: 0,
        flex: 1
    }),
    transitioner: Styles_1.default.createViewStyle({
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
        overflow: 'hidden',
        alignItems: 'stretch'
    }),
    sceneStyle: Styles_1.default.createViewStyle({
        flex: 1,
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 40,
        shadowColor: 'rgba(0, 0, 0, 0.2)'
    })
};
var Navigator = (function (_super) {
    __extends(Navigator, _super);
    // Receives initial props and sets initial state for Navigator
    function Navigator(initialProps) {
        var _this = _super.call(this, initialProps) || this;
        // Keep a map of all rendered scenes, keyed off their routeId
        _this._renderedSceneMap = {};
        // Default navigator state
        _this.state = {
            sceneConfigStack: [],
            routeStack: [],
            transitionQueue: []
        };
        return _this;
    }
    Navigator.prototype.componentWillMount = function () {
        var _this = this;
        this.springSystem = new rebound.SpringSystem();
        this.spring = this.springSystem.createSpring();
        this.spring.setRestSpeedThreshold(0.05);
        this.spring.setCurrentValue(0).setAtRest();
        this.spring.addListener({
            onSpringUpdate: function () {
                _this._handleSpringUpdate();
            },
            onSpringAtRest: function () {
                _this._completeTransition();
            }
        });
    };
    Navigator.prototype.componentDidMount = function () {
        this._updateDimensionsCache();
        this._handleSpringUpdate();
    };
    Navigator.prototype.componentDidUpdate = function () {
        this._updateDimensionsCache();
    };
    Navigator.prototype.render = function () {
        var _this = this;
        var newRenderedSceneMap = {};
        var scenes;
        if (this.state.routeStack.length > 0) {
            scenes = this.state.routeStack.map(function (route, index) {
                var renderedScene;
                if (_this._renderedSceneMap[route.routeId] &&
                    index !== _this.state.presentedIndex) {
                    renderedScene = _this._renderedSceneMap[route.routeId];
                }
                else {
                    renderedScene = _this._renderNavigatorScene(route, index);
                }
                newRenderedSceneMap[route.routeId] = renderedScene;
                return renderedScene;
            });
        }
        else {
            scenes = [];
        }
        this._renderedSceneMap = _.clone(newRenderedSceneMap);
        return (React.createElement(View_1.default, { key: 'container', style: _styles.container },
            React.createElement(View_1.default, { style: _styles.transitioner, ref: 'transitioner' }, scenes)));
    };
    // Public Navigator Helper methods. These methods modify Navigator state, which kicks of
    // re-renders for the Navigator
    Navigator.prototype.jumpTo = function (route) {
        var destIndex = this.state.routeStack.indexOf(route);
        this._jumpN(destIndex - this.state.presentedIndex);
    };
    Navigator.prototype.jumpForward = function () {
        this._jumpN(1);
    };
    Navigator.prototype.jumpBack = function () {
        this._jumpN(-1);
    };
    Navigator.prototype.push = function (route) {
        var _this = this;
        this._invariant(!!route, 'Must supply route to push');
        var activeLength = this.state.presentedIndex + 1;
        var activeStack = this.state.routeStack.slice(0, activeLength);
        var activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength);
        var nextStack = activeStack.concat([route]);
        var destIndex = nextStack.length - 1;
        var nextAnimationConfigStack = activeAnimationConfigStack.concat([
            this._getSceneConfigFromRoute(route)
        ]);
        this.setState({
            routeStack: nextStack,
            sceneConfigStack: nextAnimationConfigStack
        }, function () {
            _this._enableScene(destIndex);
            _this._transitionTo(destIndex);
        });
    };
    Navigator.prototype.immediatelyResetRouteStack = function (nextRouteStack) {
        var _this = this;
        var destIndex = nextRouteStack.length - 1;
        this.setState({
            // Build a sceneConfigStack
            sceneConfigStack: _.map(nextRouteStack, function (route) { return _this._getSceneConfigFromRoute(route); }),
            routeStack: nextRouteStack,
            presentedIndex: destIndex,
            transitionFromIndex: null,
            transitionQueue: []
        }, function () {
            _this._handleSpringUpdate();
        });
    };
    Navigator.prototype.pop = function () {
        if (this.state.transitionQueue.length) {
            // This is the workaround to prevent user from firing multiple `pop()` calls that may pop the routes beyond
            // the limit. Because `this.state.presentedIndex` does not update until the transition starts, we can't
            // reliably use `this.state.presentedIndex` to know whether we can safely keep popping the routes or not at
            // this moment.
            return;
        }
        if (this.state.presentedIndex > 0) {
            this._popN(1);
        }
    };
    // This method replaces the route at the given index of the stack and pops to that index.
    Navigator.prototype.replaceAtIndex = function (route, index) {
        this._invariant(!!route, 'Must supply route to replace');
        if (index < 0) {
            index += this.state.routeStack.length;
        }
        if (this.state.routeStack.length <= index) {
            return;
        }
        var nextRouteStack = this.state.routeStack.slice(0, index + 1);
        var nextAnimationModeStack = this.state.sceneConfigStack.slice(0, index + 1);
        nextRouteStack[index] = route;
        nextAnimationModeStack[index] = this._getSceneConfigFromRoute(route);
        this.setState({
            routeStack: nextRouteStack,
            sceneConfigStack: nextAnimationModeStack
        });
    };
    Navigator.prototype.replace = function (route) {
        this.replaceAtIndex(route, this.state.presentedIndex);
    };
    Navigator.prototype.replacePrevious = function (route) {
        this.replaceAtIndex(route, this.state.presentedIndex - 1);
    };
    Navigator.prototype.popToTop = function () {
        this.popToRoute(this.state.routeStack[0]);
    };
    Navigator.prototype.popToRoute = function (route) {
        var indexOfRoute = this.state.routeStack.indexOf(route);
        this._invariant(indexOfRoute !== -1, 'Calling popToRoute for a route that doesn\'t exist!');
        var numToPop = this.state.presentedIndex - indexOfRoute;
        this._popN(numToPop);
    };
    Navigator.prototype.replacePreviousAndPop = function (route) {
        if (this.state.routeStack.length < 2) {
            return;
        }
        this.replacePrevious(route);
        this.pop();
    };
    Navigator.prototype.getCurrentRoutes = function () {
        // Clone before returning to avoid caller mutating the stack.
        return this.state.routeStack.slice();
    };
    Navigator.prototype._updateDimensionsCache = function () {
        var transitioner = ReactDOM.findDOMNode(this.refs['transitioner']);
        this._dimensions = {
            width: transitioner.offsetWidth,
            height: transitioner.offsetHeight
        };
    };
    // Helper method to extract Navigator's Scene config from the route
    Navigator.prototype._getSceneConfigFromRoute = function (route) {
        // route exists? query the factory to generate a scene configuration
        if (route) {
            return NavigatorSceneConfigFactory_1.NavigatorSceneConfigFactory.createConfig(route.sceneConfigType);
        }
        return null;
    };
    // Render a scene for the navigator
    Navigator.prototype._renderNavigatorScene = function (route, index) {
        var styles = [_styles.baseScene, _styles.sceneStyle,
            _styles.defaultSceneStyle];
        if (index !== this.state.presentedIndex) {
            // update styles
            styles.push(_styles.disabledScene);
        }
        // Wraps the callback passed as a prop to Navigator to render the scene
        return (React.createElement(View_1.default, { key: 'scene_' + this._getRouteID(route), ref: 'scene_' + index, style: styles }, this.props.renderScene(route)));
    };
    // Push a scene below the others so they don't block touches sent to the presented scenes.
    Navigator.prototype._disableScene = function (sceneIndex) {
        if (this.refs['scene_' + sceneIndex]) {
            this._setNativeStyles(this.refs['scene_' + sceneIndex], {
                opacity: 0,
                zIndex: -10
            });
        }
    };
    // Add styles on the scene - At this time, the scene should be mounted and sitting in the
    // DOM. We are just adding giving styles to this current scene.
    Navigator.prototype._enableScene = function (sceneIndex) {
        var sceneStyle = Styles_1.default.combine(null, [_styles.baseScene, _styles.sceneStyle, _styles.defaultSceneStyle]);
        // Then restore the top value for this scene.
        var enabledSceneNativeProps = {
            style: {
                top: sceneStyle['top'],
                bottom: sceneStyle['bottom'],
                zIndex: 0
            }
        };
        if (sceneIndex !== this.state.transitionFromIndex &&
            sceneIndex !== this.state.presentedIndex) {
            // If we are not in a transition from this index, make sure opacity is 0 to prevent the enabled scene from
            // flashing over the presented scene.
            enabledSceneNativeProps.style.opacity = 0;
        }
        if (this.refs['scene_' + sceneIndex]) {
            this._setNativeStyles(this.refs['scene_' + sceneIndex], enabledSceneNativeProps.style);
        }
    };
    Navigator.prototype._transitionTo = function (destIndex, velocity, jumpSpringTo, cb) {
        // If we're already presenting this index, bail here.
        if (destIndex === this.state.presentedIndex) {
            return;
        }
        // If we're already transitioning to another index, queue this one.
        if (this.state.transitionFromIndex !== null) {
            var newTransitionQueue = _.cloneDeep(this.state.transitionQueue);
            newTransitionQueue.push({
                destIndex: destIndex,
                velocity: velocity,
                transitionFinished: cb
            });
            // set new transition queue
            this.setState({ transitionQueue: newTransitionQueue });
            return;
        }
        // Set new state values.
        this.state.transitionFromIndex = this.state.presentedIndex;
        this.state.presentedIndex = destIndex;
        this.state.transitionFinished = cb;
        // Grab the scene config from the route we're leaving.
        var sceneConfig = this.state.sceneConfigStack[this.state.transitionFromIndex] ||
            this.state.sceneConfigStack[this.state.presentedIndex];
        this._invariant(!!sceneConfig, 'Cannot configure scene at index ' + this.state.transitionFromIndex);
        // Set the spring in motion. Updates will trigger _handleSpringUpdate.
        if (jumpSpringTo != null) {
            this.spring.setCurrentValue(jumpSpringTo);
        }
        this.spring.setOvershootClampingEnabled(true);
        this.spring.getSpringConfig().friction = sceneConfig.springFriction;
        this.spring.getSpringConfig().tension = sceneConfig.springTension;
        this.spring.setVelocity(velocity || sceneConfig.defaultTransitionVelocity);
        this.spring.setEndValue(1);
        if (this.props.transitionStarted) {
            this.props.transitionStarted();
        }
    };
    Navigator.prototype._completeTransition = function () {
        var newState = {};
        this.state.transitionFromIndex = null;
        this.spring.setCurrentValue(0).setAtRest();
        this._hideScenes();
        // Do we have pending transitions? trigger transitions then
        if (this.state.transitionQueue.length) {
            var newTransitionQueue = _.cloneDeep(this.state.transitionQueue);
            var queuedTransition = newTransitionQueue.shift();
            // add styles on the scene we are about to transition to
            this._enableScene(queuedTransition.destIndex);
            this._transitionTo(queuedTransition.destIndex, queuedTransition.velocity, null, queuedTransition.transitionFinished);
            if (this.state.transitionFinished) {
                this.state.transitionFinished();
                newState.transitionFinished = null;
            }
            newState.transitionQueue = newTransitionQueue;
            // New setState
            this.setState(newState);
        }
        else if (this.props.transitionCompleted) {
            this.props.transitionCompleted();
        }
    };
    Navigator.prototype._hideScenes = function () {
        for (var i = 0; i < this.state.routeStack.length; i++) {
            if (i === this.state.presentedIndex ||
                i === this.state.transitionFromIndex) {
                continue;
            }
            this._disableScene(i);
        }
    };
    // This happens for each frame of either a gesture or a transition. If both are happening, we only set values for
    // the transition and the gesture will catch up later.
    Navigator.prototype._handleSpringUpdate = function () {
        // Prioritize handling transition in progress over a gesture:
        if (this.state.transitionFromIndex != null) {
            this._transitionBetween(this.state.transitionFromIndex, this.state.presentedIndex, this.spring.getCurrentValue());
        }
    };
    Navigator.prototype._transitionSceneStyle = function (fromIndex, toIndex, progress, index) {
        var viewAtIndex = this.refs['scene_' + index];
        if (viewAtIndex === null || viewAtIndex === undefined) {
            return;
        }
        // Use toIndex animation when we move forwards. Use fromIndex when we move back.
        var sceneConfigIndex = fromIndex < toIndex ? toIndex : fromIndex;
        var sceneConfig = this.state.sceneConfigStack[sceneConfigIndex];
        // This happens for overswiping when there is no scene at toIndex.
        if (!sceneConfig) {
            sceneConfig = this.state.sceneConfigStack[sceneConfigIndex - 1];
        }
        var styleToUse = {};
        var useFn = index < fromIndex || index < toIndex ?
            sceneConfig.animationInterpolators.out :
            sceneConfig.animationInterpolators.into;
        var directionAdjustedProgress = fromIndex < toIndex ? progress : 1 - progress;
        var didChange = useFn(styleToUse, this._dimensions, directionAdjustedProgress);
        if (didChange) {
            this._setNativeStyles(viewAtIndex, styleToUse);
        }
    };
    Navigator.prototype._transitionBetween = function (fromIndex, toIndex, progress) {
        this._transitionSceneStyle(fromIndex, toIndex, progress, fromIndex);
        this._transitionSceneStyle(fromIndex, toIndex, progress, toIndex);
    };
    Navigator.prototype._getDestIndexWithinBounds = function (n) {
        var currentIndex = this.state.presentedIndex;
        var destIndex = currentIndex + n;
        this._invariant(destIndex >= 0, 'Cannot jump before the first route.');
        var maxIndex = this.state.routeStack.length - 1;
        this._invariant(maxIndex >= destIndex, 'Cannot jump past the last route.');
        return destIndex;
    };
    Navigator.prototype._jumpN = function (n) {
        var destIndex = this._getDestIndexWithinBounds(n);
        this._invariant(destIndex !== -1, 'Cannot jump to route that is not in the route stack');
        this._enableScene(destIndex);
        this._transitionTo(destIndex);
    };
    Navigator.prototype._popN = function (n) {
        var _this = this;
        if (n === 0) {
            return;
        }
        this._invariant(this.state.presentedIndex - n >= 0, 'Cannot pop below zero');
        var popIndex = this.state.presentedIndex - n;
        this._enableScene(popIndex);
        this._transitionTo(popIndex, null, // default velocity
        null, // no spring jumping
        function () {
            _this._cleanScenesPastIndex(popIndex);
        });
    };
    Navigator.prototype._cleanScenesPastIndex = function (index) {
        var newStackLength = index + 1;
        // Remove any unneeded rendered routes.
        if (newStackLength < this.state.routeStack.length) {
            this.setState({
                sceneConfigStack: this.state.sceneConfigStack.slice(0, newStackLength),
                routeStack: this.state.routeStack.slice(0, newStackLength)
            });
        }
    };
    // Get routeId for the incoming route
    Navigator.prototype._getRouteID = function (route) {
        return route.routeId;
    };
    // Define an inconstiant method like React.Navigator
    Navigator.prototype._invariant = function (test, failureMessage) {
        if (!test) {
            throw failureMessage;
        }
    };
    // Manually override the styles in the DOM for the given component. This method is a hacky equivalent of React Native's
    // setNativeProps.
    Navigator.prototype._setNativeStyles = function (component, currentStyles) {
        // Grab the actual element from the DOM.
        var element = ReactDOM.findDOMNode(component);
        var flatStyles = _.isArray(currentStyles) ? _.flatten(currentStyles) : currentStyles;
        // Modify styles
        _.assign(element.style, flatStyles);
    };
    return Navigator;
}(RX.Navigator));
exports.Navigator = Navigator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navigator;
