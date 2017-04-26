import SyncTasks = require('synctasks');
import RX = require('../common/Interfaces');
export declare class Network extends RX.Network {
    constructor();
    isConnected(): SyncTasks.Promise<boolean>;
    fetchNetworkType(): SyncTasks.Promise<RX.DeviceNetworkType>;
    private _onEventOccured(isConnected);
    private static _NativeNetworkTypeToDeviceNetworkType(networkType);
}
declare var _default: Network;
export default _default;
