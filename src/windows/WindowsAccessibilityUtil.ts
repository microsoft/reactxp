/**
* WindowsAccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific accessibility utils.
*/

import React = require('react');

import { PlatformAccessibilityHelpers } from '../common/AccessibilityUtil';

export class WindowsAccessibilityUtil extends PlatformAccessibilityHelpers {
    setAccessibilityFocus(component: React.Component<any, any>) {
        // No-Op
    }
}

export default new WindowsAccessibilityUtil();
