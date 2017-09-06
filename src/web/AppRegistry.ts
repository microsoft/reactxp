/**
* AppRegistry.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Implements AppRegistry interface for ReactXP.
*/

import RX = require('../common/Interfaces');

export class AppRegistry extends RX.AppRegistry {
    registerComponent(appKey: string, getComponentFunc: Function): any {
        // NO-OP
    }
}

export default new AppRegistry();
