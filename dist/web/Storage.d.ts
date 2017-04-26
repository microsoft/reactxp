/**
* Storage.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform database storage abstraction.
*/
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
