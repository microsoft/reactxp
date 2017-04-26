/**
* Clipboard.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Clipboard abstraction.
*/
import RX = require('../common/Interfaces');
import SyncTasks = require('synctasks');
export declare class Clipboard extends RX.Clipboard {
    setText(text: string): void;
    getText(): SyncTasks.Promise<string>;
    private static _createInvisibleNode();
    private static _copyNode(node);
}
declare var _default: Clipboard;
export default _default;
