/**
* Timers.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Utility functions for creating timers. We wrap the normal
* global timer methods because they are defined in both
* the node and lib type definition files, and the definitions
* don't match. Depending on which one TypeScript picks up,
* we can get compiler errors.
*/

export default class Timers {
    static clearInterval(handle: number): void {
        global.clearInterval(handle as any);
    }

    static clearTimeout(handle: number): void {
        global.clearTimeout(handle as any);
    }

    static setInterval(handler: () => void, timeout: number): number {
        return global.setInterval(handler, timeout) as any;
    }

    static setTimeout(handler: () => void, timeout: number): number {
        return global.setTimeout(handler, timeout) as any;
    }
}
