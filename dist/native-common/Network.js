/**
* Network.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of network information APIs.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RN = require("react-native");
var SyncTasks = require("synctasks");
var RX = require("../common/Interfaces");
var Network = (function (_super) {
    __extends(Network, _super);
    function Network() {
        var _this = _super.call(this) || this;
        var onEventOccuredHandler = _this._onEventOccured.bind(_this);
        RN.NetInfo.isConnected.addEventListener('change', onEventOccuredHandler);
        return _this;
    }
    Network.prototype.isConnected = function () {
        var deferred = SyncTasks.Defer();
        RN.NetInfo.isConnected.fetch().then(function (isConnected) {
            deferred.resolve(isConnected);
        }).catch(function () {
            deferred.reject('RN.NetInfo.isConnected.fetch() failed');
        });
        return deferred.promise();
    };
    Network.prototype.fetchNetworkType = function () {
        return SyncTasks.fromThenable(RN.NetInfo.fetch().then(function (networkType) {
            return Network._NativeNetworkTypeToDeviceNetworkType(networkType);
        }));
    };
    Network.prototype._onEventOccured = function (isConnected) {
        this.connectivityChangedEvent.fire(isConnected);
    };
    Network._NativeNetworkTypeToDeviceNetworkType = function (networkType) {
        switch (networkType) {
            case 'UNKNOWN':
                return RX.DeviceNetworkType.UNKNOWN;
            case 'NONE':
                return RX.DeviceNetworkType.NONE;
            case 'WIFI':
                return RX.DeviceNetworkType.WIFI;
            case 'MOBILE_2G':
                return RX.DeviceNetworkType.MOBILE_2G;
            case 'MOBILE_3G':
                return RX.DeviceNetworkType.MOBILE_3G;
            case 'MOBILE_4G':
                return RX.DeviceNetworkType.MOBILE_4G;
        }
        return RX.DeviceNetworkType.UNKNOWN;
    };
    return Network;
}(RX.Network));
exports.Network = Network;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Network();
