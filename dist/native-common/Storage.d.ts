import SyncTasks = require('synctasks');
import RX = require('../common/Interfaces');
export declare class Storage extends RX.Storage {
    getItem(key: string): SyncTasks.Promise<string>;
    setItem(key: string, value: string): SyncTasks.Promise<void>;
    removeItem(key: string): SyncTasks.Promise<void>;
    clear(): SyncTasks.Promise<void>;
}
declare var _default: Storage;
export default _default;
