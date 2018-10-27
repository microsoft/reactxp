/**
 * Storage.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform database storage abstraction.
 */

import * as SyncTasks from 'synctasks';

import * as RX from '../common/Interfaces';

export class Storage extends RX.Storage {
    getItem(key: string): SyncTasks.Promise<string | undefined> {
        const value = window.localStorage.getItem(key);
        return SyncTasks.Resolved<string | undefined>(value === null ? undefined : value);
    }

    setItem(key: string, value: string): SyncTasks.Promise<void> {
        window.localStorage.setItem(key, value);
        return SyncTasks.Resolved<void>();
    }

    removeItem(key: string): SyncTasks.Promise<void> {
        window.localStorage.removeItem(key);
        return SyncTasks.Resolved<void>();
    }

    clear(): SyncTasks.Promise<void> {
        window.localStorage.clear();
        return SyncTasks.Resolved<void>();
    }
}

export default new Storage();
