/**
* ScrollViewConfig.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific scroll view configuration, required to avoid circular
* dependency between application and ScrollView.
*/
"use strict";
var ScrollViewConfig = (function () {
    function ScrollViewConfig() {
        this._useCustomScrollbars = false;
    }
    // Enable native scrollbars for all instances.
    ScrollViewConfig.prototype.setUseCustomScrollbars = function (value) {
        this._useCustomScrollbars = value;
    };
    ScrollViewConfig.prototype.useCustomScrollbars = function () {
        return this._useCustomScrollbars;
    };
    return ScrollViewConfig;
}());
exports.ScrollViewConfig = ScrollViewConfig;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new ScrollViewConfig();
