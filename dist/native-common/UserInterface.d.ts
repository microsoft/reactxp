import React = require('react');
import SyncTasks = require('synctasks');
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class UserInterface extends RX.UserInterface {
    constructor();
    measureLayoutRelativeToWindow(component: React.Component<any, any>): SyncTasks.Promise<Types.LayoutInfo>;
    measureLayoutRelativeToAncestor(component: React.Component<any, any>, ancestor: React.Component<any, any>): SyncTasks.Promise<Types.LayoutInfo>;
    measureWindow(): Types.LayoutInfo;
    getContentSizeMultiplier(): SyncTasks.Promise<number>;
    useCustomScrollbars(enable?: boolean): void;
    dismissKeyboard(): void;
    isHighPixelDensityScreen(): boolean;
    getPixelRatio(): number;
    setMainView(element: React.ReactElement<any>): void;
    renderMainView(): void;
}
declare var _default: UserInterface;
export default _default;
