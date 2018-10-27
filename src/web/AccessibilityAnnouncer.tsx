/**
 * AccessibilityAnnouncer.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Implements the behavior for announcing text to screen readers, using aria-live regions.
 */

import * as React from 'react';
import { SubscriptionToken } from 'subscribableevent';

import Accessibility from './Accessibility';
import AccessibilityUtil from './AccessibilityUtil';
import { Types } from '../common/Interfaces';
import Styles from './Styles';

export interface AccessibilityAnnouncerState {
    // Screen Reader text to be announced.
    announcementText: string;

    // Render announcementText in a nested div to work around browser quirks for windows.
    // Nested divs break mac.
    announcementTextInNestedDiv: boolean;
}

const _isMac = (typeof navigator !== 'undefined') && (typeof navigator.platform === 'string') && (navigator.platform.indexOf('Mac') >= 0);

const _styles = {
    liveRegionContainer: Styles.combine({
        position: 'absolute',
        overflow: 'hidden',
        opacity: 0,
        top: -30,
        bottom: 0,
        left: 0,
        right: 0,
        height: 30,
        whiteSpace: 'pre'
    })
};

export class AccessibilityAnnouncer extends React.Component<{}, AccessibilityAnnouncerState> {
    private _clearAnnouncementTimer: number | undefined;
    private _newAnnouncementEventChangedSubscription: SubscriptionToken | undefined;

    constructor(props: {}) {
        super(props);

        // Update announcement text.
        this._newAnnouncementEventChangedSubscription =
            Accessibility.newAnnouncementReadyEvent.subscribe(announcement => {
                if (this.state.announcementText === announcement) {
                    // If the previous announcement is the same as the current announcement
                    // we will append a ' ' to it. This ensures that the text in DOM of aria-live region changes
                    // and  will be read by screen Reader

                    announcement += ' ';
                }

                if (_isMac) {
                    // annnouncementText should never be in nested div for mac.
                    // Voice over ignores reading nested divs in aria-live container.
                    this.setState({
                        announcementText: announcement
                    });
                } else {

                    // Additionally, alternate between announcement text directly under the aria-live element and
                    // nested in a div to work around issues with some readers. NVDA on Windows is known to
                    // not announce aria-live reliably without this, for example.
                    this.setState({
                        announcementText: announcement,
                        announcementTextInNestedDiv: !this.state.announcementTextInNestedDiv
                    });
                }
            });

        this.state = this._getInitialState();
    }

    private _getInitialState(): AccessibilityAnnouncerState {
        return {
            announcementText: '',
            announcementTextInNestedDiv: false
        };
    }

    componentDidUpdate(prevProps: {}, prevState: AccessibilityAnnouncerState) {
        // When a new announcement text is set in the live region, start a timer to clear the text from the div so that it can't be focused
        // using a screen reader.
        if (prevState.announcementText !== this.state.announcementText && this.state.announcementText) {
            this._startClearAnnouncementTimer();
        }
    }

    componentWillUnmount() {
        if (this._newAnnouncementEventChangedSubscription) {
            this._newAnnouncementEventChangedSubscription.unsubscribe();
            this._newAnnouncementEventChangedSubscription = undefined;
        }
    }

    render() {
        const announcement: any = this.state.announcementTextInNestedDiv ?
            ( <div> { this.state.announcementText } </div> ) :
            this.state.announcementText;

        return (
            <div
                style={ _styles.liveRegionContainer as any }
                aria-live={ AccessibilityUtil.accessibilityLiveRegionToString(Types.AccessibilityLiveRegion.Assertive) }
                aria-atomic={ 'true' }
                aria-relevant={ 'additions text' }
            >
                { announcement }
            </div>
        );
    }

    private _cancelClearAnnouncementTimer() {
        if (this._clearAnnouncementTimer) {
            clearTimeout(this._clearAnnouncementTimer);
            this._clearAnnouncementTimer = undefined;
        }
    }

    private _startClearAnnouncementTimer() {
        this._cancelClearAnnouncementTimer();

        this._clearAnnouncementTimer = window.setTimeout(() => {
            this.setState({
                announcementText: ''
            });
        }, 2000);
    }
}

export default AccessibilityAnnouncer;
