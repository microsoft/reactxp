/**
 * Popup.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * React Native implementation of the cross-platform Popup abstraction.
 */

import assert from '../common/assert';
import * as RX from '../common/Interfaces';
import Timers from '../common/utils/Timers';

import FrontLayerViewManager from './FrontLayerViewManager';

export class Popup extends RX.Popup {
    show(options: RX.Types.PopupOptions, popupId: string, delay?: number): boolean {
        assert(popupId, `popupId must be a non-empty string. Actual: ${ popupId }`);
        assert(this._isValidAnchor(options), `options must have a valid 'getAnchor()'`);

        return FrontLayerViewManager.showPopup(options, popupId, delay);
    }

    autoDismiss(popupId: string, delay?: number): void {
        assert(popupId, `popupId must be a non-empty string. Actual: ${ popupId }`);

        Timers.setTimeout(() => FrontLayerViewManager.dismissPopup(popupId), delay || 0);
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

    private _isValidAnchor(options: RX.Types.PopupOptions): boolean {
        return options && typeof options.getAnchor === 'function' && !!options.getAnchor();
    }
}

export default new Popup();
