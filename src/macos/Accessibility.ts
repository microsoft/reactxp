/**
 * Accessibility.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * MacOS variant of Accessibility that performs announcements by calling
 * React Native announcement API.
 */

import * as RN from 'react-native';

import { Accessibility as NativeAccessibility } from '../native-common/Accessibility';

interface AnnouncementFinishedPayload {
    announcement: string;
    success: boolean;
}

const RetryTimeout = 3000; // 3 seconds

export class Accessibility extends NativeAccessibility {
    // Queue of pending announcements.
    private _announcementQueue: string[] = [];
    private _retryTimestamp = NaN;

    constructor() {
        super();

        // Some versions of RN don't support this interface.
        if (RN.AccessibilityInfo) {
            // Subscribe to an event to get notified when an announcement will finish.
            RN.AccessibilityInfo.addEventListener('announcementFinished', this._recalcAnnouncement);
            // Subscribe to clear queue depending on app state
            RN.AppState.addEventListener('change', this._trackQueueStatus);
        }
    }

    protected _updateScreenReaderStatus(isEnabled: boolean) {
        super._updateScreenReaderStatus(isEnabled);
        // Empty announcement queue when screen reader is disabled.
        if (!isEnabled && this._announcementQueue.length > 0) {
            this._announcementQueue = [];
        }
    }

    announceForAccessibility(announcement: string): void {
        super.announceForAccessibility(announcement);

        // Update the queue only if screen reader is enabled. Else we won't receive a callback of
        // announcement did finish and queued items will never be removed.
        if (this._isScreenReaderEnabled) {
            this._announcementQueue.push(announcement);
            // Post announcement if it's the only announcement in queue.
            if (this._announcementQueue.length === 1) {
                this._postAnnouncement(announcement);
            }
        }
    }

    private _trackQueueStatus = (newState: string) => {
        if (this._isScreenReaderEnabled && ['background', 'inactive'].indexOf(newState) >= 0) {
            this._announcementQueue = [];
            this._retryTimestamp = NaN;
        }
    }

    private _postAnnouncement(announcement: string, resetTimestamp = true): void {
        if (resetTimestamp) {
            this._retryTimestamp = Date.now();
        }

        // Some versions of RN don't support this interface.
        if (RN.AccessibilityInfo && RN.AccessibilityInfo.announceForAccessibility) {
            RN.AccessibilityInfo.announceForAccessibility(announcement);
        }
    }

    private _recalcAnnouncement = (payload: AnnouncementFinishedPayload) => {
        if (this._announcementQueue.length === 0) {
            return;
        }

        const postedAnnouncement = this._announcementQueue[0];
        // Handle retries if it's the announcement we posted. Drop other announcements.
        if (payload.announcement === postedAnnouncement) {
            const timeElapsed = Date.now() - this._retryTimestamp;

            if (!payload.success && timeElapsed < RetryTimeout) {
                this._postAnnouncement(payload.announcement, false);
            } else {
                // Successfully announced or timed out. Schedule next announcement.
                this._announcementQueue.shift();
                if (this._announcementQueue.length > 0) {
                    const nextAnnouncement = this._announcementQueue[0];
                    this._postAnnouncement(nextAnnouncement);
                }
            }
        }
    }
}

export default new Accessibility();
