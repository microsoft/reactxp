/**
 * Navigator.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Common native implementation for Navigator on mobile.
 */
import * as RX from 'reactxp';

import * as Types from '../common/Types';
import {
    Navigator as BaseNavigator,
    NavigatorDelegate,
    NavigatorDelegateSelector as DelegateSelector,
    NavigationCommand,
    NavigatorState,
    NavigatorProps,
    NavigatorRoute,
    CommandType,
} from '../common/Types';

import NavigatorExperimentalDelegate from './NavigatorExperimentalDelegate';

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
    push(route: NavigatorRoute): void {
        this._enqueueCommand({
            type: CommandType.Push,
            param: {
                route: route,
            },
        });
    }

    pop(): void {
        this._enqueueCommand({
            type: CommandType.Pop,
            param: {},
        });
    }

    replace(route: NavigatorRoute): void {
        this._enqueueCommand({
            type: CommandType.Replace,
            param: {
                route: route,
            },
        });
    }

    replacePrevious(route: NavigatorRoute): void {
        this._enqueueCommand({
            type: CommandType.Replace,
            param: {
                route: route,
                value: -1,
            },
        });
    }

    // This method replaces the route at the given index of the stack and pops to that index.
    replaceAtIndex(route: NavigatorRoute, index: number): void {
        const routes = this.getRoutes();

        // Pop to index route and then replace if not last one
        if (index < routes.length - 1) {
            const route = routes[index];
            this.popToRoute(route);
        }

        // Schedule a replace
        this.replace(route);
    }

    // Reset route stack with default route stack
    immediatelyResetRouteStack(nextRouteStack: NavigatorRoute[]): void {
        this._delegate.immediatelyResetRouteStack(nextRouteStack);
    }

    popToRoute(route: NavigatorRoute): void {
        this._enqueueCommand({
            type: CommandType.Pop,
            param: {
                route: route,
            },
        });
    }

    popToTop(): void {
        this._enqueueCommand({
            type: CommandType.Pop,
            param: {
                value: -1,
            },
        });
    }

    getCurrentRoutes(): NavigatorRoute[] {
        return this.getRoutes();
    }

    // Render without initial route to get a reference for Navigator object
    render(): JSX.Element {
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

export default NavigatorImpl;
export const Navigator = NavigatorImpl;
export const NavigatorDelegateSelector = new DefaultDelegateSelector();
export { Types };
