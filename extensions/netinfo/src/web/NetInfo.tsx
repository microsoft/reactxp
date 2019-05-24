/**
 * Video.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Video abstraction.
 */

import * as SyncTasks from 'synctasks';

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

    isConnected(): SyncTasks.Promise<boolean> {
        return SyncTasks.Resolved(navigator.onLine);
    }

    getType(): SyncTasks.Promise<Types.DeviceNetworkType> {
        return SyncTasks.Resolved(Types.DeviceNetworkType.Unknown);
    }
}

export default new NetInfo();
