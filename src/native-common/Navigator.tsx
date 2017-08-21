/**
* Navigator.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common native implementation for Navigator on mobile.
*/

import React = require('react');
import RN = require('react-native');
import RX = require('../common/Interfaces');

import { default as Input } from './Input';
import { NavigatorDelegate, NavigationCommand, NavigatorState, CommandType } from './NavigatorCommon';
import NavigatorStandardDelegate from './NavigatorStandardDelegate';
import NavigatorExperimentalDelegate from './NavigatorExperimentalDelegate';
import Types = require('../common/Types');

export class Navigator extends React.Component<Types.NavigatorProps, NavigatorState> {
    private _delegate: NavigatorDelegate;
    private _commandQueue: NavigationCommand[] = [];

    constructor(initialProps: Types.NavigatorProps) {
        super(initialProps);

        if (RN.Platform.OS === 'android' || RN.Platform.OS === 'ios') {
            this._delegate = new NavigatorExperimentalDelegate(this);
        } else {
            this._delegate = new NavigatorStandardDelegate(this);
        }
    }

    componentDidMount() {
        Input.backButtonEvent.subscribe(this._delegate.onBackPress);
    }

    componentWillUnmount() {
        Input.backButtonEvent.unsubscribe(this._delegate.onBackPress);
    }

    protected componentDidUpdate() {
        // Catch up with any pending commands
        this._processCommand();
    }

    protected getRoutes(): Types.NavigatorRoute[] {
       return this._delegate.getRoutes();
    }

    // Push a new route if initial route doesn't exist
    public push(route: Types.NavigatorRoute): void {
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

    public replace(route: Types.NavigatorRoute): void {
        this._enqueueCommand({
            type: CommandType.Replace,
            param: {
                route: route
            }
        });
    }

    public replacePrevious(route: Types.NavigatorRoute): void {
        this._enqueueCommand({
            type: CommandType.Replace,
            param: {
                route: route,
                value: -1
            }
        });
    }

    // This method replaces the route at the given index of the stack and pops to that index.
    public replaceAtIndex(route: Types.NavigatorRoute, index: number): void {
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
    public immediatelyResetRouteStack(nextRouteStack: Types.NavigatorRoute[]): void {
       this._delegate.immediatelyResetRouteStack(nextRouteStack);
    }

    public popToRoute(route: Types.NavigatorRoute): void {
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

    public getCurrentRoutes(): Types.NavigatorRoute[] {
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

export default Navigator;
