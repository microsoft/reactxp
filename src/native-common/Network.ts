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
import Types = require('../common/Types');

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

    getType(): SyncTasks.Promise<Types.DeviceNetworkType> {
        return SyncTasks.fromThenable(RN.NetInfo.fetch().then(networkType =>
            Network._NativeNetworkTypeToDeviceNetworkType(networkType)));
    }

    private _onEventOccured(isConnected: boolean) {
        this.connectivityChangedEvent.fire(isConnected);
    }

    private static _NativeNetworkTypeToDeviceNetworkType(networkType: string): Types.DeviceNetworkType {
        switch (networkType) {
            case 'UNKNOWN':
                return Types.DeviceNetworkType.Unknown;
            case 'NONE':
                return Types.DeviceNetworkType.None;
            case 'WIFI':
                return Types.DeviceNetworkType.Wifi;
            case 'MOBILE_2G':
                return Types.DeviceNetworkType.Mobile2G;
            case 'MOBILE_3G':
                return Types.DeviceNetworkType.Mobile3G;
            case 'MOBILE_4G':
                return Types.DeviceNetworkType.Mobile4G;
        }

        return Types.DeviceNetworkType.Unknown;
    }
}

export default new Network();
