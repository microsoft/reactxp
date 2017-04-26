/**
* Clipboard.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Clipboard abstraction.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RN = require("react-native");
var RX = require("../common/Interfaces");
var SyncTasks = require("synctasks");
var Clipboard = (function (_super) {
    __extends(Clipboard, _super);
    function Clipboard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Clipboard.prototype.setText = function (text) {
        RN.Clipboard.setString(text);
    };
    Clipboard.prototype.getText = function () {
        var defer = SyncTasks.Defer();
        return SyncTasks.fromThenable(RN.Clipboard.getString());
    };
    return Clipboard;
}(RX.Clipboard));
exports.Clipboard = Clipboard;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Clipboard();
