/**
* UserInterface.ts
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
    constructor() {
        super();

        RN.DeviceEventEmitter.addListener('didUpdateContentSizeMultiplier', (newValue: number) => {
            this.contentSizeMultiplierChangedEvent.fire(newValue);
        });
    }

    measureLayoutRelativeToWindow(component: React.Component<any, any>):
        SyncTasks.Promise<Types.LayoutInfo> {

        let deferred = SyncTasks.Defer<Types.LayoutInfo>();
        let nodeHandle = RN.findNodeHandle(component);

        assert.ok(!!nodeHandle);
        RN.NativeModules.UIManager.measureInWindow(
            nodeHandle, (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
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

    measureWindow(): Types.LayoutInfo {
        const dimensions = RN.Dimensions.get('window');
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
        if (RN.Platform.OS === 'windows') {
            deferred.resolve(1);
        } else {
            RN.NativeModules.UIManager.getContentSizeMultiplier((value: number) => {
                deferred.resolve(value);
            });
        }

        return deferred.promise();
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

    renderMainView() {
        // Nothing to do
    }
}

export default new UserInterface();
