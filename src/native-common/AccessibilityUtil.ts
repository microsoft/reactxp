/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of accessiblity functions for cross-platform
* ReactXP framework.
*/

import _ = require('./lodashMini');

import { AccessibilityUtil as CommonAccessibilityUtil } from '../common/AccessibilityUtil';
import Types = require('../common/Types');

const liveRegionMap = {
    [Types.AccessibilityLiveRegion.None]: 'none',
    [Types.AccessibilityLiveRegion.Assertive]: 'assertive',
    [Types.AccessibilityLiveRegion.Polite]: 'polite'
};

// iOS supported map.
const traitsMap = {
    [Types.AccessibilityTrait.None]: 'none',
    [Types.AccessibilityTrait.Tab]: 'none', // NOTE: Tab trait isn't supported on iOS. Setting it to none, allows us to give it a custom
                                            // label. This needs to be done for any custom role, which needs to be supported on iOS.
    [Types.AccessibilityTrait.Button]: 'button',
    [Types.AccessibilityTrait.Link]: 'link',
    [Types.AccessibilityTrait.Header]: 'header',
    [Types.AccessibilityTrait.Search]: 'search',
    [Types.AccessibilityTrait.Image]: 'image',
    [Types.AccessibilityTrait.Summary]: 'summary',
    [Types.AccessibilityTrait.Adjustable]: 'adjustable',
    [Types.AccessibilityTrait.Selected]: 'selected',
    [Types.AccessibilityTrait.Plays]: 'plays',
    [Types.AccessibilityTrait.Key]: 'key',
    [Types.AccessibilityTrait.Text]: 'text',
    [Types.AccessibilityTrait.Disabled]: 'disabled',
    [Types.AccessibilityTrait.FrequentUpdates]: 'frequentUpdates',
    [Types.AccessibilityTrait.StartsMedia]: 'startsMedia',
    [Types.AccessibilityTrait.AllowsDirectInteraction]: 'allowsDirectionInteraction',
    [Types.AccessibilityTrait.PageTurn]: 'pageTurn'
};

// Android supported map.
const componentTypeMap = {
    [Types.AccessibilityTrait.None]: 'none',
    [Types.AccessibilityTrait.Tab]: 'none', // NOTE: Tab component type isn't supported on Android. Setting it to none, allows us to give
                                            // it a custom label. This needs to be done for any custom role, which needs to be supported
                                            // on Android.
    [Types.AccessibilityTrait.Button]: 'button',
    [Types.AccessibilityTrait.Radio_button_checked]: 'radiobutton_checked',
    [Types.AccessibilityTrait.Radio_button_unchecked]: 'radiobutton_unchecked'
};

export class AccessibilityUtil extends CommonAccessibilityUtil {
    // Converts an AccessibilityTrait to a string, but the returned value is only needed for iOS. Other platforms ignore it. Presence
    // of an AccessibilityTrait.None can make an element non-accessible on Android. We use the override traits if they are present, else
    // use the deafult trait.
    accessibilityTraitToString(overrideTraits: Types.AccessibilityTrait | Types.AccessibilityTrait[],
        defaultTrait?: Types.AccessibilityTrait): string[] {
        // Check if there are valid override traits. Use them or else fallback to default traits.
        if (!overrideTraits && !defaultTrait) {
            return [];
        }

        const traits = _.isArray(overrideTraits) ? overrideTraits : [overrideTraits || defaultTrait];
        return _.compact(_.map(traits, t  => traitsMap[t]));
    }

    // Converts an AccessibilityTrait to an accessibilityComponentType string, but the returned value is only needed for Android. Other
    // platforms ignore it.
    accessibilityComponentTypeToString(overrideTraits: Types.AccessibilityTrait | Types.AccessibilityTrait[],
        defaultTrait?: Types.AccessibilityTrait): string {
        // Check if there are valid override traits. Use them or else fallback to default traits.
        // Max enum value in this array is the componentType for android.
        if (!overrideTraits && !defaultTrait) {
            return undefined;
        }

        const combinedTraits = _.isArray(overrideTraits) ? overrideTraits : [overrideTraits || defaultTrait];
        return componentTypeMap[_.max(_.filter(combinedTraits, t => componentTypeMap.hasOwnProperty(t as any)))];
    }

    // Converts an AccessibilityLiveRegion to a string, but the return value is only needed for Android. Other platforms ignore it.
    accessibilityLiveRegionToString(liveRegion: Types.AccessibilityLiveRegion): string {
        if (liveRegionMap[liveRegion]) {
            return liveRegionMap[liveRegion];
        }
        return undefined;
    }
}

export default new AccessibilityUtil();
