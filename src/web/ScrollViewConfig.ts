/**
 * ScrollViewConfig.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific scroll view configuration, required to avoid circular
 * dependency between application and ScrollView.
 */

export class ScrollViewConfig {
    private _useCustomScrollbars = false;
    // Enable native scrollbars for all instances.
    setUseCustomScrollbars(value: boolean): void {
        this._useCustomScrollbars = value;
    }

    useCustomScrollbars(): boolean {
        return this._useCustomScrollbars;
    }
}

export default new ScrollViewConfig();
