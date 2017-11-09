/**
* Linking.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation for deep linking
*/

import SyncTasks = require('synctasks');

import Types = require('../common/Types');

import { Linking as CommonLinking } from '../common/Linking';

export class Linking extends CommonLinking {
    protected _openUrl(url: string): SyncTasks.Promise<void> {
        const otherWindow = window.open();
        if (!otherWindow) {
            // window opening was blocked by browser (probably not
            // invoked in direct reaction to user action, like thru
            // promise or setTimeout).
            return SyncTasks.Rejected<void>({
                code: Types.LinkingErrorCode.Blocked,
                url: url,
                description: 'Window was blocked by popup blocker'
            } as Types.LinkingErrorInfo);
        }
        // SECURITY WARNING:
        //   Destroy the back-link to this window. Otherwise the (untrusted) URL we are about to load can redirect OUR window.
        //   See: https://mathiasbynens.github.io/rel-noopener/
        // Note: can only set to null, otherwise is readonly.
        // Note: In order for mailto links to work properly window.opener cannot be null.
        if (url.indexOf('mailto:') !== 0) {
            (otherWindow as any).opener = null;
        }
        otherWindow.location.href = url;

        return SyncTasks.Resolved<void>();
    }

    launchEmail(emailInfo: Types.EmailInfo): SyncTasks.Promise<void> {
        // Format email info
        const emailUrl = this._createEmailUrl(emailInfo);
        window.location.href = emailUrl;
        
        return SyncTasks.Resolved<void>();
    }

    getInitialUrl(): SyncTasks.Promise<string|undefined> {
        return SyncTasks.Resolved(undefined);
    }
}

export default new Linking();
