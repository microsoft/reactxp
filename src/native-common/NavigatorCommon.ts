/**
* NavigatorCommon.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common native interfaces for Navigator on mobile.
* We need this class to avoid circular references between Navigator and NavigatorDelegates.
*/

import React = require('react');
import RN = require('react-native');

import RX = require('../common/Interfaces');
import Types = require('../common/Types');

export enum CommandType {
    Push,
    Pop,
    Replace
}

export interface CommandParam {
    route?: Types.NavigatorRoute;
    value?: number;
}

export interface NavigationCommand {
    type: CommandType;
    param: CommandParam;
}

// Empty state
export interface NavigatorState {
    state: RN.NavigationExperimental.NavigationState;
}

export abstract class NavigatorDelegate {
    protected _owner: RX.Navigator;

    constructor(navigator: RX.Navigator) {
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

    abstract getRoutes(): Types.NavigatorRoute[];
    abstract immediatelyResetRouteStack(nextRouteStack: Types.NavigatorRoute[]): void;
    abstract render(): JSX.Element;
    abstract processCommand(commandQueue: NavigationCommand[]): void;
    abstract handleBackPress(): void;
}
