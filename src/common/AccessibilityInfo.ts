/**
* AccessibilityInfo.ts
* Copyright: Microsoft 2017
*
* Common wrapper for accessibility helper exposed from ReactXP.
*/

import RN = require('react-native');
import SyncTasks = require('synctasks');

import SubscribableEvent = require('../common/SubscribableEvent');
import RX = require('../common/Interfaces');

export abstract class AccessibilityInfo extends RX.AccessibilityInfo {
    abstract isScreenReaderEnabled(): boolean;

    newAnnouncementReadyEvent = new SubscribableEvent.SubscribableEvent<(announcement: string) => void>();
    announceForAccessibility(announcement: string): void {
       this.newAnnouncementReadyEvent.fire(announcement);
    }
}

export default AccessibilityInfo;
