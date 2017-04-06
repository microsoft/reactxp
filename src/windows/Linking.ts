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

export class Linking extends CommonLinking {
    protected _openUrl(url: string): SyncTasks.Promise<void> {
        // TODO: #694142 Not implemented
        throw 'Not implemented';
        // return SyncTasks.Resolved<boolean>(false);
    }

    getInitialUrl(): SyncTasks.Promise<string> {
        // TODO: #694142 Not implemented
        return SyncTasks.Resolved<string>(null);
    }
}

export default new Linking();
