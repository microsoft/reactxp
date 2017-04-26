import { NavigationCommand, NavigatorDelegate, NavigatorState } from './NavigatorCommon';
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class NavigatorStandardDelegate extends NavigatorDelegate {
    private _navigator;
    constructor(navigator: RX.Navigator<NavigatorState>);
    getRoutes(): Types.NavigatorRoute[];
    immediatelyResetRouteStack(nextRouteStack: Types.NavigatorRoute[]): void;
    render(): JSX.Element;
    private _renderScene;
    handleBackPress(): void;
    private _configureNativeScene;
    private _onRouteWillFocus;
    private _onRouteDidFocus;
    processCommand(commandQueue: NavigationCommand[]): void;
}
export default NavigatorStandardDelegate;
