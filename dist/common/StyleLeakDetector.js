/**
* StyleLeakDetector.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Detects style memory-leaks in react-native.
* To fix warning you could:
*  - use not cached styles by providing cacheStyle == falst to Style.create... method
*  - for colors you could use StylesRegestry component
*  - for rx component you could temporary disable validation by calling pause method and restore by calling resume,
*    but please make sure that it doesn't leaks first please
*/
"use strict";
var _ = require("./lodashMini");
var AppConfig_1 = require("./AppConfig");
var StyleLeakDetector = (function () {
    function StyleLeakDetector() {
        this._fingerprintRegistry = {};
    }
    StyleLeakDetector.prototype._getFingerprint = function (object) {
        return JSON.stringify(this._sortAny(object));
    };
    /**
     * We need to sort objects before using JSON.stringify as otherwise objects
     * {a: 1, b: 2} and {b: 2, a: 1} would have a different fingerprints
     */
    StyleLeakDetector.prototype._sortAny = function (object) {
        if (object instanceof Array) {
            return this._sortArray(object);
        }
        else if (object instanceof Object) {
            return this._sortObject(object);
        }
        else {
            return object;
        }
    };
    StyleLeakDetector.prototype._sortObject = function (object) {
        var result = {};
        var keys = [];
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        keys = _.sortBy(keys);
        var keysLength = keys.length;
        for (var i = 0; i < keysLength; i++) {
            var key = keys[i];
            var value = object[key];
            result[key] = this._sortAny(value);
        }
        return result;
    };
    StyleLeakDetector.prototype._sortArray = function (object) {
        var length = object.length;
        for (var i = 0; i < length; i++) {
            object[i] = this._sortAny(object[i]);
        }
        return object;
    };
    StyleLeakDetector.prototype.isDisabled = function () {
        return false;
    };
    StyleLeakDetector.prototype.detectLeaks = function (style) {
        if (AppConfig_1.default.isDevelopmentMode() && !this.isDisabled()) {
            var error = new Error();
            // we detect leaks on chrome and firefox only, other browser have now this member
            var stack = error.stack;
            if (stack) {
                var styleAllocationId = stack + this._getFingerprint(style);
                var firstAllocation = this._fingerprintRegistry[styleAllocationId];
                if (firstAllocation) {
                    console.warn('Possible style leak of: ', style, 'first allocation: ', firstAllocation);
                }
                else {
                    this._fingerprintRegistry[styleAllocationId] = stack;
                }
            }
        }
    };
    return StyleLeakDetector;
}());
exports.StyleLeakDetector = StyleLeakDetector;
var instance = new StyleLeakDetector();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = instance;
