/*
 * Interfaces.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Interface definition for cross-platform ReactXP plugin for gathering network/connectivity
 * info. This was extracted from the reactxp core
 */

import * as SyncTasks from 'synctasks';
import SubscribableEvent from 'subscribableevent';

import * as Types from './Types';

export abstract class NetInfo {
    abstract isConnected(): SyncTasks.Promise<boolean>;
    abstract getType(): SyncTasks.Promise<Types.DeviceNetworkType>;
    connectivityChangedEvent = new SubscribableEvent<(isConnected: boolean) => void>();
}

export interface PluginInterface {
    Types: typeof Types;

    default: NetInfo;
}
