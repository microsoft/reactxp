import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export interface ActivityIndicatorState {
    isVisible?: boolean;
}
export declare class ActivityIndicator extends RX.ActivityIndicator<ActivityIndicatorState> {
    private _isMounted;
    constructor(props: Types.ActivityIndicatorProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export default ActivityIndicator;
