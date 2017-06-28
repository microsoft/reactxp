/**
* UserInterface.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the ReactXP interfaces related to
* UI (layout measurements, etc.).
*/

import React = require('react');
import ReactDOM = require('react-dom');
import ScrollViewConfig from './ScrollViewConfig';
import SyncTasks = require('synctasks');

import { default as FrontLayerViewManager } from './FrontLayerViewManager';
import RX = require('../common/Interfaces');
import Types = require('../common/Types');

export class UserInterface extends RX.UserInterface {
    private _isNavigatingWithKeyboard: boolean = false;

    constructor() {
        super();
        this.keyboardNavigationEvent.subscribe(this._keyboardNavigationStateChanged);
    }

    measureLayoutRelativeToWindow(component: React.Component<any, any>) :
            SyncTasks.Promise<Types.LayoutInfo> {

        let deferred = SyncTasks.Defer<Types.LayoutInfo>();

        const componentDomNode = ReactDOM.findDOMNode<HTMLElement>(component);

        if (!componentDomNode) {
            deferred.reject('measureLayoutRelativeToWindow failed');
        } else {
            const componentBoundingRect = componentDomNode.getBoundingClientRect();

            deferred.resolve({
                x: componentBoundingRect.left,
                y: componentBoundingRect.top,
                width: componentBoundingRect.width,
                height: componentBoundingRect.height
            });
        }

        return deferred.promise();
    }

    measureLayoutRelativeToAncestor(component: React.Component<any, any>,
        ancestor: React.Component<any, any>) : SyncTasks.Promise<Types.LayoutInfo> {

        let deferred = SyncTasks.Defer<Types.LayoutInfo>();

        const componentDomNode = ReactDOM.findDOMNode<HTMLElement>(component);
        const ancestorDomNode = ReactDOM.findDOMNode<HTMLElement>(ancestor);

        if (!componentDomNode || !ancestorDomNode) {
            deferred.reject('measureLayoutRelativeToAncestor failed');
        } else {
            const componentBoundingRect = componentDomNode.getBoundingClientRect();
            const ancestorBoundingRect = ancestorDomNode.getBoundingClientRect();

            deferred.resolve({
                x: componentBoundingRect.left - ancestorBoundingRect.left,
                y: componentBoundingRect.top - ancestorBoundingRect.top,
                width: componentBoundingRect.width,
                height: componentBoundingRect.height
            });
        }

        return deferred.promise();
    }

    measureWindow(): Types.LayoutInfo {
        return {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    getContentSizeMultiplier(): SyncTasks.Promise<number> {
        // Browsers don't support font-specific scaling. They scale all of their
        // UI elements the same.
        return SyncTasks.Resolved(1);
    }

    getMaxContentSizeMultiplier(): SyncTasks.Promise<number> {
        // Browsers don't support font-specific scaling. They scale all of their
        // UI elements the same.
        return SyncTasks.Resolved(0);
    }

    setMaxContentSizeMultiplier(maxContentSizeMultiplier: number) {
        // Browsers don't support font-specific scaling. They scale all of their
        // UI elements the same.
        // No-op.
    }

    isHighPixelDensityScreen(): boolean {
        return this.getPixelRatio() > 1;
    }

    getPixelRatio(): number {
        var pixelRatio = 0;
        if (window.devicePixelRatio) {
            pixelRatio = window.devicePixelRatio;
        }

        return pixelRatio;
    }

    setMainView(element: React.ReactElement<any>): void {
        FrontLayerViewManager.setMainView(element);
    }

    useCustomScrollbars(enable = true) {
        ScrollViewConfig.setUseCustomScrollbars(enable);
    }

    dismissKeyboard() {
        // Nothing to do
    }

    enableTouchLatencyEvents(latencyThresholdMs: number): void {
        // Nothing to do
    }

    evaluateTouchLatency(e: Types.MouseEvent) {
        // Nothing to do
    }

    isNavigatingWithKeyboard(): boolean {
        return this._isNavigatingWithKeyboard;
    }

    private _keyboardNavigationStateChanged = (isNavigatingWithKeyboard: boolean) => {
        this._isNavigatingWithKeyboard = isNavigatingWithKeyboard;
    }
}

export default new UserInterface();
