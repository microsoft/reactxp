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

const timerProvider = window || global;

export default class Timers {
    static clearInterval(handle: number): void {
        timerProvider.clearInterval(handle as any);
    }

    static clearTimeout(handle: number): void {
        timerProvider.clearTimeout(handle as any);
    }

    static setInterval(handler: () => void, timeout: number): number {
        return timerProvider.setInterval(handler, timeout) as any;
    }

    static setTimeout(handler: () => void, timeout: number): number {
        return timerProvider.setTimeout(handler, timeout) as any;
    }
}
