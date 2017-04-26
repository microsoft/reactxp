/**
* Linking.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific implementation for deep linking.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SyncTasks = require("synctasks");
var Linking_1 = require("../common/Linking");
var Linking = (function (_super) {
    __extends(Linking, _super);
    function Linking() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Linking.prototype._openUrl = function (url) {
        // TODO: #694142 Not implemented
        throw 'Not implemented';
        // return SyncTasks.Resolved<boolean>(false);
    };
    Linking.prototype.getInitialUrl = function () {
        // TODO: #694142 Not implemented
        return SyncTasks.Resolved(null);
    };
    return Linking;
}(Linking_1.Linking));
exports.Linking = Linking;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Linking();
