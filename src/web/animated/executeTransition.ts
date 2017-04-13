/**
* executeTransition.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Provides a convenient API for applying a CSS transition to a DOM element and
* notifying when the transition is complete.
*/

import _ = require('./../utils/lodashMini');

export interface ITransitionSpec {
    property: string;
    duration: number;
    timing?: string;
    delay?: number;
    from: any;
    to: any;
}

// Convenient API for applying a CSS transition to a DOM element. Calls `done` when the transition is completed.
export function executeTransition(element: HTMLElement, transitions: ITransitionSpec[], done: () => void): void {
    let longestDurationPlusDelay = 0;
    let longestDurationProperty = '';
    let cssTransitions: string[] = [];

    _.each(transitions, (transition: ITransitionSpec) => {
        const property = transition.property;
        const duration = transition.duration;
        const timing = transition.timing === undefined ? 'linear' : transition.timing;
        const delay = transition.delay === undefined ? 0 : transition.delay;
        const from = transition.from;

        if (duration + delay > longestDurationPlusDelay) {
            longestDurationPlusDelay = duration + delay;
            longestDurationProperty = property;
        }

        // Initial state
        (element.style as any)[property] = from;

        // Resolve styles. This is a trick to force the browser to refresh the
        // computed styles. Without this, it won't pick up the new "from" value
        // that we just set above.
        // tslint:disable-next-line
        getComputedStyle(element).opacity;

        // TODO: Cross-browser equivalent of 'transition' style (e.g. vendor prefixed).
        cssTransitions.push(duration + 'ms ' + property + ' ' + timing + ' ' + delay + 'ms');
    });

    element.style.transition = cssTransitions.join(', ');

    let finish: () => void;
    let onTransitionEnd = (ev: TransitionEvent) => {
        if (ev.target === element && ev.propertyName === longestDurationProperty) {
            finish();
        }
    };

    // TODO: Cross-browser equivalent of 'transitionEnd' event (e.g. vendor prefixed).
    element.addEventListener('webkitTransitionEnd', onTransitionEnd);
    element.addEventListener('transitionEnd', onTransitionEnd);

    let timeoutId = 0;
    let didFinish = false;
    finish = function () {
        if (!didFinish) {
            clearTimeout(timeoutId);

            // TODO: Cross-browser equivalent of 'transitionEnd' event (e.g. vendor prefixed).
            element.removeEventListener('webkitTransitionEnd', onTransitionEnd);
            element.removeEventListener('transitionEnd', onTransitionEnd);

            // Only clean the transition if we are ending the same transition it was initially set.
            // There are cases where transitions may be overriden before the transition before ends.
            if (element.dataset['transitionId'] === timeoutId.toString()) {
                delete element.dataset['transitionId'];
                element.style.transition = 'none';
            }

            didFinish = true;
            done();
        }
    };

    // Watchdog timeout for cases where transitionEnd event doesn't fire.
    timeoutId = window.setTimeout(finish, longestDurationPlusDelay + 10);
    element.dataset['transitionId'] = timeoutId.toString();

    // On webkit browsers, we need to defer the setting of the actual properties
    // for some reason.
    _.defer(() => {
        // Set the "to" values.
        _.each(transitions, (transition: ITransitionSpec) => {
            const property = transition.property;
            const to = transition.to;
            (element.style as any)[property] = to;
        });
    });
}

export default executeTransition;
