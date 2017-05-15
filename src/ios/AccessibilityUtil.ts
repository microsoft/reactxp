/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* iOS-specific accessibility utils.
*/

import React = require('react');
import RN = require('react-native');

import Accessibility from '../native-common/Accessibility';
import { AccessibilityPlatformUtil } from '../common/AccessibilityUtil';

export class AccessibilityUtil extends AccessibilityPlatformUtil {
    setAccessibilityFocus(component: React.Component<any, any>): void {
        if (Accessibility.isScreenReaderEnabled() && RN.AccessibilityInfo && RN.AccessibilityInfo.setAccessibilityFocus) {
            RN.AccessibilityInfo.setAccessibilityFocus(RN.findNodeHandle(component));
        }
    }
}

export default new AccessibilityUtil();
