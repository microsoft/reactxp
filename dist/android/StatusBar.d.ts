import RX = require('../common/Interfaces');
export declare class StatusBar extends RX.StatusBar {
    isOverlay(): boolean;
    setHidden(hidden: boolean, showHideTransition: 'slide' | 'fade'): void;
    setBackgroundColor(color: string, animated: boolean): void;
    setTranslucent(translucent: boolean): void;
    setBarStyle(style: 'default' | 'light-content' | 'dark-content', animated: boolean): void;
    setNetworkActivityIndicatorVisible(value: boolean): void;
}
declare var _default: StatusBar;
export default _default;
