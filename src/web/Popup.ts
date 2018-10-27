/**
 * Popup.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Popup abstraction.
 */

import FrontLayerViewManager from './FrontLayerViewManager';
import * as RX from '../common/Interfaces';

export class Popup extends RX.Popup {
    show(options: RX.Types.PopupOptions, popupId: string, delay?: number): boolean {
        if (!popupId) {
            throw new Error(`popupId must be a non-empty string. Actual: ${popupId}`);
        }

        return FrontLayerViewManager.showPopup(options, popupId, delay);
    }

    autoDismiss(popupId: string, delay?: number): void {
        if (!popupId) {
            throw new Error(`popupId must be a non-empty string. Actual: ${popupId}`);
        }

        FrontLayerViewManager.autoDismissPopup(popupId, delay);
    }

    dismiss(popupId: string): void {
        if (!popupId) {
            throw new Error(`popupId must be a non-empty string. Actual: ${popupId}`);
        }

        FrontLayerViewManager.dismissPopup(popupId);
    }

    dismissAll(): void {
        FrontLayerViewManager.dismissAllPopups();
    }

    isDisplayed(popupId?: string): boolean {
        return FrontLayerViewManager.isPopupDisplayed(popupId);
    }
}

export default new Popup();
