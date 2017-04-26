/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common accessibility interface for platform-specific accessibility utilities.
*/
import Types = require('../common/Types');
export declare const ImportantForAccessibilityMap: {
    [x: number]: string;
};
export declare abstract class AccessibilityUtil {
    isHidden(importantForAccessibility: Types.ImportantForAccessibility): boolean;
    importantForAccessibilityToString(importantForAccessibility: Types.ImportantForAccessibility, defaultImportantForAccessibility?: Types.ImportantForAccessibility): string;
    protected abstract accessibilityLiveRegionToString(liveRegion: Types.AccessibilityLiveRegion): string;
    protected abstract accessibilityTraitToString(trait: Types.AccessibilityTrait | Types.AccessibilityTrait[], defaultTrait?: Types.AccessibilityTrait): string | string[];
}
