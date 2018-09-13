/**
 * Accessibility.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Common wrapper for accessibility helper exposed from ReactXP.
 */

import { Accessibility as NativeAccessibility, default as parentInstance } from '../native-common/Accessibility';

export class Accessibility extends NativeAccessibility {
    private _lastAnnouncement: string | undefined;

    // On Android, talkback fails to announce, if the new announcement is the same as the last one.
    // The reason is probably that in RootView, the announcement text is held in state and passed as a prop to RN.View.
    // If the announcement is the same, the props don't change and RN doesn't see a reason to re-render
    // the view - retrigger the announcement. This behaviour is actually expected. We work around this by checking
    // the new announcement text and comparing it with the last one. If they are the same, append a space at the end.
    announceForAccessibility(announcement: string): void {
        if (announcement === this._lastAnnouncement) {
            announcement += ' ';
        }
        this._lastAnnouncement = announcement;

        // We cannot just call super.announceForAccessibility here, because RootView subscribes on this
        // parent class singleton instance. Calling Accessibility.announceForAccessibility from the consumer app
        // will then create a different event and the announcements won't work. Instead, we just call the
        // instance method directly.
        parentInstance.announceForAccessibility(announcement);
    }
}

export default new Accessibility();
