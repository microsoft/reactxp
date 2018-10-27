/**
 * Linking.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Common implementation for deep linking.
 */

import * as SyncTasks from 'synctasks';

import * as RX from './Interfaces';
import { filter } from './lodashMini';

// Collection of Regex that help validate an email.
// The name can be any of these characters.
const emailNameRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.@-]+$/i;
// However, the name cannot contain '..', or start/end with '.'.
const emailNameConstraintViolationRegex = /\.\.|^\.|\.$/i;
// The host is limited to these characters.
const emailHostRegex = /^[a-z0-9.-]+$/i;
// However, the host cannot contain '..', start/end with '.', or have any (sub)domain start/end with '-'.
const emailHostConstraintViolationRegex = /\.\.|^[.-]|[.-]$|\.-|-\./i;

export abstract class Linking extends RX.Linking {
    protected abstract _openUrl(url: string): SyncTasks.Promise<void>;

    // Launches SMS app
    launchSms(phoneInfo: RX.Types.SmsInfo): SyncTasks.Promise<void> {
        // Format phone info
        const phoneUrl = this._createSmsUrl(phoneInfo);
        return this._openUrl(phoneUrl);
    }

    // Opens url
    openUrl(url: string): SyncTasks.Promise<void> {
        return this._openUrl(url);
    }

    // Escaped Email uri - mailto:[emailAddress]?subject=<emailSubject>&body=<emailBody>
    protected _createEmailUrl(emailInfo: RX.Types.EmailInfo) {
        let emailUrl = 'mailto:';
        let validEmails: string[];

        if (emailInfo.to && emailInfo.to.length > 0) {
            validEmails = this._filterValidEmails(emailInfo.to);
            emailUrl += validEmails.join(',');
        }

        emailUrl += '?';

        if (emailInfo.cc && emailInfo.cc.length > 0) {
            validEmails = this._filterValidEmails(emailInfo.cc);
            emailUrl += 'cc=' + validEmails.join(',') + '&';
        }

        if (emailInfo.bcc && emailInfo.bcc.length > 0) {
            validEmails = this._filterValidEmails(emailInfo.bcc);
            emailUrl += 'bcc=' + validEmails.join(',') + '&';
        }

        if (emailInfo.subject) {
            emailUrl += 'subject=' + encodeURIComponent(emailInfo.subject) + '&';
        }

        if (emailInfo.body) {
            emailUrl += 'body=' + encodeURIComponent(emailInfo.body);
        }
        return emailUrl;
    }

    // Escaped SMS uri - sms:<phoneNumber>?body=<messageString>
    protected _createSmsUrl(smsInfo: RX.Types.SmsInfo) {
        let smsUrl = 'sms:';
        if (smsInfo.phoneNumber) {
            smsUrl += encodeURI(smsInfo.phoneNumber);
        }

        if (smsInfo.body) {
            smsUrl += '?body=' + encodeURIComponent(smsInfo.body);
        }
        return smsUrl;
    }

    private _isEmailValid(email: string): boolean {
        // Emails have a max length of 254, and the smallest email looks like 'a@io' (with length 4).
        if (!email || email.length > 254 || email.length < 4) {
            return false;
        }
        // Note: using 'last' since '@' is valid in the name (but not the host, otherwise it would be impossible to parse).
        const lastAtIndex = email.lastIndexOf('@');
        // Email must have an '@', and there must be characters on each side of the '@'.
        // Note: the host must have at least two characters.
        if (lastAtIndex === -1 || lastAtIndex === 0 || lastAtIndex >= email.length - 2) {
            return false;
        }

        const name = email.substring(0, lastAtIndex);
        const host = email.substring(lastAtIndex + 1);

        return !emailNameConstraintViolationRegex.test(name)
            && !emailHostConstraintViolationRegex.test(host)
            && emailNameRegex.test(name)
            && emailHostRegex.test(host);
    }

    private _filterValidEmails(emails: string[]): string[] {
        return filter(emails, e => this._isEmailValid(e));
    }
}
