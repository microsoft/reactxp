/**
* AppConfig.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* A simple class to store application config.
*/
"use strict";
var AppConfig = (function () {
    function AppConfig() {
        this._isDebug = false;
        this._isDevelopment = false;
    }
    AppConfig.prototype.setAppConfig = function (isDebug, isDevelopment) {
        this._isDebug = isDebug;
        this._isDevelopment = isDevelopment;
    };
    AppConfig.prototype.isDebugMode = function () {
        return this._isDebug;
    };
    AppConfig.prototype.isDevelopmentMode = function () {
        return this._isDevelopment;
    };
    return AppConfig;
}());
exports.AppConfig = AppConfig;
var instance = new AppConfig();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = instance;
