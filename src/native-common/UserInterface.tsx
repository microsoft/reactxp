/**
* UserInterface.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN implementation of the ReactXP interfaces related to
* UI (layout measurements, etc.).
*/

import assert = require('assert');
import React = require('react');
import RN = require('react-native');
import SyncTasks = require('synctasks');

import MainViewStore from './MainViewStore';
import RX = require('../common/Interfaces');
import Types = require('../common/Types');

export class UserInterface extends RX.UserInterface {
    private _touchLatencyThresholhdMs: number|undefined;
    private _isNavigatingWithKeyboard: boolean = false;
    private _rootViewUsingPropsFactory: RN.ComponentProvider | undefined;

    constructor() {
        super();
        RN.Dimensions.addEventListener('change', (event) => {
            this.contentSizeMultiplierChangedEvent.fire(event.window.fontScale);
        });
        this.keyboardNavigationEvent.subscribe(this._keyboardNavigationStateChanged);
    }

    measureLayoutRelativeToWindow(component: React.Component<any, any>):
        SyncTasks.Promise<Types.LayoutInfo> {

        let deferred = SyncTasks.Defer<Types.LayoutInfo>();
        let nodeHandle = RN.findNodeHandle(component);

        assert.ok(!!nodeHandle);
        RN.NativeModules.UIManager.measureInWindow(
            nodeHandle, (x: number, y: number, width: number, height: number) => {
                deferred.resolve({
                    x: x,
                    y: y,
                    width: width,
                    height: height
                });
            }
        );

        return deferred.promise();
    }

    measureLayoutRelativeToAncestor(component: React.Component<any, any>,
        ancestor: React.Component<any, any>): SyncTasks.Promise<Types.LayoutInfo> {

        let deferred = SyncTasks.Defer<Types.LayoutInfo>();
        let nodeHandle = RN.findNodeHandle(component);
        let ancestorNodeHander = RN.findNodeHandle(ancestor);

        RN.NativeModules.UIManager.measureLayout(
            nodeHandle, ancestorNodeHander, () => {
                deferred.reject('UIManager.measureLayout() failed');
            },
            (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
                deferred.resolve({
                    x: x,
                    y: y,
                    width: width,
                    height: height
                });
            }
        );

        return deferred.promise();
    }

    measureWindow(rootViewId?: string): Types.LayoutInfo {
        let dimensions = RN.Dimensions.get('window');

        if (rootViewId && RN.Platform.OS === 'windows') {
            try {
                dimensions = RN.Dimensions.get(rootViewId);
            } catch (e) {
                // Can happen if RNW doesn't support multi view dimensions tracking yet
                console.warn('Couldn\'t get dimensions for rootViewId ' + rootViewId +
                 ' check if RNW already supports multi view dimensions tracking');
            }
        }

        return {
            x: 0,
            y: 0,
            width: dimensions.width,
            height: dimensions.height
        };
    }

    getContentSizeMultiplier(): SyncTasks.Promise<number> {
        let deferred = SyncTasks.Defer<number>();

        // TODO: #727532 Remove conditional after implementing UIManager.getContentSizeMultiplier for UWP
        // TODO:(alregner) Remove conditional after implementing UIManager.getContentSizeMultiplier for macos
        if (RN.Platform.OS === 'windows' || RN.Platform.OS === 'macos') {
            deferred.resolve(1);
        } else {
            deferred.resolve(RN.PixelRatio.getFontScale());
        }

        return deferred.promise();
    }

    getMaxContentSizeMultiplier(): SyncTasks.Promise<number> {
        let deferred = SyncTasks.Defer<number>();

        // TODO: #727532 Remove conditional after implementing UIManager.getContentSizeMultiplier for UWP
        // TODO:(alregner) Remove conditional after implementing UIManager.getContentSizeMultiplier for macos
        if (RN.Platform.OS === 'windows' || RN.Platform.OS === 'macos') {
            deferred.resolve(1);
        } else {
            RN.NativeModules.UIManager.getMaxContentSizeMultiplier((value: number) => {
                deferred.resolve(value);
            });
        }

        return deferred.promise();
    }

    setMaxContentSizeMultiplier(maxContentSizeMultiplier: number): void {
        // TODO: #727532 Remove conditional after implementing UIManager.getContentSizeMultiplier for UWP
        // TODO:(alregner) Remove conditional after implementing UIManager.getContentSizeMultiplier for macos
        if (RN.Platform.OS !== 'windows' && RN.Platform.OS !== 'macos') {
            RN.NativeModules.UIManager.setMaxContentSizeMultiplier(maxContentSizeMultiplier);
        }
    }

    useCustomScrollbars(enable = true) {
        // Nothing to do
    }

    dismissKeyboard() {
        RN.TextInput.State.blurTextInput(RN.TextInput.State.currentlyFocusedField());
    }

    isHighPixelDensityScreen() {
        let ratio = RN.PixelRatio.get();
        let isHighDef = ratio > 1;
        return isHighDef;
    }

    getPixelRatio(): number {
        return RN.PixelRatio.get();
    }

    setMainView(element: React.ReactElement<any>) {
        MainViewStore.setMainView(element);
    }

    registerRootViewUsingPropsFactory(factory: RN.ComponentProvider) {
        this._rootViewUsingPropsFactory = factory;
    }

    registerRootView(viewKey: string, getComponentFunc: Function) {
        if (this._rootViewUsingPropsFactory) {
            const RootViewUsingProps = this._rootViewUsingPropsFactory();
            RN.AppRegistry.registerComponent(viewKey, () => {
                class RootViewWrapper extends React.Component<any, any> {
                    render() {
                        return (
                            <RootViewUsingProps
                                reactxp_mainViewType={ getComponentFunc() }
                                { ...this.props }
                            />
                        );
                    }
                }

                return RootViewWrapper;
            });
        }
    }

    renderMainView() {
        // Nothing to do
    }

    enableTouchLatencyEvents(latencyThresholdMs: number): void {
        this._touchLatencyThresholhdMs = latencyThresholdMs;
    }

    evaluateTouchLatency(e: Types.SyntheticEvent) {
        if (this._touchLatencyThresholhdMs) {
            const latency = Date.now() - e.timeStamp.valueOf();
            if (latency > this._touchLatencyThresholhdMs) {
                this.touchLatencyEvent.fire(latency);
            }
        }
    }

    isNavigatingWithKeyboard(): boolean {
        return this._isNavigatingWithKeyboard;
    }

    private _keyboardNavigationStateChanged = (isNavigatingWithKeyboard: boolean) => {
        this._isNavigatingWithKeyboard = isNavigatingWithKeyboard;
    }
}

export default new UserInterface();
