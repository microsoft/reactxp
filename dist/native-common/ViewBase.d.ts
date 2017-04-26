import RN = require('react-native');
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare abstract class ViewBase<P extends Types.ViewProps, S> extends RX.ViewBase<P, S> {
    private static _defaultViewStyle;
    private _layoutEventValues;
    abstract render(): JSX.Element;
    protected _nativeView: RN.View;
    static setDefaultViewStyle(defaultViewStyle: Types.ViewStyleRuleSet): void;
    setNativeProps(nativeProps: RN.ViewProps): void;
    protected _setNativeView: (view: RN.View) => void;
    protected _getStyles(props: Types.ViewProps): Types.ViewStyleRuleSet;
    protected _onLayout: (event: RN.ViewOnLayoutEvent) => void;
    focus(): void;
    blur(): void;
}
export default ViewBase;
