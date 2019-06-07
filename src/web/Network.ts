/**
 * Network.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of Network information APIs.
 */

import * as SyncTasks from 'synctasks';

import * as RX from '../common/Interfaces';

export class Network extends RX.Network {
    constructor() {
        super();

        const onEventOccuredHandler = this._onEventOccured.bind(this);

        // Avoid accessing window if it's not defined (for test environment).
        if (typeof(window) !== 'undefined') {
            window.addEventListener('online', onEventOccuredHandler);
            window.addEventListener('offline', onEventOccuredHandler);
        }
    }

    isConnected(): SyncTasks.Promise<boolean> {
        return SyncTasks.Resolved(navigator.onLine);
    }

    getType(): SyncTasks.Promise<RX.Types.DeviceNetworkType> {
        return SyncTasks.Resolved(RX.Types.DeviceNetworkType.Unknown);
    }

    private _onEventOccured() {
        this.connectivityChangedEvent.fire(navigator.onLine);
    }
}

export default new Network();
