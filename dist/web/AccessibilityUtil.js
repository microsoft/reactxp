/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of accessiblity functions for cross-platform
* ReactXP framework.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("./utils/lodashMini");
var AccessibilityUtil_1 = require("../common/AccessibilityUtil");
var Types = require("../common/Types");
// Map of accessibility trait to an aria role attribute.  
// What's a role attribute? https://www.w3.org/wiki/PF/XTech/HTML5/RoleAttribute
var roleMap = (_a = {},
    _a[Types.AccessibilityTrait.None] = 'presentation',
    _a[Types.AccessibilityTrait.Button] = 'button',
    _a[Types.AccessibilityTrait.Link] = 'link',
    _a[Types.AccessibilityTrait.Header] = 'heading',
    _a[Types.AccessibilityTrait.Search] = 'search',
    _a[Types.AccessibilityTrait.Image] = 'img',
    _a[Types.AccessibilityTrait.Summary] = 'region',
    _a[Types.AccessibilityTrait.Adjustable] = 'slider',
    _a[Types.AccessibilityTrait.Menu] = 'menu',
    _a[Types.AccessibilityTrait.MenuItem] = 'menuitem',
    _a[Types.AccessibilityTrait.MenuBar] = 'menubar',
    _a[Types.AccessibilityTrait.Tab] = 'tab',
    _a[Types.AccessibilityTrait.TabList] = 'tablist',
    _a[Types.AccessibilityTrait.List] = 'list',
    _a[Types.AccessibilityTrait.ListItem] = 'listitem',
    _a[Types.AccessibilityTrait.ListBox] = 'listbox',
    _a[Types.AccessibilityTrait.Group] = 'group',
    _a[Types.AccessibilityTrait.CheckBox] = 'checkbox',
    _a[Types.AccessibilityTrait.ComboBox] = 'combobox',
    _a[Types.AccessibilityTrait.Log] = 'log',
    _a[Types.AccessibilityTrait.Status] = 'status',
    _a[Types.AccessibilityTrait.Dialog] = 'dialog',
    _a);
// Map of accesssibility live region to an aria-live property.
var liveRegionMap = (_b = {},
    _b[Types.AccessibilityLiveRegion.None] = 'off',
    _b[Types.AccessibilityLiveRegion.Assertive] = 'assertive',
    _b[Types.AccessibilityLiveRegion.Polite] = 'polite',
    _b);
var AccessibilityUtil = (function (_super) {
    __extends(AccessibilityUtil, _super);
    function AccessibilityUtil() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Web equivalent value for aria-live property.
    AccessibilityUtil.prototype.accessibilityLiveRegionToString = function (liveRegion) {
        if (liveRegion) {
            return liveRegionMap[liveRegion];
        }
        return undefined;
    };
    // Web equivalent value for role property. 
    // NOTE: Web only supports a single aria-role on a component.
    AccessibilityUtil.prototype.accessibilityTraitToString = function (traits, defaultTrait) {
        // Combine & remove duplicate traits.
        var combinedTraits = defaultTrait ? [defaultTrait] : [];
        if (traits) {
            combinedTraits = _.union(combinedTraits, _.isArray(traits) ? traits : [traits]);
        }
        // Max enum value in this array of traits is role for web. Return corresponding
        // role string from roleMap.
        return combinedTraits.length > 0 ?
            roleMap[_.max(_.filter(combinedTraits, function (t) { return roleMap.hasOwnProperty(t); }))]
            : undefined;
    };
    AccessibilityUtil.prototype.accessibilityTraitToAriaSelected = function (traits) {
        // Walk through each trait and check if there's a selected trait. Return if one is found.
        if (traits && _.isArray(traits) && traits.indexOf(Types.AccessibilityTrait.Tab) !== -1) {
            return traits.indexOf(Types.AccessibilityTrait.Selected) !== -1 ? true : undefined;
        }
        // Here we are returning undefined if the above condtion is not met 
        // as we dont want to pollute the dom with "aria-selected = false" for every falsy condition
        return undefined;
    };
    return AccessibilityUtil;
}(AccessibilityUtil_1.AccessibilityUtil));
exports.AccessibilityUtil = AccessibilityUtil;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new AccessibilityUtil();
var _a, _b;
