/**
* Linking.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common implementation for deep linking.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("./lodashMini");
var RX = require("../common/Interfaces");
// Collection of Regex that help validate an email.
// The name can be any of these characters.
var emailNameRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.@-]+$/i;
// However, the name cannot contain '..', or start/end with '.'.
var emailNameConstraintViolationRegex = /\.\.|^\.|\.$/i;
// The host is limited to these characters.
var emailHostRegex = /^[a-z0-9.-]+$/i;
// However, the host cannot contain '..', start/end with '.', or have any (sub)domain start/end with '-'.
var emailHostConstraintViolationRegex = /\.\.|^[.-]|[.-]$|\.-|-\./i;
var Linking = (function (_super) {
    __extends(Linking, _super);
    function Linking() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Launches Email app
    Linking.prototype.launchEmail = function (emailInfo) {
        // Format email info
        var emailUrl = this._createEmailUrl(emailInfo);
        return this._openUrl(emailUrl);
    };
    // Launches SMS app
    Linking.prototype.launchSms = function (phoneInfo) {
        // Format phone info
        var phoneUrl = this._createSmsUrl(phoneInfo);
        return this._openUrl(phoneUrl);
    };
    // Opens url
    Linking.prototype.openUrl = function (url) {
        return this._openUrl(url);
    };
    // Escaped Email uri - mailto:[emailAddress]?subject=<emailSubject>&body=<emailBody>
    Linking.prototype._createEmailUrl = function (emailInfo) {
        var emailUrl = 'mailto:';
        var validEmails;
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
    };
    // Escaped SMS uri - sms:<phoneNumber>?body=<messageString>
    Linking.prototype._createSmsUrl = function (smsInfo) {
        var smsUrl = 'sms:';
        if (smsInfo.phoneNumber) {
            smsUrl += encodeURI(smsInfo.phoneNumber);
        }
        if (smsInfo.body) {
            smsUrl += '?body=' + encodeURIComponent(smsInfo.body);
        }
        return smsUrl;
    };
    Linking.prototype._isEmailValid = function (email) {
        // Emails have a max length of 254, and the smallest email looks like 'a@io' (with length 4).
        if (!email || email.length > 254 || email.length < 4) {
            return false;
        }
        // Note: using 'last' since '@' is valid in the name (but not the host, otherwise it would be impossible to parse).
        var lastAtIndex = email.lastIndexOf('@');
        // Email must have an '@', and there must be characters on each side of the '@'.
        // Note: the host must have at least two characters.
        if (lastAtIndex === -1 || lastAtIndex === 0 || lastAtIndex >= email.length - 2) {
            return false;
        }
        var name = email.substring(0, lastAtIndex);
        var host = email.substring(lastAtIndex + 1);
        return !emailNameConstraintViolationRegex.test(name)
            && !emailHostConstraintViolationRegex.test(host)
            && emailNameRegex.test(name)
            && emailHostRegex.test(host);
    };
    Linking.prototype._filterValidEmails = function (emails) {
        var _this = this;
        var validEmails = _.filter(emails, function (e) {
            return _this._isEmailValid(e);
        });
        return validEmails;
    };
    return Linking;
}(RX.Linking));
exports.Linking = Linking;
