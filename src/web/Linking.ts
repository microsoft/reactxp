/**
 * Linking.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation for deep linking
 */

import { Types } from '../common/Interfaces';
import { Linking as CommonLinking } from '../common/Linking';

export class Linking extends CommonLinking {
    protected _openUrl(url: string): Promise<void> {
        const otherWindow = window.open();
        if (!otherWindow) {
            // window opening was blocked by browser (probably not
            // invoked in direct reaction to user action, like thru
            // promise or setTimeout).
            const linkingError: Types.LinkingErrorInfo = {
                code: Types.LinkingErrorCode.Blocked,
                url: url,
                description: 'Window was blocked by popup blocker',
            };
            return Promise.reject<void>(linkingError);
        }
        // SECURITY WARNING:
        //   Destroy the back-link to this window. Otherwise the (untrusted) URL we are about to load can redirect OUR window.
        //   See: https://mathiasbynens.github.io/rel-noopener/
        // Note: can only set to null, otherwise is readonly.
        // Note: In order for mailto links to work properly window.opener cannot be null.
        if (url.indexOf('mailto:') !== 0) {
            otherWindow.opener = null;
        }
        otherWindow.location.href = url;

        return Promise.resolve<void>(void 0);
    }

    launchEmail(emailInfo: Types.EmailInfo): Promise<void> {
        // Format email info
        const emailUrl = this._createEmailUrl(emailInfo);
        window.location.href = emailUrl;

        return Promise.resolve<void>(void 0);
    }

    getInitialUrl(): Promise<string | undefined> {
        return Promise.resolve(undefined);
    }
}

export default new Linking();
