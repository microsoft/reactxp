/**
* ScrollViewConfig.ts
* Copyright: Microsoft 2017
*
* Web-specific scroll view configuration, required to avoid circular
* dependency between application and ScrollView.
*/

export class ScrollViewConfig {
    private _useCustomScrollbars: boolean = false;
    // Enable native scrollbars for all instances.
    setUseCustomScrollbars(value: boolean): void {
        this._useCustomScrollbars = value;
    }
    
    useCustomScrollbars(): boolean {
        return this._useCustomScrollbars;
    }
};

export default new ScrollViewConfig();
