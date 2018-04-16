/**
* AutoFocusHelper.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Provides the functions which allow to handle the selection of a proper component
* to focus out of the candidates which claim to be focused on mount with either
* autoFocus property or which were queued to focus using FocusUtils.requestFocus().
*/

import React = require('react');
import Types = require('../Types');

let _sortAndFilter: SortAndFilterFunc|undefined;
let _arbitrator: Types.FocusArbitrator|undefined;
let _autoFocusTimer: number|undefined;
let _pendingAutoFocusItems: Types.FocusCandidate[] = [];

// The default behaviour in the keyboard navigation mode is to focus first
// focusable component when a View with restrictFocusWithin is mounted.
// This is the id for the first focusable which is used by FocusManager.
// The implementors could use this id from their implementations of
// FocusArbitrator.
export const FirstFocusableId = 'reactxp-first-focusable';

export type SortAndFilterFunc = (candidates: Types.FocusCandidate[]) => Types.FocusCandidate[];

export function setSortAndFilterFunc(sortAndFilter: SortAndFilterFunc) {
    _sortAndFilter = sortAndFilter;
}

export function setFocusArbitrator(arbitrator: Types.FocusArbitrator) {
    _arbitrator = arbitrator;
}

export function requestFocus(id: string, component: React.Component<any, any>, focus: () => void): void {
    _pendingAutoFocusItems.push({
        id,
        component,
        focus
    });

    if (_autoFocusTimer) {
        clearTimeout(_autoFocusTimer);
    }

    // Defer the action to wait for all components which are being mounted at
    // the same tick.
    _autoFocusTimer = setTimeout(() => {
        _autoFocusTimer = undefined;

        if (_sortAndFilter) {
            _pendingAutoFocusItems = _sortAndFilter(_pendingAutoFocusItems);
        }

        if (_arbitrator && _arbitrator(_pendingAutoFocusItems)) {
            _pendingAutoFocusItems = [];
            return;
        }

        let autoFocusItem: Types.FocusCandidate|undefined;

        // If no sorting function is specified and the arbitrator hasn't handled
        // the focus, we choose the first focusable component provided by FocusManager
        // or the last one queued.
        for (let i = 0; i < _pendingAutoFocusItems.length; i++) {
            if (_pendingAutoFocusItems[i].id === FirstFocusableId) {
                autoFocusItem = _pendingAutoFocusItems[i];
                break;
            }
        }

        if (!autoFocusItem) {
            autoFocusItem = _pendingAutoFocusItems[_pendingAutoFocusItems.length - 1];
        }

        _pendingAutoFocusItems = [];

        if (autoFocusItem) {
            autoFocusItem.focus();
        }
    }, 0);
}
