/**
 * Network.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of network information APIs.
 */

import * as RN from 'react-native';
import * as SyncTasks from 'synctasks';

import * as RX from '../common/Interfaces';

export class Network extends RX.Network {
    constructor() {
        super();

        const onEventOccuredHandler = this._onEventOccured.bind(this);

        // The "change" event is being deprecated. See if the newer "connectionchange"
        // event is available instead. We can't determine this directly, but we can
        // check whether the accompanying RN.NetInfo.getConnectionInfo is available.
        RN.NetInfo.isConnected.addEventListener(
            RN.NetInfo.getConnectionInfo ? 'connectionChange' : 'change',
            onEventOccuredHandler);
    }

    isConnected(): SyncTasks.Promise<boolean> {
        const deferred = SyncTasks.Defer<boolean>();

        RN.NetInfo.isConnected.fetch().then(isConnected => {
            deferred.resolve(isConnected);
        }).catch(() => {
            deferred.reject('RN.NetInfo.isConnected.fetch() failed');
        });

        return deferred.promise();
    }

    getType(): SyncTasks.Promise<RX.Types.DeviceNetworkType> {
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

    private static _getNetworkTypeFromNetInfo(networkType: string): RX.Types.DeviceNetworkType {
        switch (networkType) {
            case 'UNKNOWN':
                return RX.Types.DeviceNetworkType.Unknown;
            case 'NONE':
                return RX.Types.DeviceNetworkType.None;
            case 'WIFI':
                return RX.Types.DeviceNetworkType.Wifi;
            case 'MOBILE_2G':
                return RX.Types.DeviceNetworkType.Mobile2G;
            case 'MOBILE_3G':
                return RX.Types.DeviceNetworkType.Mobile3G;
            case 'MOBILE_4G':
                return RX.Types.DeviceNetworkType.Mobile4G;
        }

        return RX.Types.DeviceNetworkType.Unknown;
    }

    private static _getNetworkTypeFromConnectionInfo(info: RN.ConnectionInfo): RX.Types.DeviceNetworkType {
        if (info.effectiveType === '2g') {
            return RX.Types.DeviceNetworkType.Mobile2G;
        } else if (info.effectiveType === '3g') {
            return RX.Types.DeviceNetworkType.Mobile3G;
        } else if (info.effectiveType === '4g') {
            return RX.Types.DeviceNetworkType.Mobile4G;
        } else if (info.type === 'wifi' || info.type === 'ETHERNET') {
            return RX.Types.DeviceNetworkType.Wifi;
        } else if (info.type === 'none') {
            return RX.Types.DeviceNetworkType.None;
        }

        return RX.Types.DeviceNetworkType.Unknown;
    }
}

export default new Network();
