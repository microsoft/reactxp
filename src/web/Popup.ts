/**
* Popup.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Popup abstraction.
*/

import React = require('react');

import { default as FrontLayerViewManager } from './FrontLayerViewManager';
import RX = require('../common/Interfaces');
import Styles from './Styles';
import Types = require('../common/Types');

export class Popup extends RX.Popup {

    show(options: Types.PopupOptions, popupId: string, delay?: number): boolean {
        return FrontLayerViewManager.showPopup(options, popupId, delay);
    }

    autoDismiss(popupId: string, delay?: number): void {
        FrontLayerViewManager.autoDismissPopup(popupId, delay);
    }

    dismiss(popupId: string): void {
        FrontLayerViewManager.dismissPopup(popupId);
    }

    dismissAll(): void {
        FrontLayerViewManager.dismissAllPopups();
    }
}

export default new Popup();
