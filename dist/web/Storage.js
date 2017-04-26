/**
* Storage.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform database storage abstraction.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SyncTasks = require("synctasks");
var RX = require("../common/Interfaces");
var Storage = (function (_super) {
    __extends(Storage, _super);
    function Storage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Storage.prototype.getItem = function (key) {
        var value = window.localStorage.getItem(key);
        return SyncTasks.Resolved(value);
    };
    Storage.prototype.setItem = function (key, value) {
        window.localStorage.setItem(key, value);
        return SyncTasks.Resolved();
    };
    Storage.prototype.removeItem = function (key) {
        window.localStorage.removeItem(key);
        return SyncTasks.Resolved();
    };
    Storage.prototype.clear = function () {
        window.localStorage.clear();
        return SyncTasks.Resolved();
    };
    return Storage;
}(RX.Storage));
exports.Storage = Storage;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Storage();
