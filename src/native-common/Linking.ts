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

import { Types } from '../common/Interfaces';
import { Linking as CommonLinking } from '../common/Linking';

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
                const linkingError: Types.LinkingErrorInfo = {
                    code: Types.LinkingErrorCode.NoAppFound,
                    url: url,
                    description: 'No app found to handle url: ' + url
                };
                return SyncTasks.Rejected(linkingError);
            } else {
                return SyncTasks.fromThenable(RN.Linking.openURL(url));
            }
        }).catch(error => {
            const linkingError: Types.LinkingErrorInfo = {
                code: Types.LinkingErrorCode.UnexpectedFailure,
                url: url,
                description: error
            };
            return SyncTasks.Rejected(linkingError);
        });
    }

    getInitialUrl(): SyncTasks.Promise<string | undefined> {
        return SyncTasks.fromThenable(RN.Linking.getInitialURL())
        .then(url => !!url ? url : undefined)
        .catch(error => {
            const linkingError: Types.LinkingErrorInfo = {
                code: Types.LinkingErrorCode.InitialUrlNotFound,
                description: error
            };
            return SyncTasks.Rejected(linkingError);
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
