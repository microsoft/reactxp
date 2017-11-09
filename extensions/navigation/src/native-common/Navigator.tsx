/**
* Navigator.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common native implementation for Navigator on mobile.
*/

import RN = require('react-native');
import React = require('react');
import RX = require('reactxp');

import {
    Navigator as BaseNavigator,
    NavigatorDelegate,
    NavigatorDelegateSelector as DelegateSelector,
    NavigationCommand,
    NavigatorState,
    CommandType
} from '../common/Types';

import NavigatorExperimentalDelegate from './NavigatorExperimentalDelegate';
import { NavigatorProps, NavigatorRoute } from '../common/Types';
import Types = require('../common/Types');

export class DefaultDelegateSelector implements DelegateSelector {
    getNavigatorDelegate(navigator: BaseNavigator<NavigatorState>) {
            return new NavigatorExperimentalDelegate(navigator);
    }
}

export class NavigatorImpl extends BaseNavigator<NavigatorState> {
    private _delegate: NavigatorDelegate;
    private _commandQueue: NavigationCommand[] = [];

    constructor(initialProps: NavigatorProps) {
        super(initialProps);
        if (!initialProps.delegateSelector) {
            this._delegate = new NavigatorExperimentalDelegate(this);
        } else {
            this._delegate = initialProps.delegateSelector.getNavigatorDelegate(this);
        }
    }

    componentDidMount() {
        RX.Input.backButtonEvent.subscribe(this._delegate.onBackPress);
    }

    componentWillUnmount() {
        RX.Input.backButtonEvent.unsubscribe(this._delegate.onBackPress);
    }

    componentDidUpdate() {
        // Catch up with any pending commands
        this._processCommand();
    }

    protected getRoutes(): NavigatorRoute[] {
       return this._delegate.getRoutes();
    }

    // Push a new route if initial route doesn't exist
    public push(route: NavigatorRoute): void {
        this._enqueueCommand({
            type: CommandType.Push,
            param: {
                route: route
            }
        });
    }

    public pop(): void {
        this._enqueueCommand({
            type: CommandType.Pop,
            param: {}
        });
    }

    public replace(route: NavigatorRoute): void {
        this._enqueueCommand({
            type: CommandType.Replace,
            param: {
                route: route
            }
        });
    }

    public replacePrevious(route: NavigatorRoute): void {
        this._enqueueCommand({
            type: CommandType.Replace,
            param: {
                route: route,
                value: -1
            }
        });
    }

    // This method replaces the route at the given index of the stack and pops to that index.
    public replaceAtIndex(route: NavigatorRoute, index: number): void {
        let routes = this.getRoutes();

        // Pop to index route and then replace if not last one
        if (index < routes.length - 1) {
            let route = routes[index];
            this.popToRoute(route);
        }

        // Schedule a replace
        this.replace(route);
    }

    // Reset route stack with default route stack
    public immediatelyResetRouteStack(nextRouteStack: NavigatorRoute[]): void {
       this._delegate.immediatelyResetRouteStack(nextRouteStack);
    }

    public popToRoute(route: NavigatorRoute): void {
        this._enqueueCommand({
            type: CommandType.Pop,
            param: {
                route: route
            }
        });
    }

    public popToTop(): void {
        this._enqueueCommand({
            type: CommandType.Pop,
            param: {
                value: -1
            }
        });
    }

    public getCurrentRoutes(): NavigatorRoute[] {
        return this.getRoutes();
    }

    // Render without initial route to get a reference for Navigator object
    public render(): JSX.Element {
        return this._delegate.render();
    }

    private _enqueueCommand(command: NavigationCommand): void {
        this._commandQueue.push(command);
        this._processCommand();
    }

    private _processCommand(): void {
        this._delegate.processCommand(this._commandQueue);
    }
}

export import Types = Types;
export default NavigatorImpl;
export const Navigator = NavigatorImpl;
export const NavigatorDelegateSelector = new DefaultDelegateSelector();
