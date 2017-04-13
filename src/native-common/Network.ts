/**
* Network.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of network information APIs.
*/

import RN = require('react-native');
import SyncTasks = require('synctasks');

import RX = require('../common/Interfaces');

export class Network extends RX.Network {
    constructor() {
        super();

        let onEventOccuredHandler = this._onEventOccured.bind(this);

        RN.NetInfo.isConnected.addEventListener('change', onEventOccuredHandler);
    }

    isConnected(): SyncTasks.Promise<boolean> {
        let deferred = SyncTasks.Defer<boolean>();

        RN.NetInfo.isConnected.fetch().then(isConnected => {
            deferred.resolve(isConnected);
        }).catch(() => {
            deferred.reject('RN.NetInfo.isConnected.fetch() failed');
        });

        return deferred.promise();
    }

    fetchNetworkType(): SyncTasks.Promise<RX.DeviceNetworkType> {
        return SyncTasks.fromThenable(RN.NetInfo.fetch().then(networkType =>
            Network._NativeNetworkTypeToDeviceNetworkType(networkType)));
    }

    private _onEventOccured(isConnected: boolean) {
        this.connectivityChangedEvent.fire(isConnected);
    }

    private static _NativeNetworkTypeToDeviceNetworkType(networkType: string): RX.DeviceNetworkType {
        switch (networkType) {
            case 'UNKNOWN':
                return RX.DeviceNetworkType.UNKNOWN;
            case 'NONE':
                return RX.DeviceNetworkType.NONE;
            case 'WIFI':
                return RX.DeviceNetworkType.WIFI;
            case 'MOBILE_2G':
                return RX.DeviceNetworkType.MOBILE_2G;
            case 'MOBILE_3G':
                return RX.DeviceNetworkType.MOBILE_3G;
            case 'MOBILE_4G':
                return RX.DeviceNetworkType.MOBILE_4G;
        }

        return RX.DeviceNetworkType.UNKNOWN;
    }
}

export default new Network();
