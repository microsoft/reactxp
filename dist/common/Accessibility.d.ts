/**
* Accessibility.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Common wrapper for accessibility helper exposed from ReactXP.
*/
import SubscribableEvent = require('../common/SubscribableEvent');
import RX = require('../common/Interfaces');
export declare abstract class Accessibility extends RX.Accessibility {
    abstract isScreenReaderEnabled(): boolean;
    newAnnouncementReadyEvent: SubscribableEvent.SubscribableEvent<(announcement: string) => void>;
    announceForAccessibility(announcement: string): void;
}
export default Accessibility;
