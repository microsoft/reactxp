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

import * as React from 'react';
import * as RN from 'react-native';
import * as RX from 'reactxp';
import * as Navigation from 'reactxp-experimental-navigation';

import assert from '../common/assert';
import * as _ from '../common/lodashMini';
import {
    CommandType,
    CustomNavigatorSceneConfig,
    Navigator,
    NavigatorSceneConfigType,
    NavigationCommand,
    NavigatorDelegate,
    NavigatorRoute,
    NavigatorState,
} from '../common/Types';

type NavigationSceneRendererProps = Navigation.NavigationSceneRendererProps;
type NavigationState = Navigation.NavigationState;
type NavigationRoute = Navigation.NavigationRoute;
type NavigationTransitionProps = Navigation.NavigationTransitionProps;

const StateUtils = Navigation.StateUtils;

interface NavigationRouteState extends NavigationRoute {
    route: NavigatorRoute;
}

interface TransitionSpec {
    enableGesture: boolean;
    direction: Navigation.NavigationGestureDirection;
    gestureResponseDistance: number;
    customTransitionConfig?: Navigation.NavigationCustomTransitionConfig;
    cardStyle?: RX.Types.ViewStyleRuleSet;
    hideShadow?: boolean;
}

export class NavigatorExperimentalDelegate extends NavigatorDelegate {

    private _state: Navigation.NavigationState;
    private _transitionSpec: TransitionSpec;

    constructor(navigator: Navigator<NavigatorState>) {
        super(navigator);
        const route: NavigationRouteState = { key: '0', route: { routeId: 0, sceneConfigType: 0 } };
        this._state = { index: 0, routes: [route] };
        this._transitionSpec = this._buildTransitionSpec(this._state);
    }

    getRoutes(): NavigatorRoute[] {
        return _.map(this._state.routes, element => {
            const routeState = element as NavigationRouteState;
            return routeState.route;
        });
    }

    // Reset route stack with default route stack
    immediatelyResetRouteStack(nextRouteStack: NavigatorRoute[]): void {
        const prevState = this._state;
        this._state = this._createParentState(nextRouteStack, prevState);
        this._transitionSpec = this._buildTransitionSpec(this._state);
        this._owner.setState({ state: this._state });
    }

    // Render without initial route to get a reference for Navigator object
    render(): JSX.Element {
        return (
            <Navigation.CardStack
                direction={ this._transitionSpec.direction }
                customTransitionConfig={ this._transitionSpec.customTransitionConfig }
                navigationState={ this._state }
                onNavigateBack={ this._onNavigateBack }
                onTransitionStart={ this._onTransitionStart }
                onTransitionEnd={ this._onTransitionEnd }
                renderScene={ this._renderScene }
                cardStyle={ this._transitionSpec.cardStyle || this._owner.props.cardStyle }
                hideShadow={ this._transitionSpec.hideShadow }
                enableGestures={ this._transitionSpec.enableGesture }
                gestureResponseDistance={ this._transitionSpec.gestureResponseDistance }
            />
        );
    }

    private _convertCustomTransitionConfig(
            config: CustomNavigatorSceneConfig | undefined): Navigation.NavigationCustomTransitionConfig | undefined {
        if (!config) {
            return undefined;
        }

        const nativeConfig: Navigation.NavigationCustomTransitionConfig = {
            transitionStyle: config.transitionStyle,
            presentBelowPrevious: config.presentBelowPrevious,
        };

        if (config.transitionSpec) {
            const transitionSpec: Navigation.NavigationTransitionSpec = {};
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

    private _buildTransitionSpec(state: Navigation.NavigationState): TransitionSpec {
        const route = (state.routes[state.index] as NavigationRouteState).route;
        let direction: Navigation.NavigationGestureDirection = 'horizontal';
        let customSceneConfig: Navigation.NavigationCustomTransitionConfig | undefined;
        let enableGesture = false;
        let responseDistance = 0;
        const hideShadow = route && route.customSceneConfig && route.customSceneConfig.hideShadow;
        const cardStyle: RX.Types.ViewStyleRuleSet | undefined = route && route.customSceneConfig
            ? route.customSceneConfig.cardStyle
            : undefined;
        let gestureDistanceSet = false;

        if (route) {
            // If defined, use the gestureResponseDistance override
            if (route.gestureResponseDistance !== undefined && route.gestureResponseDistance !== null) {
                responseDistance = route.gestureResponseDistance;
                gestureDistanceSet = true;
            }
            customSceneConfig = this._convertCustomTransitionConfig(route.customSceneConfig);
            switch (route.sceneConfigType) {
                case NavigatorSceneConfigType.FloatFromBottom:
                    direction = 'vertical';
                    if (!gestureDistanceSet) {
                        responseDistance = 150;
                        gestureDistanceSet = true;
                    }
                    break;
                case NavigatorSceneConfigType.Fade:
                case NavigatorSceneConfigType.FadeWithSlide:
                    direction = 'fade';
                    if (!gestureDistanceSet) {
                        responseDistance = 0;
                        gestureDistanceSet = true;
                    }
                    break;
                // Currently we support only right to left animation
                // case NavigatorSceneConfigType.FloatFromRight:
                // case NavigatorSceneConfigType.FloatFromLeft:
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
        this._owner.setState({ state: this._state });

        if (this._owner.props.transitionCompleted) {
            this._owner.props.transitionCompleted();
        }
    };

    private _onTransitionStart = (transitionProps: NavigationTransitionProps, prevTransitionProps?: NavigationTransitionProps) => {
        if (this._owner.props.transitionStarted) {
            const fromIndex = prevTransitionProps && prevTransitionProps.scene ? prevTransitionProps.scene.index : undefined;
            const toIndex = transitionProps.scene ? transitionProps.scene.index : undefined;
            const fromRouteId = prevTransitionProps && prevTransitionProps.scene ? prevTransitionProps.scene.route.key : undefined;
            const toRouteId = transitionProps.scene ? transitionProps.scene.route.key : undefined;
            this._owner.props.transitionStarted(
                transitionProps.position,
                toRouteId,
                fromRouteId,
                toIndex,
                fromIndex);
        }
    };

    // Callback from Navigator.js to RX.Navigator
    private _renderScene = (props: NavigationSceneRendererProps): JSX.Element => {
        const parentState: NavigationState = props.navigationState;
        const sceneState: NavigationRouteState = parentState.routes[props.scene.index] as NavigationRouteState;

        // Does the route exist?
        if (sceneState && sceneState.route) {
            // Call the renderScene callback.
            return this._owner.props.renderScene(sceneState.route);
        }

        // No route? Return empty scene.
        return <RN.View />;
    };

    handleBackPress(): void {
        this._owner.pop();
    }

    processCommand(commandQueue: NavigationCommand[]): void {
        // Return if nothing to process
        if (!commandQueue.length) {
            return;
        }
        const previousState: NavigationState = this._state;

        let useNewStateAsScene = false;

        const command = commandQueue.shift()!;
        const route = command.param.route;
        const value = command.param.value;

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

        if (previousState !== this._state) {
            if (useNewStateAsScene) {
                this._transitionSpec = this._buildTransitionSpec(this._state);
            } else {
                this._transitionSpec = this._buildTransitionSpec(previousState);
            }

            this._owner.setState({ state: this._state });
        }
    }

    /**
     * This method is going to be deprecated in later releases
    */
    private _onNavigateBack = () => {
        this.onBackPress();
    };

    private _createState(route: NavigatorRoute): NavigationRouteState {
        return { key: route.routeId.toString(), route: route };
    }

    private _createParentState(routes: NavigatorRoute[], prevState: NavigationState): NavigationState {
        const prevRoutes = prevState.routes as NavigationRouteState[];
        const children = _.map(routes, (element: NavigatorRoute, index: number) => {
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
        assert(n > 0, 'n < 0 please pass positive value');
        const initialRoutes = state.routes;
        const initialLength = initialRoutes.length;
        assert(initialLength >= n, 'navigation stack underflow');

        const result: NavigationState = _.clone(state);
        result.routes = initialRoutes.slice(0, initialLength - n);
        result.index = initialLength - n - 1;
        return result;
    }

    private _popToRoute(state: NavigationState, route: NavigatorRoute): NavigationState {
        let popCount = 0;
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
