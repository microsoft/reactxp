/**
 * App.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Implements App interface for ReactXP.
 */

import AppVisibilityUtils from './utils/AppVisibilityUtils';
import * as RX from '../common/Interfaces';

export class App extends RX.App {
    private _activationState: RX.Types.AppActivationState;

    constructor() {
        super();

        // Handle test environment where document is not defined.
        if (typeof(document) !== 'undefined') {
            this._activationState = AppVisibilityUtils.isAppInForeground() ?
            RX.Types.AppActivationState.Active : RX.Types.AppActivationState.Background;

            AppVisibilityUtils.onAppForegroundedEvent.subscribe(() => {
                this._setActivationState(RX.Types.AppActivationState.Active);
            });

            AppVisibilityUtils.onAppBackgroundedEvent.subscribe(() => {
                this._setActivationState(RX.Types.AppActivationState.Background);
            });
        } else {
            this._activationState = RX.Types.AppActivationState.Active;
        }
    }

    initialize(debug: boolean, development: boolean) {
        super.initialize(debug, development);
    }

    getActivationState(): RX.Types.AppActivationState {
        return this._activationState;
    }

    private _setActivationState = (currentState: RX.Types.AppActivationState) => {
        if (this._activationState !== currentState) {
            this._activationState = currentState;
            this.activationStateChangedEvent.fire(this._activationState);
        }
    }
}

export default new App();
