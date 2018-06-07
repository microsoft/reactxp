/**
* Accessibility.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*/

import RN = require('react-native');
import { Accessibility as NativeAccessibility, default as parentInstance } from '../native-common/Accessibility';

export class Accessibility extends NativeAccessibility {
    private _isHighContrast = RN.AccessibilityInfo.initialHighContrast || false;
    private _lastAnnouncement: string | undefined;
    private _announcementQueue: string[] = [];
    private _announcementQueueTimer: number | undefined;

    constructor() {
        super();

        RN.AccessibilityInfo.addEventListener('highContrastDidChange', isEnabled => {
            this._updateIsHighContrast(isEnabled);
        });
    }

    private _updateIsHighContrast(isEnabled: boolean) {
        if (this._isHighContrast !== isEnabled) {
            this._isHighContrast = isEnabled;
            this.highContrastChangedEvent.fire(isEnabled);
        }
    }

    isHighContrastEnabled(): boolean {
        return this._isHighContrast;
    }

    announceForAccessibility(announcement: string): void {
        // This hack was copied from android/Accessibility.ts in order to not increase variety of hacks for same problem in codebase.
        //
        // Screen reader fails to announce, if the new announcement is the same as the last one.
        // The reason is probably that in RootView, the announcement text is held in state and passed as a prop to RN.View.
        // If the announcement is the same, the props don't change and RN doesn't see a reason to re-render
        // the view - retrigger the announcement. This behaviour is actually expected. We work around this by checking
        // the new announcement text and comparing it with the last one. If they are the same, append a space at the end.
        if (announcement === this._lastAnnouncement) {
            announcement += ' ';
        }
        this._lastAnnouncement = announcement;

        this._announcementQueue.push(announcement);
        if (this._announcementQueueTimer === undefined) {
            this._dequeueAndPostAnnouncement();
        }
    }

    private _callSuperAnnounceForAccessibility(announcement: string): void {
        // We cannot just call super.announceForAccessibility here, because RootView subscribes on this
        // parent class singleton instance. Calling Accessibility.announceForAccessibility from the consumer app
        // will then create a different event and the announcements won't work. Instead, we just call the
        // instance method directly.
        //
        // This dirty hack was copied from android/Accessibility.ts but it's temporary.
        // TODO: Decide on which pattern to use for "extending"/"inheriting" classes while not
        // having problem with duplicate state like here. And then replace this dirty hack (and all the other 
        // bugs in existing code - this class and others) with proper pattern.
        parentInstance.announceForAccessibility(announcement);
    }

    // Has to be arrow function to capture 'this' since it's passed as callback.
    private _dequeueAndPostAnnouncement = () => {
        const announcement = this._announcementQueue.shift();
        if (announcement !== undefined) {
            this._callSuperAnnounceForAccessibility(announcement);
            // 2 seconds is probably enough for screen reader to finally receive UIA live region event
            // and go query the accessible name of the region to put into its own queue, so that we can
            // set name of the region to next announcement and fire the UIA live region event again.
            this._announcementQueueTimer = setTimeout(this._dequeueAndPostAnnouncement, 2000);
        } else {
            // We want to clear the announcement by announcing empty string.
            // This is due to implementation detail of UWP announcement implementation
            // where we use a hidden text to fire UIA live region events on it. To make this
            // text not visible to screen reader we want to clear it as soon as possible.
            this._callSuperAnnounceForAccessibility('');
            this._announcementQueueTimer = undefined;
        }
    }
}

export default new Accessibility();
