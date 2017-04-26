import RX = require('../common/Interfaces');
export declare class StatusBar extends RX.StatusBar {
    isOverlay(): boolean;
    setBarStyle(style: 'default' | 'light-content' | 'dark-content', animated: boolean): void;
    setHidden(hidden: boolean, showHideTransition: 'fade' | 'slide'): void;
    setNetworkActivityIndicatorVisible(value: boolean): void;
    setBackgroundColor(color: string, animated: boolean): void;
    setTranslucent(translucent: boolean): void;
}
declare var _default: StatusBar;
export default _default;
