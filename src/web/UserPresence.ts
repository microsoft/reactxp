/**
 * UserPresence.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the ReactXP interfaces related to
 * user presence.
 *
 * User is considered present when user is focused on the App and has interacted with the App in the last 60 seconds.
 * User is considered not present, if app is not focused (backgrounded or blurred) or the app is focused
 * but the user has not intereacted with the app in the last 60 seconds
 */

import AppVisibilityUtils from './utils/AppVisibilityUtils';
import * as RX from '../common/Interfaces';

export class UserPresence extends RX.UserPresence {
    private _isPresent: boolean;

    constructor() {
        super();
        // Handle test environment where document is not defined.
        if (typeof(document) !== 'undefined') {
            this._isPresent = AppVisibilityUtils.hasFocusAndActive();
            AppVisibilityUtils.onFocusedEvent.subscribe(this._handleFocus.bind(this));
            AppVisibilityUtils.onBlurredEvent.subscribe(this._handleBlur.bind(this));
            AppVisibilityUtils.onWakeUpEvent.subscribe(this._handleWakeup.bind(this));
            AppVisibilityUtils.onIdleEvent.subscribe(this._handleIdle.bind(this));
        } else {
            this._isPresent = false;
        }
    }

    isUserPresent(): boolean {
        // Handle test environment where document is not defined.
        if (typeof(document) !== 'undefined') {
            return this._isPresent;
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

const instance = new UserPresence();
export default instance;
