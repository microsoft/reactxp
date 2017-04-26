import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class Alert implements RX.Alert {
    show(title: string, message?: string, buttons?: Types.AlertButtonSpec[]): void;
}
declare var _default: Alert;
export default _default;
