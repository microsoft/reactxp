/**
* Modal.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Modal abstraction.
*/

import React = require('react');

import { default as FrontLayerViewManager } from './FrontLayerViewManager';
import RX = require('../common/Interfaces');

import Types= require('../common/Types');

export class Modal extends RX.Modal {
    isDisplayed(modalId: string): boolean {
        if (!modalId || modalId === '') {
            throw new Error(`modalId must be a non-empty string. Actual: ${modalId}`);
        }

        return FrontLayerViewManager.isModalDisplayed(modalId);
    }

    show(modal: React.ReactElement<Types.ViewProps>, modalId: string, options?: Types.ModalOptions): void {
        if (!modal) {
            throw new Error(`modal must be valid. Actual ${modal}`);
        }

        if (!modalId || modalId === '') {
            throw new Error(`modalId must be a non-empty string. Actual: ${modalId}`);
        }

        FrontLayerViewManager.showModal(modal, modalId, options);
    }

    dismiss(modalId: string): void {
        if (!modalId || modalId === '') {
            throw new Error(`modalId must be a non-empty string. Actual: ${modalId}`);
        }

        FrontLayerViewManager.dismissModal(modalId);
    }

    dismissAll(): void {
        FrontLayerViewManager.dismissAllmodals();
    }
}

export default new Modal();
