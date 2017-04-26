import RX = require('../common/Interfaces');
import { NavigatorState } from './NavigatorCommon';
import Types = require('../common/Types');
export declare class Navigator extends RX.Navigator<NavigatorState> {
    private _delegate;
    private _commandQueue;
    constructor(initialProps: Types.NavigatorProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    protected componentDidUpdate(): void;
    protected getRoutes(): Types.NavigatorRoute[];
    push(route: Types.NavigatorRoute): void;
    pop(): void;
    replace(route: Types.NavigatorRoute): void;
    replacePrevious(route: Types.NavigatorRoute): void;
    replaceAtIndex(route: Types.NavigatorRoute, index: number): void;
    immediatelyResetRouteStack(nextRouteStack: Types.NavigatorRoute[]): void;
    popToRoute(route: Types.NavigatorRoute): void;
    popToTop(): void;
    getCurrentRoutes(): Types.NavigatorRoute[];
    render(): JSX.Element;
    private _enqueueCommand(command);
    private _processCommand();
}
export default Navigator;
