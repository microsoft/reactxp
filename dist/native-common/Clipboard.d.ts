import RX = require('../common/Interfaces');
import SyncTasks = require('synctasks');
export declare class Clipboard extends RX.Clipboard {
    setText(text: string): void;
    getText(): SyncTasks.Promise<string>;
}
declare var _default: Clipboard;
export default _default;
