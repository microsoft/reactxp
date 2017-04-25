/**
* iOSAccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* iOS-specific accessibility utils.
*/

import React = require('react');
import RN = require('react-native');

import Accessibility from '../native-common/Accessibility';
import { NativeHelpers } from '../native-common/AccessibilityUtil';

export class iOSAccessibilityUtil extends NativeHelpers {
    setAccessibilityFocus(component: React.Component<any, any>): void {
        // NO-OP
    }
}

export default new iOSAccessibilityUtil();
