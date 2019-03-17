/**
 * Network.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of network information APIs.
 */

import NetInfo, { ConnectionInfo } from '@react-native-community/netinfo';
import * as SyncTasks from 'synctasks';

import * as RX from '../common/Interfaces';

export class Network extends RX.Network {
    constructor() {
        super();

        const onEventOccurredHandler = this._onEventOccurred.bind(this);

        NetInfo.isConnected.addEventListener('connectionChange', onEventOccurredHandler);
    }

    isConnected(): SyncTasks.Promise<boolean> {
        const deferred = SyncTasks.Defer<boolean>();

        NetInfo.isConnected.fetch().then(isConnected => {
            deferred.resolve(isConnected);
        }).catch(() => {
            deferred.reject('NetInfo.isConnected.fetch() failed');
        });

        return deferred.promise();
    }

    getType(): SyncTasks.Promise<RX.Types.DeviceNetworkType> {
        return SyncTasks.fromThenable(NetInfo.getConnectionInfo()).then(info => {
            return Network._getNetworkTypeFromConnectionInfo(info);
        });
    }

    private _onEventOccurred(isConnected: boolean) {
        this.connectivityChangedEvent.fire(isConnected);
    }

    private static _getNetworkTypeFromConnectionInfo(info: ConnectionInfo): RX.Types.DeviceNetworkType {
        if (info.effectiveType === '2g') {
            return RX.Types.DeviceNetworkType.Mobile2G;
        } else if (info.effectiveType === '3g') {
            return RX.Types.DeviceNetworkType.Mobile3G;
        } else if (info.effectiveType === '4g') {
            return RX.Types.DeviceNetworkType.Mobile4G;
        } else if (info.type === 'wifi' || info.type === 'ethernet' || info.type === 'wimax') {
            return RX.Types.DeviceNetworkType.Wifi;
        } else if (info.type === 'none') {
            return RX.Types.DeviceNetworkType.None;
        }

        return RX.Types.DeviceNetworkType.Unknown;
    }
}

export default new Network();
