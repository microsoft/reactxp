/**
 * Linking.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation for deep linking.
 */

import * as RN from 'react-native';
import * as SyncTasks from 'synctasks';

import { Linking as CommonLinking } from '../common/Linking';
import { Types } from '../common/Interfaces';

export class Linking extends CommonLinking {
    constructor() {
        super();

        RN.Linking.addEventListener('url', (event: { url: string }) => {
            this.deepLinkRequestEvent.fire(event.url);
        });
    }

    protected _openUrl(url: string): SyncTasks.Promise<void> {
        return SyncTasks.fromThenable(RN.Linking.canOpenURL(url))
        .then(value => {
            if (!value) {
                return SyncTasks.Rejected({
                    code: Types.LinkingErrorCode.NoAppFound,
                    url: url,
                    description: 'No app found to handle url: ' + url
                } as Types.LinkingErrorInfo);
            } else {
                return SyncTasks.fromThenable(RN.Linking.openURL(url));
            }
        }).catch(error => {
            return SyncTasks.Rejected({
                code: Types.LinkingErrorCode.UnexpectedFailure,
                url: url,
                description: error
            } as Types.LinkingErrorInfo);
        });
    }

    getInitialUrl(): SyncTasks.Promise<string|undefined> {
        return SyncTasks.fromThenable(RN.Linking.getInitialURL())
        .then(url => !!url ? url : undefined)
        .catch(error => {
            return SyncTasks.Rejected({
                code: Types.LinkingErrorCode.InitialUrlNotFound,
                description: error
            } as Types.LinkingErrorInfo);
        });
    }

    // Launches Email app
    launchEmail(emailInfo: Types.EmailInfo): SyncTasks.Promise<void> {
        // Format email info
        const emailUrl = this._createEmailUrl(emailInfo);
        return this._openUrl(emailUrl);
    }
}

export default new Linking();
