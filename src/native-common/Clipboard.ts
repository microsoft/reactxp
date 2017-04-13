/**
* Clipboard.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Clipboard abstraction.
*/

import RN = require('react-native');

import RX = require('../common/Interfaces');
import SyncTasks = require('synctasks');

export class Clipboard extends RX.Clipboard  {
    public setText(text: string) {
        RN.Clipboard.setString(text);
    }

    public getText(): SyncTasks.Promise<string> {
        let defer = SyncTasks.Defer<string>();

        return SyncTasks.fromThenable(RN.Clipboard.getString());
    }
}

export default new Clipboard();
