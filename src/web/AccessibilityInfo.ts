/**
* AccessibilityInfo.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web wrapper for subscribing or querying the current state of the
* screen reader.
*/

import SyncTasks = require('synctasks');

import { AccessibilityInfo as CommonAccessibilityInfo } from '../common/AccessibilityInfo';
import RX = require('../common/Interfaces');

export class AccessibilityInfo extends CommonAccessibilityInfo {
    // Calling this API on web has no effect.
    isScreenReaderEnabled(): boolean {
        return false;
    }
}

export default new AccessibilityInfo();
