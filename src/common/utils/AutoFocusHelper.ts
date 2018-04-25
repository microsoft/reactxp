/**
* AutoFocusHelper.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Provides the functions which allow to handle the selection of a proper component
* to focus from the multiple candidates with autoFocus=true.
*/

import React = require('react');
import Types = require('../Types');
import Interfaces = require('../Interfaces');

let _sortAndFilter: SortAndFilterFunc|undefined;
let _autoFocusTimer: number|undefined;
let _isFocusFirstEnabled = true;

let _lastFocusArbitratorProviderId = 0;

let rootFocusArbitratorProvider: FocusArbitratorProvider;

export type SortAndFilterFunc = (candidates: FocusCandidate[]) => FocusCandidate[];

export function setSortAndFilterFunc(sortAndFilter: SortAndFilterFunc): void {
    _sortAndFilter = sortAndFilter;
}

export function setRootFocusArbitrator(arbitrator: Types.FocusArbitrator | undefined): void {
    rootFocusArbitratorProvider.setCallback(arbitrator);
}

export function setFocusFirstEnabled(enabled: boolean): void {
    _isFocusFirstEnabled = enabled;
}

export class FocusCandidate implements Types.FocusCandidate {
    component: React.Component<any, any>;
    focus: () => void;
    isAvailable: () => boolean;
    getParentAccessibilityId: () => string | undefined;

    constructor(component: React.Component<any, any>, focus: () => void, isAvailable: () => boolean,
            parentAccessibilityId: string | undefined) {

        this.component = component;
        this.focus = focus;
        this.isAvailable = isAvailable;
        this.getParentAccessibilityId = () => parentAccessibilityId;
    }

    getAccessibilityId(): string | undefined {
        return this.component.props && this.component.props.accessibilityId;
    }
}

export class FirstFocusCandidate extends FocusCandidate {
    // A FocusCandidate for the first focusable to check instanceof.
}

export class FocusArbitratorProvider {
    private _id: number;
    private _parentArbitratorProvider: FocusArbitratorProvider | undefined;
    private _view: Interfaces.View | undefined;

    private _arbitratorCallback: Types.FocusArbitrator | undefined;
    private _candidates: FocusCandidate[] = [];
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

    private _arbitrate(): FocusCandidate | undefined {
        const candidates = this._candidates;

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
            isFirstFocusable?: boolean): void {

        const parentProvider = this._view !== component ? this : this._parentArbitratorProvider;
        const parentAccessibilityId = parentProvider
            ? parentProvider._view && parentProvider._view.props && parentProvider._view.props.accessibilityId
            : undefined;

        this._candidates.push(
            isFirstFocusable && _isFocusFirstEnabled
                ? new FirstFocusCandidate(component, focus, isAvailable, parentAccessibilityId)
                : new FocusCandidate(component, focus, isAvailable, parentAccessibilityId)
        );

        this._notifyParent();
    }

    private static _arbitrate(candidates: FocusCandidate[], arbitrator?: Types.FocusArbitrator): FocusCandidate | undefined {
        // Filtering out everything which is already unmounted.
        candidates = candidates.filter(item => item.isAvailable());

        if (_sortAndFilter) {
            candidates = _sortAndFilter(candidates);
        }

        for (let i = 0; i < candidates.length; i++) {
            if (candidates[i] instanceof FirstFocusCandidate) {
                return candidates[i];
            }
        }

        if (arbitrator) {
            return arbitrator(candidates);
        }

        return candidates[candidates.length - 1];
    }

    setCallback(arbitrator?: Types.FocusArbitrator) {
        this._arbitratorCallback = arbitrator;
    }

    static requestFocus(component: React.Component<any, any>, focus: () => void, isAvailable: () => boolean,
            isFirstFocusable?: boolean): void {

        if (_autoFocusTimer) {
            clearTimeout(_autoFocusTimer);
        }

        const focusArbitratorProvider: FocusArbitratorProvider =
            (((component as any)._focusArbitratorProvider instanceof FocusArbitratorProvider) &&
             (component as any)._focusArbitratorProvider) ||
            (component.context && component.context.focusArbitrator) ||
            rootFocusArbitratorProvider;

        focusArbitratorProvider._requestFocus(component, focus, isAvailable, isFirstFocusable);

        _autoFocusTimer = setTimeout(() => {
            _autoFocusTimer = undefined;

            const candidate = rootFocusArbitratorProvider._arbitrate();

            if (candidate) {
                candidate.focus();
            }
        }, 0);
    }
}

rootFocusArbitratorProvider = new FocusArbitratorProvider();
