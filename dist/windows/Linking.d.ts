/**
* Linking.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific implementation for deep linking.
*/
import SyncTasks = require('synctasks');
import { Linking as CommonLinking } from '../common/Linking';
export declare class Linking extends CommonLinking {
    protected _openUrl(url: string): SyncTasks.Promise<void>;
    getInitialUrl(): SyncTasks.Promise<string>;
}
declare var _default: Linking;
export default _default;
