/**
 * executeTransition.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Provides a convenient API for applying a CSS transition to a DOM element and
 * notifying when the transition is complete.
 */

import * as _ from './../utils/lodashMini';
import Timers from '../../common/utils/Timers';

export interface TransitionSpec {
    property: string;
    duration: number;
    timing?: string;
    delay?: number;
    from: any;
    to: any;
}

// Convenient API for applying a CSS transition to a DOM element. Calls `done` when the transition is completed.
export function executeTransition(element: HTMLElement, transitions: TransitionSpec[], done: () => void): void {
    let longestDurationPlusDelay = 0;
    let longestDurationProperty = '';
    const cssTransitions: string[] = [];

    _.each(transitions, (transition: TransitionSpec) => {
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
        cssTransitions.push(property + ' ' + duration + 'ms ' + timing + ' ' + delay + 'ms');
    });

    element.style.transition = cssTransitions.join(', ');

    let finish: () => void;
    const onTransitionEnd = (ev: TransitionEvent) => {
        if (ev.target === element && ev.propertyName === longestDurationProperty) {
            finish();
        }
    };

    // TODO: Cross-browser equivalent of 'transitionEnd' event (e.g. vendor prefixed).
    element.addEventListener('webkitTransitionEnd', onTransitionEnd);
    element.addEventListener('transitionEnd', onTransitionEnd);

    let timeoutId = 0;
    let didFinish = false;
    finish = function() {
        if (!didFinish) {
            clearTimeout(timeoutId);

            // Only complete the transition if we are ending the same transition it was initially set.
            // There are cases where transitions may be overriden before the transition ends.
            if (element.dataset.transitionId === timeoutId.toString()) {
                // TODO: Cross-browser equivalent of 'transitionEnd' event (e.g. vendor prefixed).
                element.removeEventListener('webkitTransitionEnd', onTransitionEnd);
                element.removeEventListener('transitionEnd', onTransitionEnd);

                delete element.dataset.transitionId;
                element.style.transition = 'none';

                didFinish = true;
                done();
            }
        }
    };

    // Watchdog timeout for cases where transitionEnd event doesn't fire.
    timeoutId = Timers.setTimeout(function() {
        // If the item was removed from the DOM (which can happen if a
        // rerender occurred), don't bother finishing. We don't want to do
        // this in the transition event finish path because it's expensive
        // and unnecessary in that case because the transition event
        // implies that the element is still in the DOC
        if (document.body.contains(element)) {
            finish();
        }
    }, longestDurationPlusDelay + 10);
    element.dataset.transitionId = timeoutId.toString();

    // Set the "to" values.
    _.each(transitions, (transition: TransitionSpec) => {
        const property = transition.property;
        const to = transition.to;
        (element.style as any)[property] = to;
    });
}

export default executeTransition;
