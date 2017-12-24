/**
* UserInterface.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN implementation of the ReactXP interfaces related to
* UI (layout measurements, etc.) - desktop version.
*/

import {UserInterface as UserInterfaceCommon} from '../native-common/UserInterface';

export class UserInterface extends UserInterfaceCommon {
    private _isNavigatingWithKeyboard: boolean = false;
    constructor() {
        super();
        this.keyboardNavigationEvent.subscribe(this._keyboardNavigationStateChanged);
    }

    isNavigatingWithKeyboard(): boolean {
        return this._isNavigatingWithKeyboard;
    }

    private _keyboardNavigationStateChanged = (isNavigatingWithKeyboard: boolean) => {
        this._isNavigatingWithKeyboard = isNavigatingWithKeyboard;
    }
}

export default new UserInterface();
