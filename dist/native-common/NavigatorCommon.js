/**
* NavigatorCommon.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common native interfaces for Navigator on mobile.
* We need this class to avoid circular references between Navigator and NavigatorDelegates.
*/
"use strict";
var CommandType;
(function (CommandType) {
    CommandType[CommandType["Push"] = 0] = "Push";
    CommandType[CommandType["Pop"] = 1] = "Pop";
    CommandType[CommandType["Replace"] = 2] = "Replace";
})(CommandType = exports.CommandType || (exports.CommandType = {}));
var NavigatorDelegate = (function () {
    function NavigatorDelegate(navigator) {
        var _this = this;
        this.onBackPress = function () {
            var routes = _this.getRoutes();
            if (routes.length > 1) {
                _this.handleBackPress();
                if (_this._owner.props.navigateBackCompleted) {
                    _this._owner.props.navigateBackCompleted();
                }
                // Indicate that we handled the event.
                return true;
            }
            return false;
        };
        this._owner = navigator;
    }
    return NavigatorDelegate;
}());
exports.NavigatorDelegate = NavigatorDelegate;
