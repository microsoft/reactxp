/**
* App.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of App API namespace.
*/

import RN = require('react-native');

import { RootView, RootViewUsingProps } from './RootView';
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
import UserInterface from './UserInterface';

const _rnStateToRxState: {[key: string]: Types.AppActivationState} = {
    'unknown': Types.AppActivationState.Active,
    'active': Types.AppActivationState.Active,
    'background': Types.AppActivationState.Background,
    'inactive': Types.AppActivationState.Inactive,
    'extension': Types.AppActivationState.Extension,
    // uninitialized means in Background on android since last change I did
    'uninitialized': Types.AppActivationState.Background

};

export class App extends RX.App {
    constructor() {
        super();

        RN.AppState.addEventListener('change', (newState: string) => {
            // Fall back to active if a new state spits out that we don't know about
            this.activationStateChangedEvent.fire(_rnStateToRxState[newState] || Types.AppActivationState.Active);
        });

        RN.AppState.addEventListener('memoryWarning', () => {
            this.memoryWarningEvent.fire();
        });
    }

    initialize(debug: boolean, development: boolean) {
        super.initialize(debug, development);
        window['rxdebug'] = debug;
        RN.AppRegistry.registerComponent('RXApp', this.getRootViewFactory());
        UserInterface.registerRootViewUsingPropsFactory(this.getRootViewUsingPropsFactory());
    }

    getActivationState(): Types.AppActivationState {
        return _rnStateToRxState[RN.AppState.currentState] || Types.AppActivationState.Active;
    }

    protected getRootViewFactory(): RN.ComponentProvider {
        return () => RootView;
    }

    protected getRootViewUsingPropsFactory(): RN.ComponentProvider {
        return () => RootViewUsingProps;
    }
}

export default new App();
