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

// Hack to allow inline-require without importing node.d.ts
declare var require: (path: string) => any;
if (typeof(document) !== 'undefined') {
    var ifvisible = require('ifvisible.js');
}

export class App extends RX.App {
    private _activationState: Types.AppActivationState;

    constructor() {
        super();

        // Handle test environment where document is not defined.
        if (typeof(document) !== 'undefined') {
            this._activationState = ifvisible.now() ? Types.AppActivationState.Active : Types.AppActivationState.Background;

            ifvisible.on('focus', () => {
                if (this._activationState !== Types.AppActivationState.Active) {
                    this._activationState = Types.AppActivationState.Active;
                    this.activationStateChangedEvent.fire(this._activationState);
                }
            });

            ifvisible.on('blur', () => {
                if (this._activationState !== Types.AppActivationState.Background) {
                    this._activationState = Types.AppActivationState.Background;
                    this.activationStateChangedEvent.fire(this._activationState);
                }
            });
        }
    }

    initialize(debug: boolean, development: boolean) {
        super.initialize(debug, development);
    }

    getActivationState(): Types.AppActivationState {
        return this._activationState;
    }
}

export default new App();
