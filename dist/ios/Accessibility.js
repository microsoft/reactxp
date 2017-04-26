/**
* Accessibility.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* An iOS variant of Accessibility that performs announcements by calling
* React Native announcement API for iOS.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RN = require("react-native");
var Accessibility_1 = require("../native-common/Accessibility");
var RetryTimeout = 3000; // 3 seconds
var Accessibility = (function (_super) {
    __extends(Accessibility, _super);
    function Accessibility() {
        var _this = _super.call(this) || this;
        // Queue of pending announcements. 
        _this._announcementQueue = [];
        _this._recalcAnnouncement = function (payload) {
            if (_this._announcementQueue.length === 0) {
                return;
            }
            var postedAnnouncement = _this._announcementQueue[0];
            // Handle retries if it's the announcement we posted. Drop other announcements.
            if (payload.announcement === postedAnnouncement) {
                var timeElapsed = Date.now() - _this._retryTimestamp;
                if (!payload.success && timeElapsed < RetryTimeout) {
                    _this._postAnnouncement(payload.announcement, false);
                }
                else {
                    // Successfully announced or timed out. Schedule next announcement. 
                    _this._announcementQueue.shift();
                    if (_this._announcementQueue.length > 0) {
                        var nextAnnouncement = _this._announcementQueue[0];
                        _this._postAnnouncement(nextAnnouncement);
                    }
                }
            }
        };
        // Some versions of RN don't support this interface.
        if (RN.AccessibilityInfo) {
            // Subscribe to an event to get notified when an announcement will finish.  
            RN.AccessibilityInfo.addEventListener('announcementFinished', _this._recalcAnnouncement);
        }
        return _this;
    }
    Accessibility.prototype._updateScreenReaderStatus = function (isEnabled) {
        _super.prototype._updateScreenReaderStatus.call(this, isEnabled);
        // Empty announcement queue when screen reader is disabled. 
        if (!isEnabled && this._announcementQueue.length > 0) {
            this._announcementQueue = [];
        }
    };
    Accessibility.prototype.announceForAccessibility = function (announcement) {
        _super.prototype.announceForAccessibility.call(this, announcement);
        // Update the queue only if screen reader is enabled. Else we won't receive a callback of
        // announcement did finish and queued items will never be removed. 
        if (this._isScreenReaderEnabled) {
            this._announcementQueue.push(announcement);
            // Post announcement if it's the only announcement in queue. 
            if (this._announcementQueue.length === 1) {
                this._postAnnouncement(announcement);
            }
        }
    };
    Accessibility.prototype._postAnnouncement = function (announcement, resetTimestamp) {
        if (resetTimestamp === void 0) { resetTimestamp = true; }
        if (resetTimestamp) {
            this._retryTimestamp = Date.now();
        }
        // Some versions of RN don't support this interface.
        if (RN.AccessibilityInfo) {
            RN.AccessibilityInfo.announceForAccessibility(announcement);
        }
    };
    return Accessibility;
}(Accessibility_1.Accessibility));
exports.Accessibility = Accessibility;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Accessibility();
