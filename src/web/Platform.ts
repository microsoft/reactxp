/**
* Platform.ts
* Copyright: Microsoft 2017
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
