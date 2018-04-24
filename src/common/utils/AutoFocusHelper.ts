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
import Interfaces = require('../Interfaces');

let _sortAndFilter: SortAndFilterFunc|undefined;
let _autoFocusTimer: number|undefined;

let _lastFocusArbitratorProviderId = 0;

let rootFocusArbitratorProvider: FocusArbitratorProvider;

// The default behaviour in the keyboard navigation mode is to focus first
// focusable component when a View with restrictFocusWithin is mounted.
// This is the id for the first focusable which is used by FocusManager.
// The implementors could use this id from their implementations of
// FocusArbitrator.
export const FirstFocusableId = 'reactxp-first-focusable';

export type SortAndFilterFunc = (candidates: Types.FocusCandidate[]) => Types.FocusCandidate[];

export function setSortAndFilterFunc(sortAndFilter: SortAndFilterFunc): void {
    _sortAndFilter = sortAndFilter;
}

export function setRootFocusArbitrator(arbitrator: Types.FocusArbitrator | undefined): void {
    rootFocusArbitratorProvider.setCallback(arbitrator);
}

export class FocusArbitratorProvider {
    private _id: number;
    private _parentArbitratorProvider: FocusArbitratorProvider | undefined;
    private _view: Interfaces.View | undefined;

    private _arbitratorCallback: Types.FocusArbitrator | undefined;
    private _candidates: Types.FocusCandidate[] = [];
    private _pendingChildren: { [key: string]: FocusArbitratorProvider } = {};

    constructor(view?: Interfaces.View, arbitrator?: Types.FocusArbitrator) {
        this._id = ++_lastFocusArbitratorProviderId;
        this._view = view;
        this._parentArbitratorProvider = view
            ? ((view.context && view.context.focusArbitrator) || rootFocusArbitratorProvider)
            : undefined;
        this._arbitratorCallback = arbitrator;
    }

    private _notifyParent() {
        if (this._parentArbitratorProvider) {
            this._parentArbitratorProvider._pendingChildren['fa-' + this._id] = this;
            this._parentArbitratorProvider._notifyParent();
        }
    }

    private _arbitrate(): Types.FocusCandidate | undefined {
        const candidates = this._candidates;
        const viewId = this._view && this._view.props && this._view.props.accessibilityId;

        if (viewId) {
            candidates.forEach(candidate => {
                candidate.parentAccessibilityId = viewId;
            });
        }

        Object.keys(this._pendingChildren).forEach(key => {
            const candidate = this._pendingChildren[key]._arbitrate();
            if (candidate) {
                candidates.push(candidate);
            }
        });

        this._candidates = [];
        this._pendingChildren = {};

        return FocusArbitratorProvider._arbitrate(candidates, this._arbitratorCallback);
    }

    private _requestFocus(component: React.Component<any, any>, focus: () => void, isAvailable: () => boolean,
            accessibilityId?: string): void {

        this._candidates.push({
            accessibilityId,
            component,
            focus,
            isAvailable
        });

        this._notifyParent();
    }

    private static _arbitrate(candidates: Types.FocusCandidate[], arbitrator?: Types.FocusArbitrator): Types.FocusCandidate | undefined {
        // Filtering out everything which is already unmounted.
        candidates = candidates.filter(item => item.isAvailable());

        if (_sortAndFilter) {
            candidates = _sortAndFilter(candidates);
        }

        let candidate = arbitrator && arbitrator(candidates);

        if (!candidate) {
            // If the arbitrator hasn't handled the focus, we choose the first focusable component provided
            // by FocusManager or the last one queued.
            for (let i = 0; i < candidates.length; i++) {
                if (candidates[i].accessibilityId === FirstFocusableId) {
                    candidate = candidates[i];
                    break;
                }
            }
        }

        if (!candidate) {
            candidate = candidates[candidates.length - 1];
        }

        return candidate;
    }

    setCallback(arbitrator?: Types.FocusArbitrator) {
        this._arbitratorCallback = arbitrator;
    }

    static requestFocus(component: React.Component<any, any>, focus: () => void, isAvailable: () => boolean,
            accessibilityId?: string): void {

        if (_autoFocusTimer) {
            clearTimeout(_autoFocusTimer);
        }

        const focusArbitratorProvider: FocusArbitratorProvider =
            (((component as any)._focusArbitratorProvider instanceof FocusArbitratorProvider) &&
             (component as any)._focusArbitratorProvider) ||
            (component.context && component.context.focusArbitrator) ||
            rootFocusArbitratorProvider;

        focusArbitratorProvider._requestFocus(component, focus, isAvailable, accessibilityId);

        _autoFocusTimer = setTimeout(() => {
            _autoFocusTimer = undefined;

            const candidate = rootFocusArbitratorProvider._arbitrate();

            if (candidate) {
                candidate.focus();
            }
        }, 0);
    }
}

export function requestFocus(component: React.Component<any, any>, focus: () => void, isAvailable: () => boolean,
        accessibilityId?: string): void {
    FocusArbitratorProvider.requestFocus(component, focus, isAvailable, accessibilityId);
}

rootFocusArbitratorProvider = new FocusArbitratorProvider();
