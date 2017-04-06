/**
* Network.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of Network information APIs.
*/

import SyncTasks = require('synctasks');
import RX = require('../common/Interfaces');

export class Network extends RX.Network {
    constructor() {
        super();

        let onEventOccuredHandler = this._onEventOccured.bind(this);

        // Avoid accessing window if it's not defined (for test environment).
        if (typeof(window) !== 'undefined') {
            window.addEventListener('online', onEventOccuredHandler);
            window.addEventListener('offline', onEventOccuredHandler);
        }
    }

    isConnected(): SyncTasks.Promise<boolean> {
        return SyncTasks.Resolved(navigator.onLine);
    }

    fetchNetworkType(): SyncTasks.Promise<RX.DeviceNetworkType> {
        return SyncTasks.Resolved(RX.DeviceNetworkType.UNKNOWN);
    }

    private _onEventOccured() {
        this.connectivityChangedEvent.fire(navigator.onLine);
    }
}

export default new Network();
