import Types = require('../common/Types');
import ViewBase from './ViewBase';
export declare class View extends ViewBase<Types.ViewProps, {}> {
    private _internalProps;
    constructor(props: Types.ViewProps);
    componentWillReceiveProps(nextProps: Types.ViewProps): void;
    /**
     * Attention:
     * be careful with setting any non layout properties unconditionally in this method to any value
     * as on android that would lead to extra layers of Views.
     */
    private _buildInternalProps(props);
    private _isButton(viewProps);
    render(): JSX.Element;
}
export default View;
