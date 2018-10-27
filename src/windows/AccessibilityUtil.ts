/**
 * AccessibilityUtil.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Windows-specific accessibility utils.
 */

import * as React from 'react';

import { AccessibilityPlatformUtil } from '../common/AccessibilityUtil';

export class AccessibilityUtil extends AccessibilityPlatformUtil {
    setAccessibilityFocus(component: React.Component<any, any>) {
        // No-Op
    }
}

export default new AccessibilityUtil();
