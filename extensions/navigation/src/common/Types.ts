/**
* Types.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
* Type definitions for reactxp-naviigation extension.
*/

// Use only for type data
import React = require('react');
import RX = require('reactxp');

export type ReactNode = React.ReactNode;

//
// Navigator
// ----------------------------------------------------------------------
export enum NavigatorSceneConfigType {
    FloatFromRight,
    FloatFromLeft,
    FloatFromBottom,
    Fade,
    FadeWithSlide
}

export interface NavigatorRoute {
    routeId: number;
    // Route's animation configuration
    sceneConfigType: NavigatorSceneConfigType;

    // NOTE: The following props are for the experimental navigator.
    // They aren't considered when working with the standard navigator.
    // Optional gesture response distance override
    // 0 is equivalent to disabling gestures
    gestureResponseDistance?: number;
    // Optional custom scene config
    customSceneConfig?: CustomNavigatorSceneConfig;
}

// NOTE: Experimental navigator only
export type NavigationTransitionSpec = {
    duration?: number;

    // NOTE: Elastic and bounce easing will not work as expected due to how the navigator interpolates styles
    easing?: RX.Types.Animated.EasingFunction;
};

// NOTE: Experimental navigator only
export type NavigationTransitionStyleConfig = {
  // By default input range is defined as [index - 1, index, index + 1];
  // Input and output ranges must contain the same number of elements
  inputRange?: number[];
  opacityOutput: number | number[];
  scaleOutput: number | number[];
  translateXOutput: number | number[];
  translateYOutput: number | number[];
};

// NOTE: Experimental navigator only
export type CustomNavigatorSceneConfig = {
  // Optional transition styles
  transitionStyle?: (sceneIndex: number, sceneDimensions: RX.Types.Dimensions) => NavigationTransitionStyleConfig;
  // Optional overrides for duration, easing, and timing
  transitionSpec?: NavigationTransitionSpec;
  // Optional cardStyle override
  cardStyle?: RX.Types.ViewStyleRuleSet;
  // Optionally hide drop shadow
  hideShadow?: boolean;
  // Optionally flip the visual order of the last two scenes
  presentBelowPrevious?: boolean;
};

export interface NavigatorProps extends RX.CommonProps {
  renderScene: (route: NavigatorRoute) => JSX.Element | undefined;
  navigateBackCompleted?: () => void;
  // NOTE: Arguments are only passed to transitionStarted by the experimental navigator
  transitionStarted?: (progress?: RX.Types.AnimatedValue,
  toRouteId?: string, fromRouteId?: string,
  toIndex?: number, fromIndex?: number) => void;
  transitionCompleted?: () => void;
  cardStyle?: RX.Types.ViewStyleRuleSet;
  children?: ReactNode;
  // Selector of the navigator delegate. Currently make difference only in react-native.
  delegateSelector?: NavigatorDelegateSelector;
}

export enum CommandType {
    Push,
    Pop,
    Replace
}

export interface CommandParam {
    route?: NavigatorRoute;
    value?: number;
}

export interface NavigationCommand {
    type: CommandType;
    param: CommandParam;
}

// Empty state
export interface NavigatorState {
}

export abstract class Navigator<S> extends React.Component<NavigatorProps, S> {
    abstract push(route: NavigatorRoute): void;
    abstract pop(): void;
    abstract replace(route: NavigatorRoute): void;
    abstract replacePrevious(route: NavigatorRoute): void;
    abstract replaceAtIndex(route: NavigatorRoute, index: number): void;
    abstract immediatelyResetRouteStack(nextRouteStack: NavigatorRoute[]): void;
    abstract popToRoute(route: NavigatorRoute): void;
    abstract popToTop(): void;
    abstract getCurrentRoutes(): NavigatorRoute[];
}

export interface NavigatorDelegateSelector {
    getNavigatorDelegate(navigator: Navigator<NavigatorState>): NavigatorDelegate;
}

export abstract class NavigatorDelegate {
    protected _owner: Navigator<NavigatorState>;

    constructor(navigator: Navigator<NavigatorState>) {
        this._owner = navigator;
    }

    onBackPress = (): boolean => {
        const routes = this.getRoutes();
        if (routes.length > 1) {
            this.handleBackPress();

            if (this._owner.props.navigateBackCompleted) {
                this._owner.props.navigateBackCompleted();
            }

             // Indicate that we handled the event.
            return true;
        }

        return false;
    }

    abstract getRoutes(): NavigatorRoute[];
    abstract immediatelyResetRouteStack(nextRouteStack: NavigatorRoute[]): void;
    abstract render(): JSX.Element;
    abstract processCommand(commandQueue: NavigationCommand[]): void;
    abstract handleBackPress(): void;
}
