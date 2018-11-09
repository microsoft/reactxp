/**
 * Accessibility.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native wrapper for accessibility helper.
 */

import * as RN from 'react-native';

import { Accessibility as CommonAccessibility } from '../common/Accessibility';
import AppConfig from '../common/AppConfig';
import { Types } from '../common/Interfaces';

export interface MacComponentAccessibilityProps {
    onClick?: (e: Types.SyntheticEvent) => void;
    acceptsKeyboardFocus?: true;
    enableFocusRing?: true;
}

export class Accessibility extends CommonAccessibility {
    protected _isScreenReaderEnabled = false;

    constructor() {
        super();

        let initialStateChanged = false;

        // Some versions of RN don't support this interface.
        if (RN.AccessibilityInfo) {
            // Subscribe to an event to get notified when screen reader is enabled or disabled.
            RN.AccessibilityInfo.addEventListener('change', (isEnabled: boolean) => {
                initialStateChanged = true;
                this._updateScreenReaderStatus(isEnabled);
            });

            // Fetch initial state.
            RN.AccessibilityInfo.fetch().then(isEnabled => {
                if (!initialStateChanged) {
                    this._updateScreenReaderStatus(isEnabled);
                }
            }).catch(err => {
                if (AppConfig.isDevelopmentMode()) {
                    console.error('Accessibility: RN.AccessibilityInfo.fetch failed');
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
