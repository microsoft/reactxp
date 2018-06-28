/**
 * ExceptionReporter.ts
 * Copyright: Microsoft 2018
 *
 * Class that hooks the uncaught exception handler and reports exceptions to the
 * user via message boxes. This should be used only in debug mode.
 */

import * as assert from 'assert';

// Returns a boolean indicating whether to stop error propagation.
// When false, application proceeds to crash).
export type ExceptionReporterDelegate = (message: string, source: string | undefined, fileNo: number | undefined,
    columnNo: number | undefined, errName: string | undefined, stackTrace: string | undefined) => boolean;

export default class ExceptionReporter {
    private _handlers : ExceptionReporterDelegate[] = [];

    constructor() {
        window.onerror = (event: Event | string, source?: string, fileNum?: number, columnNum?: number, ...extData: any[]) => {
            // Modern Browsers will support this
            let stack = '';
            let name = '';
            if (extData && extData[0]) {
                stack = extData[0]['stack'] || stack;
                name = extData[0]['name'] || name;
            }

            let swallowError = false;

            this._handlers.forEach(handler => {
                try {
                    if (handler !== null) {
                        swallowError = swallowError || handler(event.toString(), source, fileNum, columnNum, name, stack);
                    }
                } catch (err) {
                    assert.fail('Error handling Exception: ' + JSON.stringify(err));
                }
            });

            return swallowError;
        };
    }

    register(handler: ExceptionReporterDelegate) {
        if (handler !== null) {
             this._handlers.push(handler);
        }
    }

    registerAlertView() {
        this._handlers.push((event, source, fileno, columnNumber) => {
            window.alert('DEBUG ALERT: Uncaught Exception\n' + event + '\n' + source + ' (' + fileno + ',' + columnNumber + ')');
            return false;
        });
    }

    registerConsoleView() {
        this._handlers.push((event, source, fileno, columnNumber, errName, stack) => {
            console.error('DEBUG ALERT: Uncaught Exception\n' + event + '\n' + source +
                ' (' + fileno + ',' + columnNumber + ')\nStack:\n' + stack);
            return false;
        });
    }

    unregister() {
        this._handlers = [];
    }
}
