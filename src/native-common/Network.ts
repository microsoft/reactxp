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

        // The "change" event is being deprecated. See if the newer "connectionchange"
        // event is available instead. We can't determine this directly, but we can
        // check whether the accompanying RN.NetInfo.getConnectionInfo is available.
        RN.NetInfo.isConnected.addEventListener(
            RN.NetInfo.getConnectionInfo ? 'connectionChange' : 'change',
            onEventOccuredHandler);
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
        // Is the newer call available? Use it instead of the soon-to-be-deprecated
        // NetInfo.fetch call if possible.
        if (RN.NetInfo.getConnectionInfo) {
            return SyncTasks.fromThenable(RN.NetInfo.getConnectionInfo()).then(info => {
                return Network._getNetworkTypeFromConnectionInfo(info);
            });
        } else {
            // Use the older RN.NetInfo.fetch call if the newer call isn't available.
            return SyncTasks.fromThenable(RN.NetInfo.fetch().then(networkType => {
                return Network._getNetworkTypeFromNetInfo(networkType);
            }));
        }
    }

    private _onEventOccured(isConnected: boolean) {
        this.connectivityChangedEvent.fire(isConnected);
    }

    private static _getNetworkTypeFromNetInfo(networkType: string): Types.DeviceNetworkType {
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

    private static _getNetworkTypeFromConnectionInfo(info: RN.ConnectionInfo): Types.DeviceNetworkType {
        if (info.effectiveType === '2g') {
            return Types.DeviceNetworkType.Mobile2G;
        } else if (info.effectiveType === '3g') {
            return Types.DeviceNetworkType.Mobile3G;
        } else if (info.effectiveType === '4g') {
            return Types.DeviceNetworkType.Mobile4G;
        } else if (info.type === 'wifi' || info.type === 'ETHERNET') {
            return Types.DeviceNetworkType.Wifi;
        } else if (info.type === 'none') {
            return Types.DeviceNetworkType.None;
        }

        return Types.DeviceNetworkType.Unknown;
    }
}

export default new Network();
