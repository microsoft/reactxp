/**
* Accessibility.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*/

import RN = require('react-native');
// Be aware that we import class and extend it here, but the default export of native-common/Accessibility
// is an instance of the class we import here. So any state in the default export from native-common will be in
// a different instance than default export of this windows/Accessibility. For example, susbscribing to
// newAnnouncementReadyEvent on this default export instance and calling announceForAccessibility on 
// native-common default export will not raise this instance event.
import { Accessibility as NativeAccessibility } from '../native-common/Accessibility';

export class Accessibility extends NativeAccessibility {
    private _isHighContrast = RN.AccessibilityInfo.initialHighContrast || false;

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
