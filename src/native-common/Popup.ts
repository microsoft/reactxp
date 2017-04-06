/**
* Popup.tsx
* Copyright: Microsoft 2017
*
* React Native implementation of the cross-platform Popup abstraction.
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
