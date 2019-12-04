
/**
 * PromiseDefer.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Creates a deferral object that wraps promises with easier to use type-safety
 */

import Timers from './Timers';

export class Defer<T> {
    private _promise: Promise<T>;
    private _resolver: ((value: T) => void) | undefined;
    private _rejector: ((value: any) => void) | undefined;
    constructor() {
        this._promise = new Promise<T>((res, rej) => {
            this._resolver = res;
            this._rejector = rej;
        });
    }

    resolve(value: T): void {
        // Resolver shouldn't be undefined, but it's technically possible
        if (!this._resolver) {
            Timers.setTimeout(() => {
                this.resolve(value);
            }, 10);
            return;
        }
        this._resolver(value);
    }

    reject(value: any): void {
        // Rejector shouldn't be undefined, but it's technically possible
        if (!this._rejector) {
            Timers.setTimeout(() => {
                this.reject(value);
            }, 10);
            return;
        }
        this._rejector(value);
    }

    promise(): Promise<T> {
        return this._promise;
    }
}
