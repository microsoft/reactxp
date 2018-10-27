/**
 * AccessibilityUtil.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Common accessibility interface for platform-specific accessibility utilities.
 */

import * as React from 'react';

import { Types } from '../common/Interfaces';

export type ImportantForAccessibilityValue = 'auto' | 'yes' | 'no' | 'no-hide-descendants';
export const ImportantForAccessibilityMap = {
    [Types.ImportantForAccessibility.Auto]: 'auto' as ImportantForAccessibilityValue,
    [Types.ImportantForAccessibility.Yes]: 'yes' as ImportantForAccessibilityValue,
    [Types.ImportantForAccessibility.No]: 'no' as ImportantForAccessibilityValue,
    [Types.ImportantForAccessibility.NoHideDescendants]: 'no-hide-descendants' as ImportantForAccessibilityValue
};

// Platform specific helpers exposed through Native-Common AccessibilityUtil.
export abstract class AccessibilityPlatformUtil {
    abstract setAccessibilityFocus(component: React.Component<any, any>): void;
}

export abstract class AccessibilityUtil {
    isHidden(importantForAccessibility: Types.ImportantForAccessibility | undefined): true | undefined {
        // aria-hidden is false by default, returning true or undefined, so that it doesn't pollute the DOM.
        if (importantForAccessibility) {
            const importantForAccessibilityString = this.importantForAccessibilityToString(importantForAccessibility);
            if (importantForAccessibilityString === ImportantForAccessibilityMap[Types.ImportantForAccessibility.NoHideDescendants]) {
                return true;
            }
        }
        return undefined;
    }

    importantForAccessibilityToString(importantForAccessibility: Types.ImportantForAccessibility | undefined,
        defaultImportantForAccessibility?: Types.ImportantForAccessibility): ImportantForAccessibilityValue | undefined {
        importantForAccessibility = importantForAccessibility || defaultImportantForAccessibility;

        if (importantForAccessibility && ImportantForAccessibilityMap[importantForAccessibility]) {
            return ImportantForAccessibilityMap[importantForAccessibility];
        }
        return undefined;
    }

    protected abstract accessibilityLiveRegionToString(liveRegion: Types.AccessibilityLiveRegion): string | undefined;
    protected abstract accessibilityTraitToString(trait: Types.AccessibilityTrait | Types.AccessibilityTrait[],
        defaultTrait?: Types.AccessibilityTrait): string | string[] | undefined;
}
