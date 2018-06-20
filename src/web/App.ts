/**
* App.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Implements App interface for ReactXP.
*/

import RX = require('../common/Interfaces');
import Types = require('../common/Types');

import AppVisibilityUtils from './utils/AppVisibilityUtils';

export class App extends RX.App {
    private _activationState: Types.AppActivationState;

    constructor() {
        super();

        // Handle test environment where document is not defined.
        if (typeof(document) !== 'undefined') {
            this._activationState = AppVisibilityUtils.isAppInForeground() ? 
                Types.AppActivationState.Active : Types.AppActivationState.Background;

            AppVisibilityUtils.onAppForegroundedEvent.subscribe(() => {
                this._setActivationState(Types.AppActivationState.Active);
            });

            AppVisibilityUtils.onAppBackgroundedEvent.subscribe(() => {
                this._setActivationState(Types.AppActivationState.Background);
            });
        } else {
            this._activationState = Types.AppActivationState.Active;
        }
    }

    initialize(debug: boolean, development: boolean) {
        super.initialize(debug, development);
    }

    getActivationState(): Types.AppActivationState {
        return this._activationState;
    }

    private _setActivationState = (currentState: Types.AppActivationState) => {
        if (this._activationState !== currentState) {
            this._activationState = currentState;
            this.activationStateChangedEvent.fire(this._activationState);
        }
    }
}

export default new App();
