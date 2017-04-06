/**
* Platform.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Native implementation of Platform interface.
*/

import RN = require('react-native');

import RX = require('../common/Interfaces');
import Types = require('../common/Types');

export class Platform extends RX.Platform {
    getType(): Types.PlatformType {
        return RN.Platform.OS;
    }
}

export default new Platform();
