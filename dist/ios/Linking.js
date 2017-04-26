/**
* Linking.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* iOS-specific implementation for deep linking.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Linking_1 = require("../native-common/Linking");
var Linking = (function (_super) {
    __extends(Linking, _super);
    function Linking() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Escaped SMS uri - sms:<phoneNumber>&body=<messageString>
    Linking.prototype._createSmsUrl = function (smsInfo) {
        var smsUrl = 'sms:';
        if (smsInfo.phoneNumber) {
            smsUrl += encodeURI(smsInfo.phoneNumber);
        }
        if (smsInfo.body) {
            // iOS uses the & delimiter instead of the regular ?.
            smsUrl += '&body=' + encodeURIComponent(smsInfo.body);
        }
        return smsUrl;
    };
    return Linking;
}(Linking_1.Linking));
exports.Linking = Linking;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Linking();
