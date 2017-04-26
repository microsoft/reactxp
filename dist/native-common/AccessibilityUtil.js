/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of accessiblity functions for cross-platform
* ReactXP framework.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("./lodashMini");
var AccessibilityUtil_1 = require("../common/AccessibilityUtil");
var Types = require("../common/Types");
var liveRegionMap = (_a = {},
    _a[Types.AccessibilityLiveRegion.None] = 'none',
    _a[Types.AccessibilityLiveRegion.Assertive] = 'assertive',
    _a[Types.AccessibilityLiveRegion.Polite] = 'polite',
    _a);
// iOS supported map.
var traitsMap = (_b = {},
    _b[Types.AccessibilityTrait.None] = 'none',
    _b[Types.AccessibilityTrait.Tab] = 'none',
    // label. This needs to be done for any custom role, which needs to be supported on iOS.
    _b[Types.AccessibilityTrait.Button] = 'button',
    _b[Types.AccessibilityTrait.Link] = 'link',
    _b[Types.AccessibilityTrait.Header] = 'header',
    _b[Types.AccessibilityTrait.Search] = 'search',
    _b[Types.AccessibilityTrait.Image] = 'image',
    _b[Types.AccessibilityTrait.Summary] = 'summary',
    _b[Types.AccessibilityTrait.Adjustable] = 'adjustable',
    _b[Types.AccessibilityTrait.Selected] = 'selected',
    _b[Types.AccessibilityTrait.Plays] = 'plays',
    _b[Types.AccessibilityTrait.Key] = 'key',
    _b[Types.AccessibilityTrait.Text] = 'text',
    _b[Types.AccessibilityTrait.Disabled] = 'disabled',
    _b[Types.AccessibilityTrait.FrequentUpdates] = 'frequentUpdates',
    _b[Types.AccessibilityTrait.StartsMedia] = 'startsMedia',
    _b[Types.AccessibilityTrait.AllowsDirectInteraction] = 'allowsDirectionInteraction',
    _b[Types.AccessibilityTrait.PageTurn] = 'pageTurn',
    _b);
// Android supported map.
var componentTypeMap = (_c = {},
    _c[Types.AccessibilityTrait.None] = 'none',
    _c[Types.AccessibilityTrait.Tab] = 'none',
    // it a custom label. This needs to be done for any custom role, which needs to be supported
    // on Android.
    _c[Types.AccessibilityTrait.Button] = 'button',
    _c[Types.AccessibilityTrait.Radio_button_checked] = 'radiobutton_checked',
    _c[Types.AccessibilityTrait.Radio_button_unchecked] = 'radiobutton_unchecked',
    _c);
var AccessibilityUtil = (function (_super) {
    __extends(AccessibilityUtil, _super);
    function AccessibilityUtil() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Converts an AccessibilityTrait to a string, but the returned value is only needed for iOS. Other platforms ignore it. Presence
    // of an AccessibilityTrait.None can make an element non-accessible on Android. We use the override traits if they are present, else
    // use the deafult trait.
    AccessibilityUtil.prototype.accessibilityTraitToString = function (overrideTraits, defaultTrait) {
        // Check if there are valid override traits. Use them or else fallback to default traits.
        if (!overrideTraits && !defaultTrait) {
            return [];
        }
        var traits = _.isArray(overrideTraits) ? overrideTraits : [overrideTraits || defaultTrait];
        return _.compact(_.map(traits, function (t) { return traitsMap[t]; }));
    };
    // Converts an AccessibilityTrait to an accessibilityComponentType string, but the returned value is only needed for Android. Other
    // platforms ignore it.
    AccessibilityUtil.prototype.accessibilityComponentTypeToString = function (overrideTraits, defaultTrait) {
        // Check if there are valid override traits. Use them or else fallback to default traits.
        // Max enum value in this array is the componentType for android.
        if (!overrideTraits && !defaultTrait) {
            return undefined;
        }
        var combinedTraits = _.isArray(overrideTraits) ? overrideTraits : [overrideTraits || defaultTrait];
        return componentTypeMap[_.max(_.filter(combinedTraits, function (t) { return componentTypeMap.hasOwnProperty(t); }))];
    };
    // Converts an AccessibilityLiveRegion to a string, but the return value is only needed for Android. Other platforms ignore it.
    AccessibilityUtil.prototype.accessibilityLiveRegionToString = function (liveRegion) {
        if (liveRegionMap[liveRegion]) {
            return liveRegionMap[liveRegion];
        }
        return undefined;
    };
    return AccessibilityUtil;
}(AccessibilityUtil_1.AccessibilityUtil));
exports.AccessibilityUtil = AccessibilityUtil;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new AccessibilityUtil();
var _a, _b, _c;
