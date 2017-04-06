/**
* Platform.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of Platform interface.
*/

import RX = require('../common/Interfaces');
import Types = require('../common/Types');

export class Platform extends RX.Platform {
    getType(): Types.PlatformType {
        return 'web';
    }
}

export default new Platform();
