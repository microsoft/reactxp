/**
* Storage.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of the cross-platform database storage abstraction.
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
var Storage = (function (_super) {
    __extends(Storage, _super);
    function Storage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Storage.prototype.getItem = function (key) {
        var deferred = SyncTasks.Defer();
        RN.AsyncStorage.getItem(key, function (error, result) {
            if (!error) {
                deferred.resolve(result);
            }
            else {
                deferred.reject(error);
            }
        });
        return deferred.promise();
    };
    Storage.prototype.setItem = function (key, value) {
        var deferred = SyncTasks.Defer();
        RN.AsyncStorage.setItem(key, value, function (error) {
            if (!error) {
                deferred.resolve();
            }
            else {
                deferred.reject(error);
            }
        });
        return deferred.promise();
    };
    Storage.prototype.removeItem = function (key) {
        var deferred = SyncTasks.Defer();
        RN.AsyncStorage.removeItem(key, function (error) {
            if (!error) {
                deferred.resolve();
            }
            else {
                deferred.reject(error);
            }
        });
        return deferred.promise();
    };
    Storage.prototype.clear = function () {
        var deferred = SyncTasks.Defer();
        RN.AsyncStorage.clear(function (error) {
            if (!error) {
                deferred.resolve();
            }
            else {
                deferred.reject(error);
            }
        });
        return deferred.promise();
    };
    return Storage;
}(RX.Storage));
exports.Storage = Storage;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Storage();
