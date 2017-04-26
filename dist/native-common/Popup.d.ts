import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class Popup extends RX.Popup {
    show(options: Types.PopupOptions, popupId: string, delay?: number): boolean;
    autoDismiss(popupId: string, delay?: number): void;
    dismiss(popupId: string): void;
    dismissAll(): void;
}
declare var _default: Popup;
export default _default;
