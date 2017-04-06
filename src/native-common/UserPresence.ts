/**
* UserPresence.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of the RX interfaces related to
* user presence.
*/

import RX = require('../common/Interfaces');

export class UserPresence extends RX.UserPresence {
    // On native platforms, assume that the user is present
    // whenever the app is running.
    isUserPresent(): boolean {
        return true;
    }
}

export default new UserPresence();
