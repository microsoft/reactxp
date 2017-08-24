/**
* NavigatorStandardDelegate.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Delegate which encapsulates standard react-native Navigator experience.
*/

import _ = require('../common/lodashMini');
import React = require('react');
import RN = require('react-native');

// Navigator is deprecated and moved to separate package. But this version not compatible with rn 42
let RNNavigator: typeof RN.Navigator;
if (RN.Navigator === undefined) {
    RNNavigator = require('react-native-deprecated-custom-components').Navigator;
} else {
    RNNavigator = RN.Navigator;
}

import {
    CommandType,
    NavigationCommand,
    Navigator,
    NavigatorDelegate,
    NavigatorRoute,
    NavigatorSceneConfigType,
    NavigatorState
} from '../common/Types';

export class NavigatorStandardDelegate extends NavigatorDelegate {
    private _navigator: RN.Navigator;

    constructor(navigator: Navigator<NavigatorState>) {
        super(navigator);
    }

    getRoutes(): NavigatorRoute[] {
        return (this._navigator && this._navigator.getCurrentRoutes() as NavigatorRoute[]) || [];
    }

    // Reset route stack with default route stack
    immediatelyResetRouteStack(nextRouteStack: NavigatorRoute[]): void {
        this._navigator.immediatelyResetRouteStack(nextRouteStack);
    }

    render(): JSX.Element {
        return (
            <RNNavigator
                renderScene={ this._renderScene }
                configureScene={ this._configureNativeScene }
                sceneStyle={ this._owner.props.cardStyle }
                onWillFocus={ this._onRouteWillFocus }
                onDidFocus={ this._onRouteDidFocus }
                ref={ this._ref }
            />
        );
     }

    private _ref = (navigator: RN.Navigator): void => {
        this._navigator = navigator;
    }

    private _renderScene = (route: NavigatorRoute, navigator?: RN.Navigator): JSX.Element => {
        // route exists?
        if (route) {
            // call the renderScene callback sent from SkypeXNavigator
            return this._owner.props.renderScene(route);
        }
        // no route? return empty scene
        return <RN.View />;
    }

    // Try to remove this handling by scheduling as it's done in experimental
    handleBackPress(): void {
        this._navigator.pop();
    }

    // Returns object from RN.Navigator.SceneConfigs types (looks like NavigatorSceneConfig for web)
    private _configureNativeScene = (route: NavigatorRoute, routeStack?: NavigatorRoute[]): any => {
        // route exists?
        if (route) {
            switch (route.sceneConfigType) {
                case NavigatorSceneConfigType.FloatFromRight:
                    return RNNavigator.SceneConfigs.FloatFromRight;

                case NavigatorSceneConfigType.FloatFromLeft:
                    return RNNavigator.SceneConfigs.FloatFromLeft;

                case NavigatorSceneConfigType.FloatFromBottom:
                    return RNNavigator.SceneConfigs.FloatFromBottom;

                case NavigatorSceneConfigType.Fade:
                    // FadeAndroid is also supported on iOS.
                    return RNNavigator.SceneConfigs.FadeAndroid;

                case NavigatorSceneConfigType.FadeWithSlide:
                    // TODO: Task http://skype.vso.io/544843 - Implement the FadeWithSlide animation for RN
                    // FadeAndroid is also supported on iOS.
                    return RNNavigator.SceneConfigs.FadeAndroid;

                default:
                    return RNNavigator.SceneConfigs.FloatFromRight;
            }
        }
    }

    private _onRouteWillFocus = (route: NavigatorRoute): void => {
        if (!this._navigator) {
            return;
        }

        // Check if we've popped via gesture.  This is kind of gross, but RN doesn't
        // provide an interface we can use to check this
        if ((this._navigator.state as any).activeGesture !== 'pop') {
            return;
        }

        const currentRoutes = this._navigator.getCurrentRoutes() as NavigatorRoute[];
        const focusIndex = _.findIndex(currentRoutes, currRoute => route.routeId === currRoute.routeId );
        if (focusIndex === -1) {
            // Not found, nothing to do
            return;
        }

        if (this._owner.props.transitionStarted) {
            this._owner.props.transitionStarted();
        }

        if (focusIndex === currentRoutes.length - 2) {
            // A swipe-back pop occurred since we're focusing the view 1 below the top
            if (this._owner.props.navigateBackCompleted) {
                this._owner.props.navigateBackCompleted();
            }
        }
    }

    private _onRouteDidFocus = (): void => {
        if (this._owner.props.transitionCompleted) {
            this._owner.props.transitionCompleted();
        }
    }

    processCommand(commandQueue: NavigationCommand[]): void {
        // Return if nothing to process
        if (!this._navigator || !commandQueue.length) {
            return;
        }

        let command = commandQueue.shift();
        let route = command.param.route;
        let value = command.param.value;

        switch (command.type) {
            case CommandType.Push:
                // console.log('[Navigator] <== push(route)');
                this._navigator.push(route);
                break;

            case CommandType.Pop:
                if (route !== undefined) {
                    // console.log(`[Navigator] <== popToRoute(${this._findIOSRouteIndex(route)})`);
                    this._navigator.popToRoute(route);
                } else if (value !== undefined) {
                    // console.log(`[Navigator] <== ${value > 0 ? 'popN' : 'popToTop'}(${value}))`);
                    if (value > 0) {
                        var popCount = value;
                        while (popCount > 0) {
                            this._navigator.pop();
                            popCount--;
                        }
                    } else {
                        this._navigator.popToTop();
                    }

                } else {
                    // console.log(`[Navigator] <== pop()`);
                    this._navigator.pop();
                }

                break;

            case CommandType.Replace:
                // console.log(`[Navigator] <== replace(${this._findIOSRouteIndex(route)}, ${value})`);
                value === -1 ? this._navigator.replacePrevious(route) : this._navigator.replace(route);
                break;

            default:
                console.error('Undefined Navigation command: ', command.type);
                break;
        }
    }
}

export default NavigatorStandardDelegate;
