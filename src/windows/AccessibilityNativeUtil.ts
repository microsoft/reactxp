/**
* AccessibilityNativeUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific accessibility utils.
*/

import React = require('react');

import { AccessibilityNativeUtil as CommonAccessibilityNativeUtil } from '../common/AccessibilityUtil';

export class AccessibilityNativeUtil extends CommonAccessibilityNativeUtil {
    setAccessibilityFocus(component: React.Component<any, any>) {
        // No-Op
    }
}

export default new AccessibilityNativeUtil();
