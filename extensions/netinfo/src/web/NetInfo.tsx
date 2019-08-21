/**
 * Video.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Video abstraction.
 */

import * as Types from '../common/Types';
import * as Interfaces from '../common/Interfaces';

export class NetInfo extends Interfaces.NetInfo {
    constructor() {
        super();

        const onEventOccuredHandler = () => {
            this.connectivityChangedEvent.fire(navigator.onLine);
        };

        // Avoid accessing window if it's not defined (for test environment).
        if (typeof(window) !== 'undefined') {
            window.addEventListener('online', onEventOccuredHandler);
            window.addEventListener('offline', onEventOccuredHandler);
        }
    }

    isConnected(): Promise<boolean> {
        return Promise.resolve(navigator.onLine);
    }

    getType(): Promise<Types.DeviceNetworkType> {
        return Promise.resolve(Types.DeviceNetworkType.Unknown);
    }
}

export default new NetInfo();
