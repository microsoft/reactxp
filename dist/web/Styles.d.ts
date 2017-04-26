import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class Styles extends RX.Styles {
    combine<S>(defaultStyle: any, ruleSet: Types.StyleRuleSet<S> | Types.StyleRuleSet<S>[]): any;
    createViewStyle(ruleSet: Types.ViewStyle, cacheStyle?: boolean): Types.ViewStyleRuleSet;
    createAnimatedViewStyle(ruleSet: Types.AnimatedViewStyle): Types.AnimatedViewStyleRuleSet;
    createScrollViewStyle(ruleSet: Types.ScrollViewStyle, cacheStyle?: boolean): Types.ScrollViewStyleRuleSet;
    createButtonStyle(ruleSet: Types.ButtonStyle, cacheStyle?: boolean): Types.ButtonStyleRuleSet;
    createWebViewStyle(ruleSet: Types.WebViewStyle, cacheStyle?: boolean): Types.WebViewStyleRuleSet;
    createTextStyle(ruleSet: Types.TextStyle, cacheStyle?: boolean): Types.TextStyleRuleSet;
    createAnimatedTextStyle(ruleSet: Types.AnimatedTextStyle): Types.AnimatedTextStyleRuleSet;
    createTextInputStyle(ruleSet: Types.TextInputStyle, cacheStyle?: boolean): Types.TextInputStyleRuleSet;
    createAnimatedTextInputStyle(ruleSet: Types.AnimatedTextInputStyle): Types.AnimatedTextInputStyleRuleSet;
    createLinkStyle(ruleSet: Types.LinkStyle, cacheStyle?: boolean): Types.LinkStyleRuleSet;
    createImageStyle(ruleSet: Types.ImageStyle, cacheStyle?: boolean): Types.ImageStyleRuleSet;
    createAnimatedImageStyle(ruleSet: Types.AnimatedImageStyle): Types.AnimatedImageStyleRuleSet;
    createPickerStyle(ruleSet: Types.PickerStyle, cacheStyle?: boolean): Types.PickerStyleRuleSet;
    private _getCssPropertyAlias(name);
    private _createDummyElement;
    private _getCssPropertyAliasesJsStyle;
    private _convertJsToCssStyle(prop);
    getCssPropertyAliasesCssStyle: () => {
        [prop: string]: string;
    };
    getParentComponentName(component: any): string;
    private _adaptStyles(def, validate);
}
export declare function memoize<T extends Function>(func: T, resolver?: Function): T;
declare var _default: Styles;
export default _default;
