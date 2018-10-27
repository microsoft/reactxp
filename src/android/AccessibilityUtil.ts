/**
 * AccessibilityUtil.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Android-specific accessibility utils.
 */

import * as React from 'react';
import * as RN from 'react-native';

import Accessibility from '../native-common/Accessibility';
import { AccessibilityPlatformUtil as CommonAccessibilityNativeUtil } from '../common/AccessibilityUtil';

export class AccessibilityUtil extends CommonAccessibilityNativeUtil {
    private _sendAccessibilityEvent(component: React.Component<any, any>, eventId: number) {
        // See list of events here:
        // https://developer.android.com/reference/android/view/accessibility/AccessibilityEvent.html

        // For some reason, a small delay is required for the event to be properly processed.
        setTimeout(() => {
            let nodeHandle;

            // Component could be unmountend at the moment this function is executed and in
            // that case RN.findNodeHandle() will throw an exception.
            // We can't use just simple component.isMounted() checks as it's deprecated and
            // will throw red-screen in dev mode and I don't want to access _isMounted as
            // it's private prop.
            try {
                nodeHandle = RN.findNodeHandle(component);
            } catch (e) {
                // Intended noop, it's valid situation
            }

            if (nodeHandle) {
                RN.NativeModules.UIManager.sendAccessibilityEvent(nodeHandle, eventId);
            }
        }, 100);
    }

    setAccessibilityFocus(component: React.Component<any, any>) {
        const TYPE_VIEW_FOCUSED = 8;

        if (Accessibility.isScreenReaderEnabled()) {
            this._sendAccessibilityEvent(component, TYPE_VIEW_FOCUSED);
        }
    }
}

export default new AccessibilityUtil();
