/**
* Linking.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation for deep linking.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RN = require("react-native");
var SyncTasks = require("synctasks");
var Linking_1 = require("../common/Linking");
var Types = require("../common/Types");
var Linking = (function (_super) {
    __extends(Linking, _super);
    function Linking() {
        var _this = _super.call(this) || this;
        RN.Linking.addEventListener('url', function (event) {
            _this.deepLinkRequestEvent.fire(event.url);
        });
        return _this;
    }
    Linking.prototype._openUrl = function (url) {
        var defer = SyncTasks.Defer();
        RN.Linking.canOpenURL(url).then(function (value) {
            if (!value) {
                defer.reject({
                    code: Types.LinkingErrorCode.NoAppFound,
                    url: url,
                    description: 'No app found to handle url: ' + url
                });
            }
            else {
                return RN.Linking.openURL(url);
            }
        }).catch(function (error) {
            defer.reject({
                code: Types.LinkingErrorCode.UnexpectedFailure,
                url: url,
                description: error
            });
        });
        return defer.promise();
    };
    Linking.prototype.getInitialUrl = function () {
        var defer = SyncTasks.Defer();
        RN.Linking.getInitialURL().then(function (url) {
            defer.resolve(url);
        }).catch(function (error) {
            defer.reject({
                code: Types.LinkingErrorCode.InitialUrlNotFound,
                url: null,
                description: error
            });
        });
        return defer.promise();
    };
    return Linking;
}(Linking_1.Linking));
exports.Linking = Linking;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Linking();
