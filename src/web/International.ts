/**
* International.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation for i18n.
*/

import RXInterfaces = require('../common/Interfaces');

export class International implements RXInterfaces.International {
    allowRTL(allow: boolean): void {
        // Need to implement
    }

    forceRTL(force: boolean): void {
        // Need to implement
    }

    isRTL(): boolean {
        return false;
    }
}

export default new International();
