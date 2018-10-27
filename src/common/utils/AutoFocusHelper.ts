/**
 * AutoFocusHelper.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Provides the functions which allow to handle the selection of a proper component
 * to focus from the multiple candidates with autoFocus=true.
 */

import * as React from 'react';

import * as RX from '../Interfaces';
import Timers from './Timers';

let _sortAndFilter: SortAndFilterFunc | undefined;
let _autoFocusTimer: number | undefined;
let _lastFocusArbitratorProviderId = 0;
let rootFocusArbitratorProvider: FocusArbitratorProvider;

export enum FocusCandidateType {
    Focus = 1,
    FocusFirst = 2
}

export interface FocusCandidateInternal {
    component: React.Component<any, any>;
    focus: () => void;
    isAvailable: () => boolean;
    type: FocusCandidateType;
    accessibilityId?: string;
}

export type SortAndFilterFunc = (candidates: FocusCandidateInternal[]) => FocusCandidateInternal[];

export function setSortAndFilterFunc(sortAndFilter: SortAndFilterFunc): void {
    _sortAndFilter = sortAndFilter;
}

export class FocusArbitratorProvider {
    private _id: number;
    private _parentArbitratorProvider: FocusArbitratorProvider | undefined;

    private _arbitratorCallback: RX.Types.FocusArbitrator | undefined;
    private _candidates: FocusCandidateInternal[] = [];
    private _pendingChildren: { [key: string]: FocusArbitratorProvider } = {};

    constructor(view?: RX.View, arbitrator?: RX.Types.FocusArbitrator) {
        this._id = ++_lastFocusArbitratorProviderId;
        this._parentArbitratorProvider = view
            ? ((view.context && view.context.focusArbitrator) || rootFocusArbitratorProvider)
            : undefined;
        this._arbitratorCallback = arbitrator;
    }

    private _notifyParent() {
        if (this._parentArbitratorProvider) {
            this._parentArbitratorProvider._pendingChildren['fa-' + this._id.toString()] = this;
            this._parentArbitratorProvider._notifyParent();
        }
    }

    private _arbitrate(): FocusCandidateInternal | undefined {
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
            type: FocusCandidateType): void {

        const accessibilityId = component.props && component.props.accessibilityId;

        this._candidates.push({
            component,
            focus,
            isAvailable,
            type,
            accessibilityId
        });

        this._notifyParent();
    }

    private static _arbitrate(candidates: FocusCandidateInternal[],
            arbitrator?: RX.Types.FocusArbitrator): FocusCandidateInternal | undefined {
        // Filtering out everything which is already unmounted.
        candidates = candidates.filter(item => item.isAvailable());

        if (_sortAndFilter) {
            candidates = _sortAndFilter(candidates);
        }

        for (let i = 0; i < candidates.length; i++) {
            if (candidates[i].type === FocusCandidateType.FocusFirst) {
                return candidates[i];
            }
        }

        if (arbitrator) {
            // There is an application specified focus arbitrator.
            const toArbitrate: RX.Types.FocusCandidate[] = [];

            candidates.forEach(candidate => {
                const component = candidate.component as any;

                // Make sure to pass FocusableComponents only.
                if (component.focus && component.blur && component.requestFocus) {
                    component.__focusCandidateInternal = candidate;

                    toArbitrate.push({
                        component,
                        accessibilityId: candidate.accessibilityId
                    });
                }
            });

            if (toArbitrate.length) {
                const candidate = arbitrator(toArbitrate);
                let ret: FocusCandidateInternal | undefined;

                if (candidate && candidate.component && (candidate.component as any).__focusCandidateInternal) {
                    ret = (candidate.component as any).__focusCandidateInternal as FocusCandidateInternal;
                }

                toArbitrate.forEach(candidate => {
                    delete (candidate.component as any).__focusCandidateInternal;
                });

                return ret;
            }
        }

        return candidates[candidates.length - 1];
    }

    setCallback(arbitrator?: RX.Types.FocusArbitrator) {
        this._arbitratorCallback = arbitrator;
    }

    static requestFocus(component: React.Component<any, any>, focus: () => void, isAvailable: () => boolean,
            type?: FocusCandidateType): void {

        if (_autoFocusTimer) {
            clearTimeout(_autoFocusTimer);
        }

        const focusArbitratorProvider: FocusArbitratorProvider =
            (((component as any)._focusArbitratorProvider instanceof FocusArbitratorProvider) &&
             (component as any)._focusArbitratorProvider) ||
            (component.context && component.context.focusArbitrator) ||
            rootFocusArbitratorProvider;

        focusArbitratorProvider._requestFocus(component, focus, isAvailable, type || FocusCandidateType.Focus);

        _autoFocusTimer = Timers.setTimeout(() => {
            _autoFocusTimer = undefined;

            const candidate = rootFocusArbitratorProvider._arbitrate();

            if (candidate) {
                candidate.focus();
            }
        }, 0);
    }
}

rootFocusArbitratorProvider = new FocusArbitratorProvider();
