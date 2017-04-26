/**
* Location.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Methods to fetch the user's location.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RX = require("../common/Interfaces");
var SyncTasks = require("synctasks");
var Types = require("../common/Types");
var Location = (function (_super) {
    __extends(Location, _super);
    function Location() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Location.prototype.setConfiguration = function (config) {
        if (this.isAvailable() && navigator.geolocation.setRNConfiguration) {
            navigator.geolocation.setRNConfiguration(config);
        }
    };
    // Check if a geolocation service is available.
    Location.prototype.isAvailable = function () {
        return !!('geolocation' in navigator);
    };
    // Get the current location of the user. This method returns a promise that either
    // resolves to the position or rejects with an error code.
    Location.prototype.getCurrentPosition = function (options) {
        var deferred = SyncTasks.Defer();
        var reportedError = false;
        if (!this.isAvailable()) {
            var error = {
                code: Types.LocationErrorType.PositionUnavailable,
                message: 'Position unavailable because device does not support it.',
                PERMISSION_DENIED: 0,
                POSITION_UNAVAILABLE: 1,
                TIMEOUT: 0
            };
            return deferred.reject(error).promise();
        }
        navigator.geolocation.getCurrentPosition(function (position) {
            deferred.resolve(position);
        }, function (error) {
            // We need to protect against a known bug on some platforms where
            // a timeout error is reported after other types of errors (e.g.
            // the user hasn't granted access).
            if (!reportedError) {
                deferred.reject(error);
                reportedError = true;
            }
        }, options);
        return deferred.promise();
    };
    // Get the current location of the user on a repeating basis. This method returns
    // a promise that resolves to a watcher id or rejects with an error code. If resolved,
    // future locations and errors will be piped through the provided callbacks.
    Location.prototype.watchPosition = function (successCallback, errorCallback, options) {
        if (!this.isAvailable()) {
            return SyncTasks.Rejected(Types.LocationErrorType.PositionUnavailable);
        }
        var watchId = navigator.geolocation.watchPosition(function (position) {
            successCallback(position);
        }, function (error) {
            if (errorCallback) {
                errorCallback(error.code);
            }
        }, options);
        return SyncTasks.Resolved(watchId);
    };
    // Clears a location watcher from watchPosition.
    Location.prototype.clearWatch = function (watchID) {
        navigator.geolocation.clearWatch(watchID);
    };
    return Location;
}(RX.Location));
exports.Location = Location;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Location();
