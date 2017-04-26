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
export declare class Network extends RX.Network {
    constructor();
    isConnected(): SyncTasks.Promise<boolean>;
    fetchNetworkType(): SyncTasks.Promise<RX.DeviceNetworkType>;
    private _onEventOccured();
}
declare var _default: Network;
export default _default;
