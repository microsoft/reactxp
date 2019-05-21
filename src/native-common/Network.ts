/**
 * Network.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of network information APIs.
 */

import * as NetInfo from '@react-native-community/netinfo';
import * as SyncTasks from 'synctasks';

import * as RX from '../common/Interfaces';

export class Network extends RX.Network {
    constructor() {
        super();

        const onEventOccurredHandler = this._onEventOccurred.bind(this);

        NetInfo.addEventListener(onEventOccurredHandler);
    }

    isConnected(): SyncTasks.Promise<boolean> {
        const deferred = SyncTasks.Defer<boolean>();

        NetInfo.fetch().then((state: NetInfo.NetInfoState) => {
            deferred.resolve(state.isConnected);
        }).catch(() => {
            deferred.reject('NetInfo.isConnected.fetch() failed');
        });

        return deferred.promise();
    }

    getType(): SyncTasks.Promise<RX.Types.DeviceNetworkType> {
        return SyncTasks.fromThenable(NetInfo.fetch()).then((state: NetInfo.NetInfoState) => {
            return Network._getNetworkTypeFromConnectionInfo(state);
        });
    }

    private _onEventOccurred(state: NetInfo.NetInfoState) {
        this.connectivityChangedEvent.fire(state.isConnected);
    }

    private static _getNetworkTypeFromConnectionInfo(state: NetInfo.NetInfoState): RX.Types.DeviceNetworkType {
        if (state.type === NetInfo.NetInfoStateType.cellular) {
            if (state.details === null || state.details.cellularGeneration === null) {
                return RX.Types.DeviceNetworkType.Unknown;
            } else if (state.details.cellularGeneration === '2g') {
                return RX.Types.DeviceNetworkType.Mobile2G;
            } else if (state.details.cellularGeneration === '3g') {
                return RX.Types.DeviceNetworkType.Mobile3G;
            } else if (state.details.cellularGeneration === '4g') {
                return RX.Types.DeviceNetworkType.Mobile4G;
            }
        } else if (state.type === NetInfo.NetInfoStateType.wifi ) {
            return RX.Types.DeviceNetworkType.Wifi;
        } else if (state.type === NetInfo.NetInfoStateType.ethernet ) {
            return RX.Types.DeviceNetworkType.Wifi;
        } else if (state.type === NetInfo.NetInfoStateType.wimax ) {
            return RX.Types.DeviceNetworkType.Wifi;
        } else if (state.type === NetInfo.NetInfoStateType.none) {
            return RX.Types.DeviceNetworkType.None;
        }

        return RX.Types.DeviceNetworkType.Unknown;
    }
}

export default new Network();
