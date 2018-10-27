/**
 * Storage.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Native implementation of the cross-platform database storage abstraction.
 */

import * as RN from 'react-native';
import * as SyncTasks from 'synctasks';

import * as RX from '../common/Interfaces';

export class Storage extends RX.Storage {
    getItem(key: string): SyncTasks.Promise<string | undefined> {
        const deferred = SyncTasks.Defer<string | undefined>();

        RN.AsyncStorage.getItem(key, (error: any, result: string | undefined) => {
            if (!error) {
                deferred.resolve(result || undefined);
            } else {
                deferred.reject(error);
            }
        }).catch(err => {
            deferred.reject(err);
        });

        return deferred.promise();
    }

    setItem(key: string, value: string): SyncTasks.Promise<void> {
        const deferred = SyncTasks.Defer<void>();

        RN.AsyncStorage.setItem(key, value, (error: any) => {
            if (!error) {
                deferred.resolve(void 0);
            } else {
                deferred.reject(error);
            }
        }).catch(err => {
            deferred.reject(err);
        });

        return deferred.promise();
    }

    removeItem(key: string): SyncTasks.Promise<void> {
        const deferred = SyncTasks.Defer<void>();

        RN.AsyncStorage.removeItem(key, (error: any) => {
            if (!error) {
                deferred.resolve(void 0);
            } else {
                deferred.reject(error);
            }
        }).catch(err => {
            deferred.reject(err);
        });

        return deferred.promise();
    }

    clear(): SyncTasks.Promise<void> {
        const deferred = SyncTasks.Defer<void>();

        RN.AsyncStorage.clear((error: any) => {
            if (!error) {
                deferred.resolve(void 0);
            } else {
                deferred.reject(error);
            }
        }).catch(err => {
            deferred.reject(err);
        });

        return deferred.promise();
    }
}

export default new Storage();
