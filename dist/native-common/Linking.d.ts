import SyncTasks = require('synctasks');
import { Linking as CommonLinking } from '../common/Linking';
export declare class Linking extends CommonLinking {
    constructor();
    protected _openUrl(url: string): SyncTasks.Promise<void>;
    getInitialUrl(): SyncTasks.Promise<string>;
}
declare var _default: Linking;
export default _default;
