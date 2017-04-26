/**
* UserInterface.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN implementation of the ReactXP interfaces related to
* UI (layout measurements, etc.).
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var assert = require("assert");
var RN = require("react-native");
var SyncTasks = require("synctasks");
var MainViewStore_1 = require("./MainViewStore");
var RX = require("../common/Interfaces");
var UserInterface = (function (_super) {
    __extends(UserInterface, _super);
    function UserInterface() {
        var _this = _super.call(this) || this;
        RN.DeviceEventEmitter.addListener('didUpdateContentSizeMultiplier', function (newValue) {
            _this.contentSizeMultiplierChangedEvent.fire(newValue);
        });
        return _this;
    }
    UserInterface.prototype.measureLayoutRelativeToWindow = function (component) {
        var deferred = SyncTasks.Defer();
        var nodeHandle = RN.findNodeHandle(component);
        assert.ok(!!nodeHandle);
        RN.NativeModules.UIManager.measureInWindow(nodeHandle, function (x, y, width, height, pageX, pageY) {
            deferred.resolve({
                x: x,
                y: y,
                width: width,
                height: height
            });
        });
        return deferred.promise();
    };
    UserInterface.prototype.measureLayoutRelativeToAncestor = function (component, ancestor) {
        var deferred = SyncTasks.Defer();
        var nodeHandle = RN.findNodeHandle(component);
        var ancestorNodeHander = RN.findNodeHandle(ancestor);
        RN.NativeModules.UIManager.measureLayout(nodeHandle, ancestorNodeHander, function () {
            deferred.reject('UIManager.measureLayout() failed');
        }, function (x, y, width, height, pageX, pageY) {
            deferred.resolve({
                x: x,
                y: y,
                width: width,
                height: height
            });
        });
        return deferred.promise();
    };
    UserInterface.prototype.measureWindow = function () {
        var dimensions = RN.Dimensions.get('window');
        return {
            x: 0,
            y: 0,
            width: dimensions.width,
            height: dimensions.height
        };
    };
    UserInterface.prototype.getContentSizeMultiplier = function () {
        var deferred = SyncTasks.Defer();
        // TODO: #727532 Remove conditional after implementing UIManager.getContentSizeMultiplier for UWP
        if (RN.Platform.OS === 'windows') {
            deferred.resolve(1);
        }
        else {
            RN.NativeModules.UIManager.getContentSizeMultiplier(function (value) {
                deferred.resolve(value);
            });
        }
        return deferred.promise();
    };
    UserInterface.prototype.useCustomScrollbars = function (enable) {
        if (enable === void 0) { enable = true; }
        // Nothing to do
    };
    UserInterface.prototype.dismissKeyboard = function () {
        RN.TextInput.State.blurTextInput(RN.TextInput.State.currentlyFocusedField());
    };
    UserInterface.prototype.isHighPixelDensityScreen = function () {
        var ratio = RN.PixelRatio.get();
        var isHighDef = ratio > 1;
        return isHighDef;
    };
    UserInterface.prototype.getPixelRatio = function () {
        return RN.PixelRatio.get();
    };
    UserInterface.prototype.setMainView = function (element) {
        MainViewStore_1.default.setMainView(element);
    };
    UserInterface.prototype.renderMainView = function () {
        // Nothing to do
    };
    return UserInterface;
}(RX.UserInterface));
exports.UserInterface = UserInterface;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new UserInterface();
