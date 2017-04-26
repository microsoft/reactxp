/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common accessibility interface for platform-specific accessibility utilities.
*/
"use strict";
var Types = require("../common/Types");
exports.ImportantForAccessibilityMap = (_a = {},
    _a[Types.ImportantForAccessibility.Auto] = 'auto',
    _a[Types.ImportantForAccessibility.Yes] = 'yes',
    _a[Types.ImportantForAccessibility.No] = 'no',
    _a[Types.ImportantForAccessibility.NoHideDescendants] = 'no-hide-descendants',
    _a);
var AccessibilityUtil = (function () {
    function AccessibilityUtil() {
    }
    AccessibilityUtil.prototype.isHidden = function (importantForAccessibility) {
        if (importantForAccessibility) {
            var importantForAccessibilityString = this.importantForAccessibilityToString(importantForAccessibility);
            return importantForAccessibilityString === exports.ImportantForAccessibilityMap[Types.ImportantForAccessibility.NoHideDescendants];
        }
        return undefined;
    };
    AccessibilityUtil.prototype.importantForAccessibilityToString = function (importantForAccessibility, defaultImportantForAccessibility) {
        importantForAccessibility = importantForAccessibility || defaultImportantForAccessibility;
        if (exports.ImportantForAccessibilityMap[importantForAccessibility]) {
            return exports.ImportantForAccessibilityMap[importantForAccessibility];
        }
        return undefined;
    };
    return AccessibilityUtil;
}());
exports.AccessibilityUtil = AccessibilityUtil;
var _a;
