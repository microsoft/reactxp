/**
* Linking.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation for deep linking
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SyncTasks = require("synctasks");
var Types = require("../common/Types");
var Linking_1 = require("../common/Linking");
var Linking = (function (_super) {
    __extends(Linking, _super);
    function Linking() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Linking.prototype._openUrl = function (url) {
        var otherWindow = window.open();
        if (!otherWindow) {
            // window opening was blocked by browser (probably not
            // invoked in direct reaction to user action, like thru
            // promise or setTimeout).
            return SyncTasks.Rejected({
                code: Types.LinkingErrorCode.Blocked,
                url: url,
                description: 'Window was blocked by popup blocker'
            });
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
        return SyncTasks.Resolved();
    };
    Linking.prototype.getInitialUrl = function () {
        return SyncTasks.Resolved(null);
    };
    return Linking;
}(Linking_1.Linking));
exports.Linking = Linking;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Linking();
