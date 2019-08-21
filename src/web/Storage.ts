/**
 * Storage.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform database storage abstraction.
 */

import * as RX from '../common/Interfaces';

export class Storage extends RX.Storage {
    getItem(key: string): Promise<string | undefined> {
        const value = window.localStorage.getItem(key);
        return Promise.resolve<string | undefined>(value === null ? undefined : value);
    }

    setItem(key: string, value: string): Promise<void> {
        try {
            window.localStorage.setItem(key, value);
        } catch (e) {
            return Promise.resolve(e);
        }
        return Promise.resolve<void>(void 0);
    }

    removeItem(key: string): Promise<void> {
        window.localStorage.removeItem(key);
        return Promise.resolve<void>(void 0);
    }

    clear(): Promise<void> {
        window.localStorage.clear();
        return Promise.resolve<void>(void 0);
    }
}

export default new Storage();
