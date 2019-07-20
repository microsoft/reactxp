/**
 * NetInfo.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of network information APIs.
 */

import * as RNNetInfo from '@react-native-community/netinfo';
import * as SyncTasks from 'synctasks';

import * as Types from '../common/Types';
import * as Interfaces from '../common/Interfaces';

export class NetInfo extends Interfaces.NetInfo {
    constructor() {
        super();

        const onEventOccurredHandler =  (state: RNNetInfo.NetInfoState) => {
            this.connectivityChangedEvent.fire(state.isConnected);
        };

        RNNetInfo.addEventListener(onEventOccurredHandler);
    }

    isConnected(): SyncTasks.Promise<boolean> {
        const deferred = SyncTasks.Defer<boolean>();

        RNNetInfo.fetch().then((state: RNNetInfo.NetInfoState) => {
            deferred.resolve(state.isConnected);
        }).catch(() => {
            deferred.reject('NetInfo.isConnected.fetch() failed');
        });

        return deferred.promise();
    }

    getType(): SyncTasks.Promise<Types.DeviceNetworkType> {
        return SyncTasks.fromThenable(RNNetInfo.fetch()).then((state: RNNetInfo.NetInfoState) => {
            return NetInfo._getNetworkTypeFromConnectionInfo(state);
        });
    }

    private static _getNetworkTypeFromConnectionInfo(state: RNNetInfo.NetInfoState): Types.DeviceNetworkType {
        if (state.type === RNNetInfo.NetInfoStateType.cellular) {
            if (state.details === null || state.details.cellularGeneration === null) {
                return Types.DeviceNetworkType.Unknown;
            } else if (state.details.cellularGeneration === '2g') {
                return Types.DeviceNetworkType.Mobile2G;
            } else if (state.details.cellularGeneration === '3g') {
                return Types.DeviceNetworkType.Mobile3G;
            } else if (state.details.cellularGeneration === '4g') {
                return Types.DeviceNetworkType.Mobile4G;
            }
        } else if (state.type === RNNetInfo.NetInfoStateType.wifi ) {
            return Types.DeviceNetworkType.Wifi;
        } else if (state.type === RNNetInfo.NetInfoStateType.ethernet ) {
            return Types.DeviceNetworkType.Wifi;
        } else if (state.type === RNNetInfo.NetInfoStateType.wimax ) {
            return Types.DeviceNetworkType.Wifi;
        } else if (state.type === RNNetInfo.NetInfoStateType.none) {
            return Types.DeviceNetworkType.None;
        }

        return Types.DeviceNetworkType.Unknown;
    }
}

export default new NetInfo();
