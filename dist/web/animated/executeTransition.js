/**
* executeTransition.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Provides a convenient API for applying a CSS transition to a DOM element and
* notifying when the transition is complete.
*/
"use strict";
var _ = require("./../utils/lodashMini");
// Convenient API for applying a CSS transition to a DOM element. Calls `done` when the transition is completed.
function executeTransition(element, transitions, done) {
    var longestDurationPlusDelay = 0;
    var longestDurationProperty = '';
    var cssTransitions = [];
    _.each(transitions, function (transition) {
        var property = transition.property;
        var duration = transition.duration;
        var timing = transition.timing === undefined ? 'linear' : transition.timing;
        var delay = transition.delay === undefined ? 0 : transition.delay;
        var from = transition.from;
        if (duration + delay > longestDurationPlusDelay) {
            longestDurationPlusDelay = duration + delay;
            longestDurationProperty = property;
        }
        // Initial state
        element.style[property] = from;
        // Resolve styles. This is a trick to force the browser to refresh the
        // computed styles. Without this, it won't pick up the new "from" value
        // that we just set above.
        // tslint:disable-next-line
        getComputedStyle(element).opacity;
        // TODO: Cross-browser equivalent of 'transition' style (e.g. vendor prefixed).
        cssTransitions.push(duration + 'ms ' + property + ' ' + timing + ' ' + delay + 'ms');
    });
    element.style.transition = cssTransitions.join(', ');
    var finish;
    var onTransitionEnd = function (ev) {
        if (ev.target === element && ev.propertyName === longestDurationProperty) {
            finish();
        }
    };
    // TODO: Cross-browser equivalent of 'transitionEnd' event (e.g. vendor prefixed).
    element.addEventListener('webkitTransitionEnd', onTransitionEnd);
    element.addEventListener('transitionEnd', onTransitionEnd);
    var timeoutId = 0;
    var didFinish = false;
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
    _.defer(function () {
        // Set the "to" values.
        _.each(transitions, function (transition) {
            var property = transition.property;
            var to = transition.to;
            element.style[property] = to;
        });
    });
}
exports.executeTransition = executeTransition;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = executeTransition;
