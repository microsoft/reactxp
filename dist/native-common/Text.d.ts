import RN = require('react-native');
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class Text extends RX.Text<{}> {
    setNativeProps(nativeProps: RN.TextProps): void;
    render(): JSX.Element;
    protected _getStyles(): Types.TextStyleRuleSet;
    focus(): void;
    blur(): void;
}
export default Text;
