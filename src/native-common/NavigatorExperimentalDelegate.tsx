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

import _ = require('./lodashMini');
import assert = require('assert');
import React = require('react');
import RN = require('react-native');

import { CommandType, NavigationCommand, NavigatorDelegate, NavigatorState } from './NavigatorCommon';
import Navigation = RN.NavigationExperimental;
import RX = require('../common/Interfaces');
import Types = require('../common/Types');

type NavigationSceneRendererProps = Navigation.NavigationSceneRendererProps;
type NavigationState = Navigation.NavigationState;
type NavigationRoute = Navigation.NavigationRoute;
type NavigationTransitionProps = Navigation.NavigationTransitionProps;

const StateUtils = Navigation.StateUtils;

interface NavigationRouteState extends NavigationRoute {
    route: Types.NavigatorRoute;
}

interface TransitionSpec {
    enableGesture: boolean;
    direction: Navigation.NavigationGestureDirection;
    gestureResponseDistance: number;
    customTransitionConfig?: Navigation.NavigationCustomTransitionConfig;
    cardStyle?: Types.ViewStyleRuleSet;
    hideShadow?: boolean;
}

export class NavigatorExperimentalDelegate extends NavigatorDelegate {

    private _state: NavigationState;
    private _transitionSpec: TransitionSpec;
    private _navigationInProgress: boolean;

    constructor(navigator: RX.Navigator) {
        super(navigator);
        const route: NavigationRouteState = { key: '0', route: { routeId: 0, sceneConfigType: 0 }};
        this._state = { index: 0, routes: [ route ] };
        this._transitionSpec = this._buildTransitionSpec(this._state);
        console.log('initial transition spec is:', this._transitionSpec);
    }

    getRoutes(): Types.NavigatorRoute[] {
        return _.map(this._state.routes, element => {
            const routeState = element as NavigationRouteState;
            return routeState.route;
        });
    }

    // Reset route stack with default route stack
    immediatelyResetRouteStack(nextRouteStack: Types.NavigatorRoute[]): void {
        console.log('Stack state before reset:', this._state);
        const prevState = this._state;
        this._state = this._createParentState(nextRouteStack, prevState);
        this._transitionSpec = this._buildTransitionSpec(this._state);
        console.log('Immediate stack reset:', this._state, this._transitionSpec);
        this._owner.setState({state: this._state});
    }

    // Render without initial route to get a reference for Navigator object
    render(): JSX.Element {
        return (
            <Navigation.CardStack
                direction = { this._transitionSpec.direction }
                customTransitionConfig={ this._transitionSpec.customTransitionConfig }
                navigationState = { this._state }
                onNavigateBack = { this._onNavigateBack }
                onTransitionStart= { this._onTransitionStart }
                onTransitionEnd = { this._onTransitionEnd }
                renderScene={ this._renderScene }
                cardStyle={ this._transitionSpec.cardStyle || this._owner.props.cardStyle }
                hideShadow={ this._transitionSpec.hideShadow }
                enableGestures = { this._transitionSpec.enableGesture }
                gestureResponseDistance = { this._transitionSpec.gestureResponseDistance }
            />
        );
    }

    private _convertCustomTransitionConfig(config: Types.CustomNavigatorSceneConfig): Navigation.NavigationCustomTransitionConfig {
        if (!config) {
            return null;
        }

        let nativeConfig: Navigation.NavigationCustomTransitionConfig = { 
            transitionStyle: config.transitionStyle,
            presentBelowPrevious: config.presentBelowPrevious
        };

        if (config.transitionSpec) {
            let transitionSpec: Navigation.NavigationTransitionSpec = {};
            if (config.transitionSpec.duration) {
                transitionSpec.duration = config.transitionSpec.duration;
            }
            if (config.transitionSpec.easing) {
                transitionSpec.easing = config.transitionSpec.easing.function;
            }
            
            nativeConfig.transitionSpec = transitionSpec;
        }

        return nativeConfig;
    }

    private _buildTransitionSpec(state: NavigationState): TransitionSpec {
        const route = (state.routes[state.index] as NavigationRouteState).route;
        let direction: Navigation.NavigationGestureDirection = 'horizontal';
        let customSceneConfig: Navigation.NavigationCustomTransitionConfig = null;
        let enableGesture: boolean = null;
        let responseDistance: number = null;
        let hideShadow = route && route.customSceneConfig && route.customSceneConfig.hideShadow;
        let cardStyle: Types.ViewStyleRuleSet = route && route.customSceneConfig 
            ? route.customSceneConfig.cardStyle
            : null;
        let gestureDistanceSet = false;

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
    }

    private _onTransitionEnd = () => {
        this._transitionSpec = this._buildTransitionSpec(this._state);
        console.log('onTransitionEnd', this._transitionSpec);
        this._owner.setState({state: this._state});

        if (this._owner.props.transitionCompleted) {
            this._owner.props.transitionCompleted();
        }
    }

    private _onTransitionStart = (transitionProps: NavigationTransitionProps, prevTransitionProps?: NavigationTransitionProps) => {
        console.log('onTransitionStart', this._transitionSpec);
        if (this._owner.props.transitionStarted) {
            const fromIndex = prevTransitionProps && prevTransitionProps.scene ? prevTransitionProps.scene.index : null;
            const toIndex = transitionProps.scene ? transitionProps.scene.index : null;
            const fromRouteId = prevTransitionProps && prevTransitionProps.scene ? prevTransitionProps.scene.route.key : null;
            const toRouteId = transitionProps.scene ? transitionProps.scene.route.key : null;
            this._owner.props.transitionStarted(
                transitionProps.position, 
                toRouteId,
                fromRouteId,
                toIndex, 
                fromIndex);
        }
    }

    // Callback from Navigator.js to RX.Navigator
    private _renderScene = (props: NavigationSceneRendererProps, navigator?: RN.Navigator): JSX.Element => {
        let parentState: NavigationState = props.navigationState;
        let sceneState: NavigationRouteState = parentState.routes[props.scene.index] as NavigationRouteState;

        // Does the route exist?
        if (sceneState && sceneState.route) {
            // Call the renderScene callback.
            return this._owner.props.renderScene(sceneState.route);
        }

        // No route? Return empty scene.
        return <RN.View />;
    }

    handleBackPress(): void {
        this._owner.pop();
    }

    processCommand(commandQueue: NavigationCommand[]): void {
        // Return if nothing to process
        if (!commandQueue.length) {
            return;
        }
        const previousState: NavigationState = this._state;

        let  useNewStateAsScene = false;

        let command = commandQueue.shift();
        let route = command.param.route;
        let value = command.param.value;
        console.log('processing navigation command:', JSON.stringify(command), 'on stack:', JSON.stringify(this._state));
        switch (command.type) {
            case CommandType.Push:
                useNewStateAsScene = true;
                this._state = StateUtils.push(this._state, this._createState(route));
                break;

            case CommandType.Pop:
                if (route !== undefined) {
                    this._state = this._popToRoute(this._state, route);
                } else if (value !== undefined) {
                    if (value > 0) {
                        this._state = this._popN(this._state, value);
                    } else {
                        this._state = this._popToTop(this._state);
                    }
                } else {
                    this._state = StateUtils.pop(this._state);
                }

                break;

            case CommandType.Replace:
                if (value === -1) {
                    this._state = StateUtils.replaceAtIndex(this._state, this._state.routes.length - 2,
                        this._createState(route));
                } else {
                    this._state = StateUtils.replaceAtIndex(this._state, this._state.routes.length - 1,
                        this._createState(route));
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
            } else {
                this._transitionSpec = this._buildTransitionSpec(previousState);
            }
            console.log('transition spec:', this._transitionSpec, useNewStateAsScene);

            this._owner.setState({state: this._state});
        }
    }

    /**
     * This method is going to be deprecated in later releases
    */
    private _onNavigateBack = (action: any) => {
        this.onBackPress();
    }

    private _createState(route: Types.NavigatorRoute): NavigationRouteState {
        return { key: route.routeId.toString(), route: route};
    }

    private _createParentState(routes: Types.NavigatorRoute[], prevState: NavigationState): NavigationState {
        const prevRoutes = prevState.routes as NavigationRouteState[];
        let children = _.map(routes, (element, index) => {
            if (prevRoutes.length > index) {
                const prevRoute = prevRoutes[index];
                // Navigator state reducer is a little bit naive,
                // let's make sure it's scene rendering caching would work properly
                if (prevRoute.route.routeId === element.routeId) {
                    return prevRoute;
                }
            }
            return this._createState(element);
        });

        return { routes: children, index: routes.length - 1 };
    }

    private _popToTop(state: NavigationState): NavigationState {
        const popCount: number = state.routes.length - 1;
        if (popCount > 0) {
            return this._popN(state, popCount);
        }

        return state;
    }

    private _popN(state: NavigationState, n: number): NavigationState {
        assert.ok(n > 0, 'n < 0 please pass positive value');
        const initialRoutes = state.routes;
        const initialLength = initialRoutes.length;
        assert.ok(initialLength >= n, 'navigation stack underflow');

        let result: NavigationState = _.clone(state);
        result.routes = initialRoutes.slice(0, initialLength - n);
        result.index = initialLength - n - 1;
        return result;
    }

    private _popToRoute(state: NavigationState, route: Types.NavigatorRoute): NavigationState {
        let popCount: number = 0;
        for (let i = state.routes.length - 1; i >= 0; i--) {
            const child = state.routes[i] as NavigationRouteState;
            if (route.routeId === child.route.routeId) {
                break;
            } else {
                popCount++;
            }
        }

        if (popCount > 0) {
            return this._popN(state, popCount);
        } else {
            return state;
        }
    }
}

export default NavigatorExperimentalDelegate;
