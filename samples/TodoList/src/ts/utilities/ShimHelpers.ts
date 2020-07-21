/**
* ShimHelpers.ts
* Copyright: Microsoft 2018
*
* Helpers to shim various aspects of the app for React Native.
*/

import { Options as ReSubOptions } from 'resub';

import ExceptionReporter from './ExceptionReporter';

declare let global: any;

export function shimEnvironment(isDev: boolean, isNative: boolean) {
    // Set resub development options early, before autosubscriptions set themselves up.
    ReSubOptions.development = isDev;
    ReSubOptions.preventTryCatchInRender = true;

    // Install our exception-reporting alert on local builds.
    const exceptionReporter = new ExceptionReporter();
    if (isDev) {
        exceptionReporter.registerAlertView();
        exceptionReporter.registerConsoleView();
    }

    if (isNative) {
        shimReactNative();
    }
}

// Shim React Native to include various globals found in the browser
// environment like window, document, navigator, etc.
function shimReactNative() {
    if (typeof (document) === 'undefined') {
        global.document = {
            documentElement: {
                style: {},
            },
        };

        global.window.addEventListener = function(eventName: string) {
            // No-op
        };

        global.window.removeEventListener = function(eventName: string) {
            // No-op
        };
    }
}
