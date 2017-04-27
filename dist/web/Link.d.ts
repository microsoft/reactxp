import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class Link extends RX.Link<void> {
    private _longPressTimer;
    render(): JSX.Element;
    _getStyles(): Types.LinkStyleRuleSet;
    private _onClick;
    private _onMouseDown;
    private _onMouseUp;
}
export default Link;
