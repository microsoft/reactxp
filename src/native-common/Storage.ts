/**
* Storage.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of the cross-platform database storage abstraction.
*/

import RN = require('react-native');
import SyncTasks = require('synctasks');

import RX = require('../common/Interfaces');

export class Storage extends RX.Storage {
    getItem(key: string): SyncTasks.Promise<string|undefined> {
        var deferred = SyncTasks.Defer<string>();

        RN.AsyncStorage.getItem(key, (error: any, result: string|undefined) => {
            if (!error) {
                deferred.resolve(result!!!);
            } else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    }

    setItem(key: string, value: string): SyncTasks.Promise<void> {
        var deferred = SyncTasks.Defer<void>();

        RN.AsyncStorage.setItem(key, value, (error: any) => {
            if (!error) {
                deferred.resolve(void 0);
            } else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    }

    removeItem(key: string): SyncTasks.Promise<void> {
        var deferred = SyncTasks.Defer<void>();

        RN.AsyncStorage.removeItem(key, (error: any) => {
            if (!error) {
                deferred.resolve(void 0);
            } else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    }

    clear(): SyncTasks.Promise<void> {
        var deferred = SyncTasks.Defer<void>();

        RN.AsyncStorage.clear((error: any) => {
            if (!error) {
                deferred.resolve(void 0);
            } else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    }
}

export default new Storage();
