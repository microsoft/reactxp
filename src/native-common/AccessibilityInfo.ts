/**
* AccessibilityInfo.ts
* Copyright: Microsoft 2017
*
* Native wrapper for accessibility helper.
*/

import RN = require('react-native');
import SyncTasks = require('synctasks');

import { AccessibilityInfo as CommonAccessibilityInfo } from '../common/AccessibilityInfo';
import SubscribableEvent = require('../common/SubscribableEvent');
import RX = require('../common/Interfaces');

export class AccessibilityInfo extends CommonAccessibilityInfo {
    protected _isScreenReaderEnabled = false;

    constructor() {
        super();

        let initialStateChanged = false;
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

export default new AccessibilityInfo();
