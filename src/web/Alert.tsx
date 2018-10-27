/**
 * Alert.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web Alert dialog boxes.
 */

import * as React from 'react';

import { AlertModalContent } from './AlertModalContent';
import * as RX from '../common/Interfaces';
import Modal from './Modal';

// Web/HTML implementation for alert dialog boxes
export class Alert extends RX.Alert {
    private _modalId = 'RX.Alert_WebModal';

    show(title: string, message?: string, buttons?: RX.Types.AlertButtonSpec[],
            options?: RX.Types.AlertOptions): void {
        Modal.show(
            (
                <AlertModalContent
                    modalId={ this._modalId }
                    buttons={ buttons }
                    title={ title }
                    message={ message }
                    theme={ options && options.theme }
                    preventDismissOnPress={ options && options.preventDismissOnPress}
                />
            ), this._modalId
        );
    }
}

export default new Alert();
