/**
 * Popup.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Popup abstraction.
 */

import assert from '../common/assert';
import * as RX from '../common/Interfaces';

import FrontLayerViewManager from './FrontLayerViewManager';

export class Popup extends RX.Popup {
    show(options: RX.Types.PopupOptions, popupId: string, delay?: number): boolean {
        assert(popupId, `popupId must be a non-empty string. Actual: ${ popupId }`);

        return FrontLayerViewManager.showPopup(options, popupId, delay);
    }

    autoDismiss(popupId: string, delay?: number): void {
        assert(popupId, `popupId must be a non-empty string. Actual: ${ popupId }`);

        FrontLayerViewManager.autoDismissPopup(popupId, delay);
    }

    dismiss(popupId: string): void {
        assert(popupId, `popupId must be a non-empty string. Actual: ${ popupId }`);

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
