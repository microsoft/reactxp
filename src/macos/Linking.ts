/**
 * Linking.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * MacOS-specific implementation for deep linking.
 */

import { Types } from '../common/Interfaces';
import { Linking as CommonLinking } from '../native-common/Linking';

export class Linking extends CommonLinking {
    // Escaped SMS uri - sms:<phoneNumber>&body=<messageString>
    protected _createSmsUrl(smsInfo: Types.SmsInfo) {
        let smsUrl = 'sms:';
        if (smsInfo.phoneNumber) {
            smsUrl += encodeURI(smsInfo.phoneNumber);
        }

        if (smsInfo.body) {
            // (keep ios version for now)iOS uses the & delimiter instead of the regular ?.
            smsUrl += '&body=' + encodeURIComponent(smsInfo.body);
        }
        return smsUrl;
    }
}

export default new Linking();
