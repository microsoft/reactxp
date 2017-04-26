/**
* UserPresence.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the ReactXP interfaces related to
* user presence.
*/
import RX = require('../common/Interfaces');
export declare class UserPresence extends RX.UserPresence {
    private _isPresent;
    constructor();
    isUserPresent(): boolean;
    private _setUserPresent(isPresent);
    private _handleWakeup();
    private _handleIdle();
    private _handleFocus();
    private _handleBlur();
}
declare var instance: UserPresence;
export default instance;
