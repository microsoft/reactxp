/**
* Popup.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* React Native implementation of the cross-platform Popup abstraction.
*/

import { default as FrontLayerViewManager } from './FrontLayerViewManager';
import RX = require('../common/Interfaces');
import Types = require('../common/Types');

export class Popup extends RX.Popup {
    show(options: Types.PopupOptions, popupId: string, delay?: number): boolean {
        return FrontLayerViewManager.showPopup(options, popupId, delay);
    }

    autoDismiss(popupId: string, delay?: number): void {
        setTimeout(() => {
            FrontLayerViewManager.dismissPopup(popupId);
        }, delay || 0);
    }

    dismiss(popupId: string): void {
        FrontLayerViewManager.dismissPopup(popupId);
    }

    dismissAll(): void {
        FrontLayerViewManager.dismissAllPopups();
    }
}

export default new Popup();
