/**
* ShimHelpers.ts
* Copyright: Microsoft 2018
*
* Helpers to shim various aspects of the app for React Native.
*/

import * as assert from 'assert';
import ReSubOptions from 'resub/dist/Options';
import * as SyncTasks from 'synctasks';

import ExceptionReporter from './ExceptionReporter';

declare var global: any;

export function shimEnvironment(isDev: boolean, isNative: boolean) {
    // Set resub development options early, before autosubscriptions set themselves up.
    ReSubOptions.development = isDev;
    ReSubOptions.preventTryCatchInRender = true;

    // Set SyncTasks exception rules early. We don't want to swallow any exceptions.
    SyncTasks.config.catchExceptions = false;
    SyncTasks.config.exceptionHandler = (err: Error) => {
        if (!err) {
            return;
        }

        assert.fail('Unhandled exception: ' + JSON.stringify(err));

        // tslint:disable-next-line
        throw err;
    };

    SyncTasks.config.unhandledErrorHandler = (err: any) => {
        assert.fail('Unhandled rejected SyncTask. Error: ' + JSON.stringify(err));
    };

    // Install our exception-reporting alert on local builds.
    let exceptionReporter = new ExceptionReporter();
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
                style: {}
            }
        };

        global.window.addEventListener = function (eventName: string) {
            // No-op
        };

        global.window.removeEventListener = function (eventName: string) {
            // No-op
        };
    }
}
