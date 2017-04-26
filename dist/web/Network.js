/**
* Network.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of Network information APIs.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SyncTasks = require("synctasks");
var RX = require("../common/Interfaces");
var Network = (function (_super) {
    __extends(Network, _super);
    function Network() {
        var _this = _super.call(this) || this;
        var onEventOccuredHandler = _this._onEventOccured.bind(_this);
        // Avoid accessing window if it's not defined (for test environment).
        if (typeof (window) !== 'undefined') {
            window.addEventListener('online', onEventOccuredHandler);
            window.addEventListener('offline', onEventOccuredHandler);
        }
        return _this;
    }
    Network.prototype.isConnected = function () {
        return SyncTasks.Resolved(navigator.onLine);
    };
    Network.prototype.fetchNetworkType = function () {
        return SyncTasks.Resolved(RX.DeviceNetworkType.UNKNOWN);
    };
    Network.prototype._onEventOccured = function () {
        this.connectivityChangedEvent.fire(navigator.onLine);
    };
    return Network;
}(RX.Network));
exports.Network = Network;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Network();
