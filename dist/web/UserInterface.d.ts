/**
* UserInterface.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the ReactXP interfaces related to
* UI (layout measurements, etc.).
*/
import React = require('react');
import SyncTasks = require('synctasks');
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class UserInterface extends RX.UserInterface {
    measureLayoutRelativeToWindow(component: React.Component<any, any>): SyncTasks.Promise<Types.LayoutInfo>;
    measureLayoutRelativeToAncestor(component: React.Component<any, any>, ancestor: React.Component<any, any>): SyncTasks.Promise<Types.LayoutInfo>;
    measureWindow(): Types.LayoutInfo;
    getContentSizeMultiplier(): SyncTasks.Promise<number>;
    isHighPixelDensityScreen(): boolean;
    getPixelRatio(): number;
    setMainView(element: React.ReactElement<any>): void;
    useCustomScrollbars(enable?: boolean): void;
    dismissKeyboard(): void;
}
declare var _default: UserInterface;
export default _default;
