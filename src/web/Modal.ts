/**
* Modal.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Modal abstraction.
*/

import React = require('react');

import { default as FrontLayerViewManager } from './FrontLayerViewManager';
import RX = require('../common/Interfaces');
import Types = require('../common/Types');

export class Modal extends RX.Modal {
    isDisplayed(modalId: string): boolean {
        return FrontLayerViewManager.isModalDisplayed(modalId);
    }

    show(modal: React.ReactElement<Types.ViewProps>, modalId: string): void {
         FrontLayerViewManager.showModal(modal, modalId);
    }

    dismiss(modalId: string): void {
        FrontLayerViewManager.dismissModal(modalId);
    }

    dismissAll(): void {
        FrontLayerViewManager.dismissAllModals();
    }
}

export default new Modal();
