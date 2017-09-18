/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common accessibility interface for platform-specific accessibility utilities.
*/

import React = require('react');

import Types = require('../common/Types');

export const ImportantForAccessibilityMap = {
    [Types.ImportantForAccessibility.Auto]: 'auto',
    [Types.ImportantForAccessibility.Yes]: 'yes',
    [Types.ImportantForAccessibility.No]: 'no',
    [Types.ImportantForAccessibility.NoHideDescendants]: 'no-hide-descendants'
};

// Platform specific helpers exposed through Native-Common AccessibilityUtil. 
export abstract class AccessibilityPlatformUtil {
    abstract setAccessibilityFocus(component: React.Component<any, any>): void;
}

export abstract class AccessibilityUtil {
    isHidden(importantForAccessibility: Types.ImportantForAccessibility|undefined): boolean {
        if (importantForAccessibility) {
            const importantForAccessibilityString = this.importantForAccessibilityToString(importantForAccessibility);
            return importantForAccessibilityString === ImportantForAccessibilityMap[Types.ImportantForAccessibility.NoHideDescendants];
        }
        return false;
    }

    importantForAccessibilityToString(importantForAccessibility: Types.ImportantForAccessibility|undefined, 
        defaultImportantForAccessibility?: Types.ImportantForAccessibility): string|undefined {
        importantForAccessibility = importantForAccessibility || defaultImportantForAccessibility; 
        
        if (importantForAccessibility && ImportantForAccessibilityMap[importantForAccessibility]) {
            return ImportantForAccessibilityMap[importantForAccessibility];
        }
        return undefined;
    }

    protected abstract accessibilityLiveRegionToString(liveRegion: Types.AccessibilityLiveRegion): string|undefined;
    protected abstract accessibilityTraitToString(trait: Types.AccessibilityTrait | Types.AccessibilityTrait[], 
        defaultTrait?: Types.AccessibilityTrait): string | string[] | undefined; 
}
