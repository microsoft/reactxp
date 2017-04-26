/**
* MainViewStore.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* A simple store that publishes changes to the main element
* provided by the app.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SubscribableEvent = require("../common/SubscribableEvent");
var MainViewStore = (function (_super) {
    __extends(MainViewStore, _super);
    function MainViewStore() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._mainView = null;
        return _this;
    }
    MainViewStore.prototype.getMainView = function () {
        return this._mainView;
    };
    MainViewStore.prototype.setMainView = function (view) {
        this._mainView = view;
        this.fire();
    };
    return MainViewStore;
}(SubscribableEvent.SubscribableEvent));
exports.MainViewStore = MainViewStore;
var instance = new MainViewStore();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = instance;
