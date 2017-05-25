/**
* Linking.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation for deep linking.
*/

import RN = require('react-native');
import SyncTasks = require('synctasks');

import { Linking as CommonLinking } from '../common/Linking';
import Types = require('../common/Types');

export class Linking extends CommonLinking {
    constructor() {
        super();

        RN.Linking.addEventListener('url', (event: { url: string }) => {
            this.deepLinkRequestEvent.fire(event.url);
        });
    }

    protected _openUrl(url: string): SyncTasks.Promise<void> {
        let defer = SyncTasks.Defer<void>();

        RN.Linking.canOpenURL(url).then(value => {
            if (!value) {
                defer.reject({
                    code: Types.LinkingErrorCode.NoAppFound,
                    url: url,
                    description: 'No app found to handle url: ' + url
                } as Types.LinkingErrorInfo);
            } else {
                return RN.Linking.openURL(url);
            }
        }).catch(error => {
            defer.reject({
                code: Types.LinkingErrorCode.UnexpectedFailure,
                url: url,
                description: error
            } as Types.LinkingErrorInfo);
        });

        return defer.promise();
    }

    getInitialUrl(): SyncTasks.Promise<string> {
        let defer = SyncTasks.Defer<string>();

        RN.Linking.getInitialURL().then(url => {
            defer.resolve(url);
        }).catch(error => {
            defer.reject({
                code: Types.LinkingErrorCode.InitialUrlNotFound,
                url: null,
                description: error
            } as Types.LinkingErrorInfo);
        });

        return defer.promise();
    }
}

export default new Linking();
