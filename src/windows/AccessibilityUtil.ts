/**
* WindowsAccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Windows-specific accessibility utils.
*/

import React = require('react');

import { NativeHelpers } from '../native-common/AccessibilityUtil';

export class WindowsAccessibilityUtil extends NativeHelpers {
    setAccessibilityFocus(component: React.Component<any, any>) {
        // No-Op
    }
}

export default new WindowsAccessibilityUtil();
