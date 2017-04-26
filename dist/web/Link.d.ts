import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class Link extends RX.Link<void> {
    render(): JSX.Element;
    _getStyles(): Types.LinkStyleRuleSet;
    private _onClick;
}
export default Link;
