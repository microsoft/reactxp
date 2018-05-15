"use strict";
/**
* App.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows implementation of App API namespace.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var RootView_1 = require("./RootView");
var App_1 = require("../native-common/App");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.getRootViewFactory = function () {
        return function () { return RootView_1.RootView; };
    };
    App.prototype.getRootViewUsingPropsFactory = function () {
        return function () { return RootView_1.RootViewUsingProps; };
    };
    return App;
}(App_1.App));
exports.App = App;
exports.default = new App();
