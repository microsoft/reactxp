import { NavigationCommand, NavigatorDelegate, NavigatorState } from './NavigatorCommon';
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class NavigatorExperimentalDelegate extends NavigatorDelegate {
    private _state;
    private _transitionSpec;
    private _navigationInProgress;
    constructor(navigator: RX.Navigator<NavigatorState>);
    getRoutes(): Types.NavigatorRoute[];
    immediatelyResetRouteStack(nextRouteStack: Types.NavigatorRoute[]): void;
    render(): JSX.Element;
    private _convertCustomTransitionConfig(config);
    private _buildTransitionSpec(state);
    private _onTransitionEnd;
    private _onTransitionStart;
    private _renderScene;
    handleBackPress(): void;
    processCommand(commandQueue: NavigationCommand[]): void;
    /**
     * This method is going to be deprecated in later releases
    */
    private _onNavigateBack;
    private _createState(route);
    private _createParentState(routes, prevState);
    private _popToTop(state);
    private _popN(state, n);
    private _popToRoute(state, route);
}
export default NavigatorExperimentalDelegate;
