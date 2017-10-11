/**
* Accessibility.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*/

import RN = require('react-native');
import { Accessibility as NativeAccessibility } from '../native-common/Accessibility';
import SyncTasks = require('synctasks');

export class Accessibility extends NativeAccessibility {
    private _isHighContrast = RN.AccessibilityInfo.initialHighContrast;

    constructor() {
        super();

        RN.AccessibilityInfo.addEventListener('highContrastDidChange', isEnabled => {
            this._updateIsHighContrast(isEnabled);
        });
    }

    private _updateIsHighContrast(isEnabled: boolean) {
        if (this._isHighContrast !== isEnabled) {
            this._isHighContrast = isEnabled;
            this.highContrastChangedEvent.fire(isEnabled);
        }
    }

    isHighContrastEnabled(): boolean {
        return this._isHighContrast;
    }
}

export default new Accessibility();
