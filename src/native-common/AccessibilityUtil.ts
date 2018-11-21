/**
 * AccessibilityUtil.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of accessiblity functions for cross-platform
 * ReactXP framework.
 */

import * as React from 'react';
import * as RN from 'react-native';

import {
    AccessibilityPlatformUtil,
    AccessibilityUtil as CommonAccessibilityUtil
} from '../common/AccessibilityUtil';
import { Types } from '../common/Interfaces';
import * as _ from './utils/lodashMini';

export { ImportantForAccessibilityValue } from '../common/AccessibilityUtil';

type AccessibilityLiveRegionValue = 'none' | 'polite' | 'assertive';

const liveRegionMap: { [key: string]: AccessibilityLiveRegionValue } = {
    [Types.AccessibilityLiveRegion.None]: 'none',
    [Types.AccessibilityLiveRegion.Assertive]: 'assertive',
    [Types.AccessibilityLiveRegion.Polite]: 'polite'
};

// iOS supported map.
const traitsMap: { [key: string]: string } = {
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
    [Types.AccessibilityTrait.PageTurn]: 'pageTurn',
    [Types.AccessibilityTrait.ListItem]: 'listItem'
};

type AccessibilityComponentTypeValue = 'none' | 'button' | 'radiobutton_checked' | 'radiobutton_unchecked';

// Android supported map.
const componentTypeMap: { [key: string]: AccessibilityComponentTypeValue } = {
    [Types.AccessibilityTrait.None]: 'none',
    [Types.AccessibilityTrait.Tab]: 'none', // NOTE: Tab component type isn't supported on Android. Setting it to none, allows us to give
                                            // it a custom label. This needs to be done for any custom role, which needs to be supported
                                            // on Android.
    [Types.AccessibilityTrait.Button]: 'button',
    [Types.AccessibilityTrait.Radio_button_checked]: 'radiobutton_checked',
    [Types.AccessibilityTrait.Radio_button_unchecked]: 'radiobutton_unchecked'
};

export class AccessibilityUtil extends CommonAccessibilityUtil {
    // Handle to accessibility platform helper instance that gets initialized during ReactXP initialization using the setter.
    private _instance!: AccessibilityPlatformUtil;

    setAccessibilityPlatformUtil(instance: AccessibilityPlatformUtil) {
        this._instance = instance;
    }

    // Converts an AccessibilityTrait to a string, but the returned value is only needed for iOS and UWP. Other platforms ignore it.
    // Presence of an AccessibilityTrait.None can make an element non-accessible on Android.
    // We use the override traits if they are present, else use the default trait.
    // If ensureDefaultTrait is true, ensure the return result contains the defaultTrait.
    accessibilityTraitToString(overrideTraits: Types.AccessibilityTrait | Types.AccessibilityTrait[] | undefined,
        defaultTrait?: Types.AccessibilityTrait, ensureDefaultTrait?: boolean): RN.AccessibilityTrait[] | undefined {
        // Check if there are valid override traits. Use them or else fallback to default traits.
        if (!overrideTraits && !defaultTrait) {
            return undefined;
        }

        let traits : (Types.AccessibilityTrait | undefined)[];
        if (defaultTrait && ensureDefaultTrait) {
            if (Array.isArray(overrideTraits)) {
                traits = overrideTraits.indexOf(defaultTrait) === -1 ? overrideTraits.concat([defaultTrait]) : overrideTraits;
            } else {
                traits = overrideTraits === defaultTrait ? [overrideTraits] : [overrideTraits, defaultTrait];
            }
        } else {
            traits = Array.isArray(overrideTraits) ? overrideTraits : [overrideTraits || defaultTrait];
        }
        return _.compact(_.map(traits, t  => t ? traitsMap[t] : undefined)) as RN.AccessibilityTrait[];
    }

    // Converts an AccessibilityTrait to an accessibilityComponentType string, but the returned value is only needed for Android. Other
    // platforms ignore it.
    accessibilityComponentTypeToString(overrideTraits: Types.AccessibilityTrait | Types.AccessibilityTrait[] | undefined,
        defaultTrait?: Types.AccessibilityTrait): AccessibilityComponentTypeValue | undefined {
        // Check if there are valid override traits. Use them or else fallback to default traits.
        // Max enum value in this array is the componentType for android.
        if (!overrideTraits && !defaultTrait) {
            return undefined;
        }

        const combinedTraits = Array.isArray(overrideTraits) ? overrideTraits : [overrideTraits || defaultTrait];
        const maxTrait = _.max(_.filter(combinedTraits, t => componentTypeMap.hasOwnProperty(t as any)));
        return maxTrait ? componentTypeMap[maxTrait] : undefined;
    }

    // Converts an AccessibilityLiveRegion to a string, but the return value is only needed for Android. Other platforms ignore it.
    accessibilityLiveRegionToString(liveRegion: Types.AccessibilityLiveRegion | undefined): AccessibilityLiveRegionValue | undefined {
        if (liveRegion && liveRegionMap[liveRegion]) {
            return liveRegionMap[liveRegion];
        }
        return undefined;
    }

    // Platform specific accessibility APIs.
    setAccessibilityFocus(component: React.Component<any, any>): void {
        this._instance.setAccessibilityFocus(component);
    }
}

export default new AccessibilityUtil();
