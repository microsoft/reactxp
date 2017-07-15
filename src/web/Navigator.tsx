/*
* Navigator.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web specific implementation of Navigator. This is inspired from React.Navigator.
* This component is set with props, which are callback methods. It is primarily driven
* by state updates instigated by its public helpers like immediatelyResetRouteStack, push,
* pop, which update the state and cause transitions.
*/

import _ = require('./utils/lodashMini');
import React = require('react');
import ReactDOM = require('react-dom');
import rebound = require('rebound');

import { NavigatorSceneConfigFactory } from './NavigatorSceneConfigFactory';
import { NavigatorSceneConfig }  from './NavigatorSceneConfigFactory';
import RX = require('../common/Interfaces');
import Styles from './Styles';
import Types = require('../common/Types');
import View from './View';

// [Bug:506870] Move web navigator to RX animated API
export interface SpringSystem {
    createSpring(): any;
}

export interface Spring {
    setRestSpeedThreshold?: (restSpeed: number) => void;
    setCurrentValue?: (val: number) => any;
    addListener?: (obj: any) => any;
    getCurrentValue? (): any;
    setOvershootClampingEnabled? (a: boolean): void;
    getSpringConfig? (): any;
    setVelocity?(velocity: any): any;
    setEndValue?(endVal: number): any;
}

// Default styles
const _styles = {
    container: Styles.createViewStyle({
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'stretch',
        overflow: 'hidden'
    }),
    defaultSceneStyle: Styles.createViewStyle({
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
    }),
    baseScene: Styles.createViewStyle({
        position: 'absolute',
        overflow: 'hidden',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
    }),
    disabledScene: Styles.createViewStyle({
        top: 0,
        bottom: 0,
        flex: 1
    }),
    transitioner: Styles.createViewStyle( {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
        overflow: 'hidden',
        alignItems: 'stretch'
    }),
    sceneStyle: Styles.createViewStyle({
        flex: 1,
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 40,
        shadowColor: 'rgba(0, 0, 0, 0.2)'
    })
};

// Transition types
export type TransitionToCallback = () => void;
export type ReplaceAtIndexCallback = () => void;

export interface TransitionToQueueItem {
    // The destination route index.
    destIndex: number;

    // The callback to call after this transition is finished.
    transitionFinished: TransitionToCallback;

    // This velocity will be passed to the spring system for transitioning. If no velocity is specified, a default value
    // will be used.
    velocity: number;
}

export interface NavigatorState {
    // Current stack of animation configurations for a scene
    sceneConfigStack?: NavigatorSceneConfig[];

    // The current stack of user-defined route objects.
    routeStack?: Types.NavigatorRoute[];

    // The currently presented route index.
    presentedIndex?: number;

    // During transition, the presentedIndex will be updated at the beginning and transitionFromIndex will be set to the
    // previous index.
    transitionFromIndex?: number;

    // If told to transition while another transition is occurring, it will be added to this queue and executed after.
    transitionQueue?: TransitionToQueueItem[];

    // The callback to call after the current transition is finished.
    transitionFinished?: TransitionToCallback;
}

export class Navigator extends React.Component<Types.NavigatorProps, NavigatorState> {
    // Keep a map of all rendered scenes, keyed off their routeId
    private _renderedSceneMap: { [routeId: number]: JSX.Element } = {};

    // Save a public reference to the parent navigator if one was given in props.
    navigatorReference: Navigator;

    // [Bug:506870] Move web navigator to RX animated API
    // Spring system and spring used for transitions.
    springSystem: SpringSystem;
    spring: Spring;

    // Cache the dimensions of the navigator so scenes can transition with that size in mind.
    private _dimensions: Types.Dimensions;

    // Receives initial props and sets initial state for Navigator
    constructor(initialProps?: Types.NavigatorProps) {
        super(initialProps);

        // Default navigator state
        this.state = {
            sceneConfigStack: [],
            routeStack: [],
            presentedIndex: 0,
            transitionFromIndex: undefined,
            transitionQueue: []
        };
    }

    componentWillMount() {
        this.springSystem = new rebound.SpringSystem();
        this.spring = this.springSystem.createSpring();
        this.spring.setRestSpeedThreshold(0.05);
        this.spring.setCurrentValue(0).setAtRest();
        this.spring.addListener({
            onSpringUpdate: () => {
                this._handleSpringUpdate();
            },
            onSpringAtRest: () => {
                this._completeTransition();
            }
        });
    }

    componentDidMount() {
        this._updateDimensionsCache();
        this._handleSpringUpdate();
    }

    componentDidUpdate() {
        this._updateDimensionsCache();
    }

    render() {
        let newRenderedSceneMap: { [routeId: number]: JSX.Element } = {};
        let scenes: JSX.Element[];

        if (this.state.routeStack.length > 0) {
            scenes = this.state.routeStack.map((route, index) => {
                let renderedScene: JSX.Element;

                if (this._renderedSceneMap[route.routeId] &&
                    index !== this.state.presentedIndex) {
                    renderedScene = this._renderedSceneMap[route.routeId];
                } else {
                    renderedScene = this._renderNavigatorScene(route, index);
                }

                newRenderedSceneMap[route.routeId] = renderedScene;

                return renderedScene;
            });
        } else {
            scenes = [];
        }

        this._renderedSceneMap = _.clone(newRenderedSceneMap);

        return (
            <View
                key={ 'container' }
                style={ _styles.container }
            >
                <View
                    style={ _styles.transitioner }
                    ref={ 'transitioner' }
                >
                    { scenes }
                </View>
            </View>
        );
    }

    // Public Navigator Helper methods. These methods modify Navigator state, which kicks of
    // re-renders for the Navigator
    jumpTo(route: Types.NavigatorRoute): void {
        const destIndex = this.state.routeStack.indexOf(route);
        this._jumpN(destIndex - this.state.presentedIndex);
    }

    jumpForward(): void {
        this._jumpN(1);
    }

    jumpBack(): void {
        this._jumpN(-1);
    }

    push(route: Types.NavigatorRoute): void {
        this._invariant(!!route, 'Must supply route to push');
        const activeLength = this.state.presentedIndex + 1;
        const activeStack = this.state.routeStack.slice(0, activeLength);
        const activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength);
        const nextStack = activeStack.concat([route]);
        const destIndex = nextStack.length - 1;
        const nextAnimationConfigStack: NavigatorSceneConfig [] = activeAnimationConfigStack.concat([
            this._getSceneConfigFromRoute(route)
        ]);

        this.setState({
            routeStack: nextStack,
            sceneConfigStack: nextAnimationConfigStack
        }, () => {
            this._enableScene(destIndex);
            this._transitionTo(destIndex);
        });
    }

    immediatelyResetRouteStack(nextRouteStack: Types.NavigatorRoute[]): void {
        const destIndex = nextRouteStack.length - 1;

        this.setState({
            // Build a sceneConfigStack
            sceneConfigStack: _.map(nextRouteStack, route => this._getSceneConfigFromRoute(route)),
            routeStack: nextRouteStack,
            presentedIndex: destIndex,
            transitionFromIndex: undefined,
            transitionQueue: []
        }, () => {
            this._handleSpringUpdate();
        });
    }

    pop(): void {
        if (this.state.transitionQueue.length) {
            // This is the workaround to prevent user from firing multiple `pop()` calls that may pop the routes beyond
            // the limit. Because `this.state.presentedIndex` does not update until the transition starts, we can't
            // reliably use `this.state.presentedIndex` to know whether we can safely keep popping the routes or not at
            // this moment.
            return;
        }

        if (this.state.presentedIndex > 0) {
            this._popN(1);
        }
    }

    // This method replaces the route at the given index of the stack and pops to that index.
    replaceAtIndex(route: Types.NavigatorRoute, index: number): void {
        this._invariant(!!route, 'Must supply route to replace');

        if (index < 0) {
            index += this.state.routeStack.length;
        }

        if (this.state.routeStack.length <= index) {
            return;
        }

        let nextRouteStack = this.state.routeStack.slice(0, index + 1);
        let nextAnimationModeStack = this.state.sceneConfigStack.slice(0, index + 1);
        nextRouteStack[index] = route;
        nextAnimationModeStack[index] = this._getSceneConfigFromRoute(route);

        this.setState({
            routeStack: nextRouteStack,
            sceneConfigStack: nextAnimationModeStack
        });
    }

    replace(route: Types.NavigatorRoute): void {
        this.replaceAtIndex(route, this.state.presentedIndex);
    }

    replacePrevious(route: Types.NavigatorRoute): void {
        this.replaceAtIndex(route, this.state.presentedIndex - 1);
    }

    popToTop(): void {
        this.popToRoute(this.state.routeStack[0]);
    }

    popToRoute(route: Types.NavigatorRoute): void {
        const indexOfRoute = this.state.routeStack.indexOf(route);
        this._invariant(indexOfRoute !== -1, 'Calling popToRoute for a route that doesn\'t exist!');

        const numToPop = this.state.presentedIndex - indexOfRoute;
        this._popN(numToPop);
    }

    replacePreviousAndPop(route: Types.NavigatorRoute): void {
        if (this.state.routeStack.length < 2) {
            return;
        }

        this.replacePrevious(route);
        this.pop();
    }

    getCurrentRoutes(): Types.NavigatorRoute[] {
        // Clone before returning to avoid caller mutating the stack.
        return this.state.routeStack.slice();
    }

    private _updateDimensionsCache() {
        const transitioner = ReactDOM.findDOMNode(this.refs['transitioner']) as HTMLElement;
        this._dimensions = {
            width: transitioner.offsetWidth,
            height: transitioner.offsetHeight
        };
    }

    // Helper method to extract Navigator's Scene config from the route
    private _getSceneConfigFromRoute(route: Types.NavigatorRoute): NavigatorSceneConfig {
        // route exists? query the factory to generate a scene configuration
        if (route) {
            return NavigatorSceneConfigFactory.createConfig(route.sceneConfigType);
        }
        return undefined;
    }

    // Render a scene for the navigator
    private _renderNavigatorScene(route: Types.NavigatorRoute, index: number): JSX.Element {
        let styles: Types.ViewStyleRuleSet[] = [_styles.baseScene, _styles.sceneStyle,
             _styles.defaultSceneStyle];

        if (index !== this.state.presentedIndex) {
            // update styles
            styles.push(_styles.disabledScene);
        }

        // Wraps the callback passed as a prop to Navigator to render the scene
        return (
            <View
                key={ 'scene_' + this._getRouteID(route) }
                ref={ 'scene_' + index }
                style={ styles }
            >
                { this.props.renderScene(route) }
            </View>
        );
    }

    // Push a scene below the others so they don't block touches sent to the presented scenes.
    private _disableScene(sceneIndex: number) {
        if (this.refs['scene_' + sceneIndex]) {
            this._setNativeStyles(this.refs['scene_' + sceneIndex] as View, {
                opacity: 0,
                zIndex: -10
            });
        }
    }

    // Add styles on the scene - At this time, the scene should be mounted and sitting in the
    // DOM. We are just adding giving styles to this current scene.
    private _enableScene(sceneIndex: number) {
        let sceneStyle = Styles.combine([_styles.baseScene, _styles.sceneStyle, _styles.defaultSceneStyle]) as any;

        // Then restore the top value for this scene.
        const enabledSceneNativeProps = {
            style: {
                top: sceneStyle['top'],
                bottom: sceneStyle['bottom'],
                zIndex: 0
            }
        };

        if (sceneIndex !== this.state.transitionFromIndex &&
            sceneIndex !== this.state.presentedIndex) {
            // If we are not in a transition from this index, make sure opacity is 0 to prevent the enabled scene from
            // flashing over the presented scene.
            (enabledSceneNativeProps.style as any).opacity = 0;
        }

        if (this.refs['scene_' + sceneIndex]) {
            this._setNativeStyles(this.refs['scene_' + sceneIndex] as View, enabledSceneNativeProps.style);
        }
    }

    private _transitionTo(destIndex: number, velocity?: number, jumpSpringTo?: number, cb?: TransitionToCallback) {
        // If we're already presenting this index, bail here.
        if (destIndex === this.state.presentedIndex) {
            return;
        }

        // If we're already transitioning to another index, queue this one.
        if (this.state.transitionFromIndex !== undefined) {
            let newTransitionQueue = _.cloneDeep(this.state.transitionQueue);
            newTransitionQueue.push({
                destIndex: destIndex,
                velocity: velocity,
                transitionFinished: cb
            });
            // set new transition queue
            this.setState ({ transitionQueue: newTransitionQueue });
            return;
        }

        // Set new state values.
        this.state.transitionFromIndex = this.state.presentedIndex;
        this.state.presentedIndex = destIndex;
        this.state.transitionFinished = cb;

        // Grab the scene config from the route we're leaving.
        const sceneConfig = this.state.sceneConfigStack[this.state.transitionFromIndex] ||
            this.state.sceneConfigStack[this.state.presentedIndex];
        this._invariant(!!sceneConfig, 'Cannot configure scene at index ' + this.state.transitionFromIndex);

        // Set the spring in motion. Updates will trigger _handleSpringUpdate.
        if (jumpSpringTo !== undefined) {
            this.spring.setCurrentValue(jumpSpringTo);
        }
        this.spring.setOvershootClampingEnabled(true);
        this.spring.getSpringConfig().friction = sceneConfig.springFriction;
        this.spring.getSpringConfig().tension = sceneConfig.springTension;
        this.spring.setVelocity(velocity || sceneConfig.defaultTransitionVelocity);
        this.spring.setEndValue(1);

        if (this.props.transitionStarted) {
            this.props.transitionStarted();
        }
    }

    private _completeTransition() {
        let newState: NavigatorState = {};

        this.state.transitionFromIndex = undefined;
        this.spring.setCurrentValue(0).setAtRest();
        this._hideScenes();

        // Do we have pending transitions? trigger transitions then
        if (this.state.transitionQueue.length) {
            let newTransitionQueue = _.cloneDeep(this.state.transitionQueue);
            const queuedTransition = newTransitionQueue.shift();

            // add styles on the scene we are about to transition to
            this._enableScene(queuedTransition.destIndex);

            this._transitionTo(
                queuedTransition.destIndex,
                queuedTransition.velocity,
                undefined,
                queuedTransition.transitionFinished
            );

            if (this.state.transitionFinished) {
                this.state.transitionFinished();
                newState.transitionFinished = undefined;
            }

            newState.transitionQueue = newTransitionQueue;

            // New setState
            this.setState(newState);
        } else if (this.props.transitionCompleted) {
            this.props.transitionCompleted();
        }
    }

    private _hideScenes() {
        for (let i = 0; i < this.state.routeStack.length; i++) {
            if (i === this.state.presentedIndex ||
                i === this.state.transitionFromIndex) {
                continue;
            }

            this._disableScene(i);
        }
    }

    // This happens for each frame of either a gesture or a transition. If both are happening, we only set values for
    // the transition and the gesture will catch up later.
    private _handleSpringUpdate() {
        // Prioritize handling transition in progress over a gesture:
        if (this.state.transitionFromIndex !== undefined) {
            this._transitionBetween(
                this.state.transitionFromIndex,
                this.state.presentedIndex,
                this.spring.getCurrentValue()
            );
        }
    }

    private _transitionSceneStyle(fromIndex: number, toIndex: number, progress: number, index: number) {
        const viewAtIndex = this.refs['scene_' + index] as View;
        if (viewAtIndex === undefined) {
            return;
        }

        // Use toIndex animation when we move forwards. Use fromIndex when we move back.
        const sceneConfigIndex = fromIndex < toIndex ? toIndex : fromIndex;
        let sceneConfig = this.state.sceneConfigStack[sceneConfigIndex];

        // This happens for overswiping when there is no scene at toIndex.
        if (!sceneConfig) {
            sceneConfig = this.state.sceneConfigStack[sceneConfigIndex - 1];
        }

        let styleToUse: Types.ViewStyleRuleSet = {};
        const useFn = index < fromIndex || index < toIndex ?
            sceneConfig.animationInterpolators.out :
            sceneConfig.animationInterpolators.into;
        const directionAdjustedProgress = fromIndex < toIndex ? progress : 1 - progress;
        const didChange = useFn(styleToUse, this._dimensions, directionAdjustedProgress);
        if (didChange) {
            this._setNativeStyles(viewAtIndex, styleToUse);
        }
    }

    private _transitionBetween(fromIndex: number, toIndex: number, progress: number) {
        this._transitionSceneStyle(fromIndex, toIndex, progress, fromIndex);
        this._transitionSceneStyle(fromIndex, toIndex, progress, toIndex);
    }

    private _getDestIndexWithinBounds(n: number) {
        const currentIndex = this.state.presentedIndex;
        const destIndex = currentIndex + n;
        this._invariant(destIndex >= 0, 'Cannot jump before the first route.');

        const maxIndex = this.state.routeStack.length - 1;
        this._invariant(maxIndex >= destIndex, 'Cannot jump past the last route.');

        return destIndex;
    }

    private _jumpN(n: number) {
        const destIndex = this._getDestIndexWithinBounds(n);
        this._invariant(destIndex !== -1, 'Cannot jump to route that is not in the route stack');

        this._enableScene(destIndex);
        this._transitionTo(destIndex);
    }

    private _popN(n: number) {
        if (n === 0) {
            return;
        }

        this._invariant(this.state.presentedIndex - n >= 0, 'Cannot pop below zero');

        const popIndex = this.state.presentedIndex - n;
        this._enableScene(popIndex);

        this._transitionTo(
            popIndex,
            undefined, // default velocity
            undefined, // no spring jumping
            () => {
                this._cleanScenesPastIndex(popIndex);
            }
        );
    }

    private _cleanScenesPastIndex(index: number) {
        const newStackLength = index + 1;

        // Remove any unneeded rendered routes.
        if (newStackLength < this.state.routeStack.length) {
            this.setState({
                sceneConfigStack: this.state.sceneConfigStack.slice(0, newStackLength),
                routeStack: this.state.routeStack.slice(0, newStackLength)
            });
        }
    }

    // Get routeId for the incoming route
    private _getRouteID(route: Types.NavigatorRoute): number {
        return route.routeId;
    }

    // Define an inconstiant method like React.Navigator
    private _invariant(test: boolean, failureMessage: string) {
        if (!test) {
            throw failureMessage;
        }
    }

    // Manually override the styles in the DOM for the given component. This method is a hacky equivalent of React Native's
    // setNativeProps.
    private _setNativeStyles(component: RX.View, currentStyles: any) {
        // Grab the actual element from the DOM.
        let element = ReactDOM.findDOMNode(component) as HTMLElement;
        const flatStyles: Types.ViewStyleRuleSet = _.isArray(currentStyles) ? _.flatten(currentStyles) : currentStyles;

        // Modify styles
        _.assign(element.style, flatStyles);
    }
}

export default Navigator;
