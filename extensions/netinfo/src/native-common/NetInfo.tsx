/**
 * NetInfo.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of network information APIs.
 */

import * as RNNetInfo from '@react-native-community/netinfo';

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

    isConnected(): Promise<boolean> {
        return RNNetInfo.fetch()
            .then((state: RNNetInfo.NetInfoState) => state.isConnected)
            .catch(() => Promise.reject('NetInfo.isConnected.fetch() failed'));
    }

    getType(): Promise<Types.DeviceNetworkType> {
        return RNNetInfo.fetch().then((state: RNNetInfo.NetInfoState) => NetInfo._getNetworkTypeFromConnectionInfo(state));
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
