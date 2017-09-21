/**
* Alert.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web Alert dialog boxes.
*/

import React = require('react');

import RX = require('../common/Interfaces');
import Types = require('../common/Types');
import { AlertModalContent } from './AlertModalContent';
import { default as Modal } from './Modal';

// Web/HTML implementation for alert dialog boxes
export class Alert extends RX.Alert {
    private _modalId = 'RX.Alert_WebModal';

    public show(title: string, message?: string, buttons?: Types.AlertButtonSpec[], 
            options?: Types.AlertOptions): void {
        Modal.show(
            (
                <AlertModalContent
                    modalId={ this._modalId }
                    buttons={ buttons }
                    title={ title }
                    message={ message }
                    theme={ options && options.theme }
                />
            ), this._modalId
        );
    }
}

export default new Alert();
