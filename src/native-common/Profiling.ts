/**
* Profiling.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Profiling utils for react-native.
*/

import RN = require('react-native');

import { Profiling as CommonProfiling } from '../common/Profiling';

export class Profiling extends CommonProfiling {
    installWatchdog() {
        RN.InteractionManager.setDeadline(1000);
        RN.JSEventLoopWatchdog.install({ thresholdMS: 200 });
    }
}

export default new Profiling();
