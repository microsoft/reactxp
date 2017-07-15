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
import Types = require('../common/Types');

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

    getType(): SyncTasks.Promise<Types.DeviceNetworkType> {
        return SyncTasks.Resolved(Types.DeviceNetworkType.Unknown);
    }

    private _onEventOccured() {
        this.connectivityChangedEvent.fire(navigator.onLine);
    }
}

export default new Network();
