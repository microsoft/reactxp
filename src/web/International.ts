/**
 * International.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation for i18n.
 */

import FrontLayerViewManager from './FrontLayerViewManager';
import * as RX from '../common/Interfaces';

export class International implements RX.International {
    allowRTL(allow: boolean): void {
        FrontLayerViewManager.allowRTL(allow);
    }

    forceRTL(force: boolean): void {
        FrontLayerViewManager.forceRTL(force);
    }

    isRTL(): boolean {
        return FrontLayerViewManager.isRTL();
    }
}

export default new International();
