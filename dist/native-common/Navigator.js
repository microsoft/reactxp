/**
* Navigator.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common native implementation for Navigator on mobile.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RN = require("react-native");
var RX = require("../common/Interfaces");
var Input_1 = require("./Input");
var NavigatorCommon_1 = require("./NavigatorCommon");
var NavigatorStandardDelegate_1 = require("./NavigatorStandardDelegate");
var NavigatorExperimentalDelegate_1 = require("./NavigatorExperimentalDelegate");
var Navigator = (function (_super) {
    __extends(Navigator, _super);
    function Navigator(initialProps) {
        var _this = _super.call(this, initialProps) || this;
        _this._commandQueue = [];
        if (RN.Platform.OS === 'android' || RN.Platform.OS === 'ios') {
            _this._delegate = new NavigatorExperimentalDelegate_1.default(_this);
        }
        else {
            _this._delegate = new NavigatorStandardDelegate_1.default(_this);
        }
        return _this;
    }
    Navigator.prototype.componentDidMount = function () {
        Input_1.default.backButtonEvent.subscribe(this._delegate.onBackPress);
    };
    Navigator.prototype.componentWillUnmount = function () {
        Input_1.default.backButtonEvent.unsubscribe(this._delegate.onBackPress);
    };
    Navigator.prototype.componentDidUpdate = function () {
        // Catch up with any pending commands
        this._processCommand();
    };
    Navigator.prototype.getRoutes = function () {
        return this._delegate.getRoutes();
    };
    // Push a new route if initial route doesn't exist
    Navigator.prototype.push = function (route) {
        this._enqueueCommand({
            type: NavigatorCommon_1.CommandType.Push,
            param: {
                route: route
            }
        });
    };
    Navigator.prototype.pop = function () {
        this._enqueueCommand({
            type: NavigatorCommon_1.CommandType.Pop,
            param: {}
        });
    };
    Navigator.prototype.replace = function (route) {
        this._enqueueCommand({
            type: NavigatorCommon_1.CommandType.Replace,
            param: {
                route: route
            }
        });
    };
    Navigator.prototype.replacePrevious = function (route) {
        this._enqueueCommand({
            type: NavigatorCommon_1.CommandType.Replace,
            param: {
                route: route,
                value: -1
            }
        });
    };
    // This method replaces the route at the given index of the stack and pops to that index.
    Navigator.prototype.replaceAtIndex = function (route, index) {
        var routes = this.getRoutes();
        // Pop to index route and then replace if not last one
        if (index < routes.length - 1) {
            var route_1 = routes[index];
            this.popToRoute(route_1);
        }
        // Schedule a replace
        this.replace(route);
    };
    // Reset route stack with default route stack
    Navigator.prototype.immediatelyResetRouteStack = function (nextRouteStack) {
        this._delegate.immediatelyResetRouteStack(nextRouteStack);
    };
    Navigator.prototype.popToRoute = function (route) {
        this._enqueueCommand({
            type: NavigatorCommon_1.CommandType.Pop,
            param: {
                route: route
            }
        });
    };
    Navigator.prototype.popToTop = function () {
        this._enqueueCommand({
            type: NavigatorCommon_1.CommandType.Pop,
            param: {
                value: -1
            }
        });
    };
    Navigator.prototype.getCurrentRoutes = function () {
        return this.getRoutes();
    };
    // Render without initial route to get a reference for Navigator object
    Navigator.prototype.render = function () {
        return this._delegate.render();
    };
    Navigator.prototype._enqueueCommand = function (command) {
        this._commandQueue.push(command);
        this._processCommand();
    };
    Navigator.prototype._processCommand = function () {
        this._delegate.processCommand(this._commandQueue);
    };
    return Navigator;
}(RX.Navigator));
exports.Navigator = Navigator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navigator;
