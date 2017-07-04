/**
* App.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of App API namespace.
*/

import RN = require('react-native');

import { RootView } from './RootView';
import RX = require('../common/Interfaces');
import Types = require('../common/Types');

const _rnStateToRxState: {[key: string]: Types.AppActivationState} = {
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
        RN.AppRegistry.registerComponent('RXApp', () => RootView);
    }

    getActivationState(): Types.AppActivationState {
        return _rnStateToRxState[RN.AppState.currentState];
    }
}

export default new App();
