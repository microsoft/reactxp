/**
 * App.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of App API namespace.
 */

import * as RN from 'react-native';

import * as RX from '../common/Interfaces';
import { RootView, RootViewUsingProps } from './RootView';
import UserInterface from './UserInterface';

const _rnStateToRxState: {[key: string]: RX.Types.AppActivationState} = {
    'unknown': RX.Types.AppActivationState.Active,
    'active': RX.Types.AppActivationState.Active,
    'background': RX.Types.AppActivationState.Background,
    'inactive': RX.Types.AppActivationState.Inactive,
    'extension': RX.Types.AppActivationState.Extension,
    // uninitialized means in Background on android since last change I did
    'uninitialized': RX.Types.AppActivationState.Background
};

export class App extends RX.App {
    constructor() {
        super();

        RN.AppState.addEventListener('change', (newState: string) => {
            // Fall back to active if a new state spits out that we don't know about
            this.activationStateChangedEvent.fire(_rnStateToRxState[newState] || RX.Types.AppActivationState.Active);
        });

        RN.AppState.addEventListener('memoryWarning', () => {
            this.memoryWarningEvent.fire();
        });
    }

    initialize(debug: boolean, development: boolean) {
        super.initialize(debug, development);
        window.rxdebug = debug;
        RN.AppRegistry.registerComponent('RXApp', this.getRootViewFactory());
        UserInterface.registerRootViewUsingPropsFactory(this.getRootViewUsingPropsFactory());
    }

    getActivationState(): RX.Types.AppActivationState {
        return _rnStateToRxState[RN.AppState.currentState] || RX.Types.AppActivationState.Active;
    }

    protected getRootViewFactory(): RN.ComponentProvider {
        return () => RootView;
    }

    protected getRootViewUsingPropsFactory(): RN.ComponentProvider {
        return () => RootViewUsingProps;
    }
}

export default new App();
