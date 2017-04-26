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
export declare class App extends RX.App {
    private _activationState;
    constructor();
    initialize(debug: boolean, development: boolean): void;
    getActivationState(): Types.AppActivationState;
}
declare var _default: App;
export default _default;
