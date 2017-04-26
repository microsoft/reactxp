import { NavigatorSceneConfig } from './NavigatorSceneConfigFactory';
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export interface SpringSystem {
    createSpring(): any;
}
export interface Spring {
    setRestSpeedThreshold?: (restSpeed: number) => void;
    setCurrentValue?: (val: number) => any;
    addListener?: (obj: any) => any;
    getCurrentValue?(): any;
    setOvershootClampingEnabled?(a: boolean): void;
    getSpringConfig?(): any;
    setVelocity?(velocity: any): any;
    setEndValue?(endVal: number): any;
}
export declare type TransitionToCallback = () => void;
export declare type ReplaceAtIndexCallback = () => void;
export interface TransitionToQueueItem {
    destIndex: number;
    transitionFinished: TransitionToCallback;
    velocity: number;
}
export interface NavigatorState {
    sceneConfigStack?: NavigatorSceneConfig[];
    routeStack?: Types.NavigatorRoute[];
    presentedIndex?: number;
    transitionFromIndex?: number;
    transitionQueue?: TransitionToQueueItem[];
    transitionFinished?: TransitionToCallback;
}
export declare class Navigator extends RX.Navigator<NavigatorState> {
    private _renderedSceneMap;
    navigatorReference: Navigator;
    springSystem: SpringSystem;
    spring: Spring;
    private _dimensions;
    constructor(initialProps?: Types.NavigatorProps);
    componentWillMount(): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
    jumpTo(route: Types.NavigatorRoute): void;
    jumpForward(): void;
    jumpBack(): void;
    push(route: Types.NavigatorRoute): void;
    immediatelyResetRouteStack(nextRouteStack: Types.NavigatorRoute[]): void;
    pop(): void;
    replaceAtIndex(route: Types.NavigatorRoute, index: number): void;
    replace(route: Types.NavigatorRoute): void;
    replacePrevious(route: Types.NavigatorRoute): void;
    popToTop(): void;
    popToRoute(route: Types.NavigatorRoute): void;
    replacePreviousAndPop(route: Types.NavigatorRoute): void;
    getCurrentRoutes(): Types.NavigatorRoute[];
    private _updateDimensionsCache();
    private _getSceneConfigFromRoute(route);
    private _renderNavigatorScene(route, index);
    private _disableScene(sceneIndex);
    private _enableScene(sceneIndex);
    private _transitionTo(destIndex, velocity?, jumpSpringTo?, cb?);
    private _completeTransition();
    private _hideScenes();
    private _handleSpringUpdate();
    private _transitionSceneStyle(fromIndex, toIndex, progress, index);
    private _transitionBetween(fromIndex, toIndex, progress);
    private _getDestIndexWithinBounds(n);
    private _jumpN(n);
    private _popN(n);
    private _cleanScenesPastIndex(index);
    private _getRouteID(route);
    private _invariant(test, failureMessage);
    private _setNativeStyles(component, currentStyles);
}
export default Navigator;
