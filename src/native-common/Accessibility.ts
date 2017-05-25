/**
* Accessibility.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native wrapper for accessibility helper.
*/

import RN = require('react-native');

import { Accessibility as CommonAccessibility } from '../common/Accessibility';

export class Accessibility extends CommonAccessibility {
    protected _isScreenReaderEnabled = false;

    constructor() {
        super();

        let initialStateChanged = false;

        // Some versions of RN don't support this interface.
        if (RN.AccessibilityInfo) {
            // Subscribe to an event to get notified when screen reader is enabled or disabled.
            RN.AccessibilityInfo.addEventListener('change', isEnabled => {
                initialStateChanged = true;
                this._updateScreenReaderStatus(isEnabled);
            });

            // Fetch initial state.
            RN.AccessibilityInfo.fetch().then(isEnabled => {
                if (!initialStateChanged) {
                    this._updateScreenReaderStatus(isEnabled);
                }
            });
        }
    }

    protected _updateScreenReaderStatus(isEnabled: boolean): void {
        if (this._isScreenReaderEnabled !== isEnabled) {
            this._isScreenReaderEnabled = isEnabled;
            this.screenReaderChangedEvent.fire(isEnabled);
        }
    }

    isScreenReaderEnabled(): boolean {
        return this._isScreenReaderEnabled;
    }
}

export default new Accessibility();
