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

// Hack to allow inline-require without importing node.d.ts
declare var require: (path: string) => any;
if (typeof(document) !== 'undefined') {
    var ifvisible = require('ifvisible.js');
}

export class UserPresence extends RX.UserPresence {
    private _isPresent: boolean;

    constructor() {
        super();
        // Handle test environment where document is not defined.
        if (typeof(document) !== 'undefined') {
            this._isPresent = ifvisible.now();

            ifvisible.on('wakeup', this._handleWakeup.bind(this));
            ifvisible.on('idle', this._handleIdle.bind(this));
            ifvisible.on('focus', this._handleFocus.bind(this));
            ifvisible.on('blur', this._handleBlur.bind(this));

            window.addEventListener('blur', this._handleBlur.bind(this));
            window.addEventListener('focus', this._handleFocus.bind(this));
        }
    }

    isUserPresent(): boolean {
        // Handle test environment where document is not defined.
        if (typeof(document) !== 'undefined') {
            return ifvisible.now();
        } else {
            return true;
        }
    }

    private _setUserPresent(isPresent: boolean) {
        if (this._isPresent !== isPresent) {
            this._isPresent = isPresent;

            this.userPresenceChangedEvent.fire(isPresent);
        }
    }

    private _handleWakeup(): void {
        this._setUserPresent(true);
    }

    private _handleIdle(): void {
        this._setUserPresent(false);
    }

    private _handleFocus(): void {
        this._setUserPresent(true);
    }

    private _handleBlur(): void {
        this._setUserPresent(false);
    }
}

var instance = new UserPresence();
export default instance;
