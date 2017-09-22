/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of accessiblity functions for cross-platform
* ReactXP framework.
*/

import _ = require('./utils/lodashMini');

import { AccessibilityUtil as CommonAccessibiltiyUtil } from '../common/AccessibilityUtil';
import Types = require('../common/Types');

// Map of accessibility trait to an aria role attribute.  
// What's a role attribute? https://www.w3.org/wiki/PF/XTech/HTML5/RoleAttribute
const roleMap = {
    [Types.AccessibilityTrait.None]: 'presentation',
    [Types.AccessibilityTrait.Button]: 'button',
    [Types.AccessibilityTrait.Link]: 'link',
    [Types.AccessibilityTrait.Header]: 'heading',
    [Types.AccessibilityTrait.Search]: 'search',
    [Types.AccessibilityTrait.Image]: 'img',
    [Types.AccessibilityTrait.Summary]: 'region',
    [Types.AccessibilityTrait.Adjustable]: 'slider',
    [Types.AccessibilityTrait.Menu]: 'menu',
    [Types.AccessibilityTrait.MenuItem]: 'menuitem',
    [Types.AccessibilityTrait.MenuBar]: 'menubar',
    [Types.AccessibilityTrait.Tab]: 'tab',
    [Types.AccessibilityTrait.TabList]: 'tablist',
    [Types.AccessibilityTrait.List]: 'list',
    [Types.AccessibilityTrait.ListItem]: 'listitem',
    [Types.AccessibilityTrait.ListBox]: 'listbox',
    [Types.AccessibilityTrait.Group]: 'group',
    [Types.AccessibilityTrait.CheckBox]: 'checkbox',
    [Types.AccessibilityTrait.ComboBox]: 'combobox',
    [Types.AccessibilityTrait.Log]: 'log',
    [Types.AccessibilityTrait.Status]: 'status',
    [Types.AccessibilityTrait.Dialog]: 'dialog'
}; 

// Map of accesssibility live region to an aria-live property.
const liveRegionMap = {
    [Types.AccessibilityLiveRegion.None]: 'off',
    [Types.AccessibilityLiveRegion.Assertive]: 'assertive',
    [Types.AccessibilityLiveRegion.Polite]: 'polite'
};

export class AccessibilityUtil extends CommonAccessibiltiyUtil {
    // Web equivalent value for aria-live property.
    accessibilityLiveRegionToString(liveRegion: Types.AccessibilityLiveRegion): string {
        if (liveRegion) {
            return liveRegionMap[liveRegion];
        }
        return undefined;
    }

    // Web equivalent value for role property. 
    // NOTE: Web only supports a single aria-role on a component.
    accessibilityTraitToString(traits: Types.AccessibilityTrait | Types.AccessibilityTrait[], 
        defaultTrait?: Types.AccessibilityTrait): string {
        // Combine & remove duplicate traits.
        let combinedTraits: Types.AccessibilityTrait[] = defaultTrait ? [defaultTrait] : [];

        if (traits) {
            combinedTraits = _.union(combinedTraits, _.isArray(traits) ? traits : [traits]);
        }

        // Max enum value in this array of traits is role for web. Return corresponding
        // role string from roleMap.
        return combinedTraits.length > 0 ? 
            roleMap[_.max(_.filter(combinedTraits, t => roleMap.hasOwnProperty(t as any)))] 
            : undefined;
    }

    accessibilityTraitToAriaSelected(traits: Types.AccessibilityTrait | Types.AccessibilityTrait[]) {
        // Walk through each trait and check if there's a selected trait. Return if one is found.
        if (traits && _.isArray(traits) && traits.indexOf(Types.AccessibilityTrait.Tab) !== -1) {
            return traits.indexOf(Types.AccessibilityTrait.Selected) !== -1;
        }
        
        // Here we are returning undefined if the above condition is not met
        // as we dont want to pollute the dom with "aria-selected = false" for every falsy condition
        return undefined;
    }

    accessibilityTraitToAriaChecked(traits: Types.AccessibilityTrait | Types.AccessibilityTrait[] | undefined) {
        // Walk through each trait and check if there's a checked trait. Return if one is found.
        if (traits && _.isArray(traits) && traits.indexOf(Types.AccessibilityTrait.CheckBox) !== -1) {
            return traits.indexOf(Types.AccessibilityTrait.Checked) !== -1;
        }

        // Here we are returning undefined if the above condition is not met
        // as we dont want to pollute the dom with "aria-checked = false" for every falsy condition
        return undefined;
    }

    accessibilityTraitToAriaHasPopup(traits: Types.AccessibilityTrait | Types.AccessibilityTrait[] | undefined) {
        // Walk through each trait and check if there's a hasPopup trait. Return if one is found.
        if (traits && _.isArray(traits) && traits.indexOf(Types.AccessibilityTrait.HasPopup) !== -1) {
            return traits.indexOf(Types.AccessibilityTrait.HasPopup) !== -1;
        }

        // Here we are returning undefined if the above condition is not met
        // as we dont want to pollute the dom with "aria-checked = false" for every falsy condition
        return undefined;
    }
}

export default new AccessibilityUtil();
