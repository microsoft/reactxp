/**
 * International.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation for i18n.
 */

import * as RN from 'react-native';

import * as RX from '../common/Interfaces';

export class International implements RX.International {
    allowRTL(allow: boolean): void {
        RN.I18nManager.allowRTL(allow);
    }

    forceRTL(force: boolean): void {
        RN.I18nManager.forceRTL(force);
    }

    isRTL(): boolean {
        return RN.I18nManager.isRTL;
    }
}

export default new International();
