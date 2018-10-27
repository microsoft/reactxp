/**
 * Clipboard.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform Clipboard abstraction.
 */

import * as RN from 'react-native';
import * as SyncTasks from 'synctasks';

import * as RX from '../common/Interfaces';

export class Clipboard extends RX.Clipboard  {
    setText(text: string) {
        RN.Clipboard.setString(text);
    }

    getText(): SyncTasks.Promise<string> {
        return SyncTasks.fromThenable(RN.Clipboard.getString());
    }
}

export default new Clipboard();
