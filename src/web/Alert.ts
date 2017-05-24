/**
* Alert.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web Alert dialog boxes.
*/

import RX = require('../common/Interfaces');
import Types = require('../common/Types');

declare var Notification: any;

// Web/HTML implementation for alert dialog boxes
export class Alert extends RX.Alert {
    public show(title: string, message?: string, buttons?: Types.AlertButtonSpec[], icon?: string): void {
        if ('Notification' in window) {
            // There is no <button> and <type> support for Web/HTML notifications!
            let options = { body: message, icon };

            // Permission check / request is needed to support browsers with an opt-in notificiaton permission model
            if (Notification.permission === 'granted') {
                /* tslint:disable:no-unused-variable */
                // new instance of Notification needs to be created but not used
                let htmlNotification = new Notification(title, options);
                /* tslint:enable:no-unused-variable */
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission((permission: string) => {
                    if (permission === 'granted') {
                        /* tslint:disable:no-unused-variable */
                        // new instance of Notification needs to be created but not used
                        let htmlNotification = new Notification(title, options);
                        /* tslint:enable:no-unused-variable */
                    }
                });
            }
        } else {
            // Fallback to traditional js alert() if Notification isn't supported
            alert(`${title}${message !== undefined && message !== null && message.length > 0 ? `: ${message}` : ''}`);
        }
    }
}

export default new Alert();
