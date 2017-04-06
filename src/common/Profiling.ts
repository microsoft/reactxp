/**
* Profiling.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Utility functions used for performance profiling.
*/

import Perf = require('react-addons-perf');
import RX = require('../common/Interfaces');
import Types = require('../common/Types');

export class Profiling extends RX.Profiling {
    installWatchdog() : void {
        console.warn('watchdog is not implemented for this platform');
    }

    start(): void {
        Perf.start();
    }

    stop(): void {
        Perf.stop();
    }

    printResults(config: Types.ProfilingLoggingConfig) : void {
        const measurements = Perf.getLastMeasurements();

        if (config.printExclusive) {
            Perf.printExclusive(measurements);
        }

        if (config.printInclusive) {
            Perf.printInclusive(measurements);
        }

        if (config.printWasted) {
            Perf.printWasted(measurements);
        }

        if (config.printOperations) {
            Perf.printOperations(measurements);
        }

        if (config.printDOM) {
            Perf.printDOM(measurements);
        }
    }

}
export default new Profiling();
