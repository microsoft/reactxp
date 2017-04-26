import { Text as CommonText } from '../native-common/Text';
import Types = require('../common/Types');
export declare class Text extends CommonText {
    protected _getStyles(): Types.TextStyleRuleSet;
    render(): JSX.Element;
    focus(): void;
}
export default Text;
