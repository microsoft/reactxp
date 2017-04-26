/**
* ScrollViewConfig.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific scroll view configuration, required to avoid circular
* dependency between application and ScrollView.
*/
export declare class ScrollViewConfig {
    private _useCustomScrollbars;
    setUseCustomScrollbars(value: boolean): void;
    useCustomScrollbars(): boolean;
}
declare var _default: ScrollViewConfig;
export default _default;
