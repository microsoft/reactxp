/**
* UserPresence.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of the RX interfaces related to
* user presence.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RX = require("../common/Interfaces");
var UserPresence = (function (_super) {
    __extends(UserPresence, _super);
    function UserPresence() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // On native platforms, assume that the user is present
    // whenever the app is running.
    UserPresence.prototype.isUserPresent = function () {
        return true;
    };
    return UserPresence;
}(RX.UserPresence));
exports.UserPresence = UserPresence;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new UserPresence();
