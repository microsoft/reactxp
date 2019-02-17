/**
 * Modal.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Modal abstraction.
 */

import * as React from 'react';

import assert from '../common/assert';
import * as RX from '../common/Interfaces';

import FrontLayerViewManager from './FrontLayerViewManager';

export class Modal extends RX.Modal {
    isDisplayed(modalId?: string): boolean {
        return FrontLayerViewManager.isModalDisplayed(modalId);
    }

    show(modal: React.ReactElement<RX.Types.ViewProps>, modalId: string, options?: RX.Types.ModalOptions): void {
        assert(modal, `modal must be valid. Actual: ${ modal }`);
        assert(modalId, `modalId must be a non-empty string. Actual: ${ modalId }`);

        FrontLayerViewManager.showModal(modal, modalId, options);
    }

    dismiss(modalId: string): void {
        assert(modalId, `modalId must be a non-empty string. Actual: ${ modalId }`);

        FrontLayerViewManager.dismissModal(modalId);
    }

    dismissAll(): void {
        FrontLayerViewManager.dismissAllmodals();
    }
}

export default new Modal();
