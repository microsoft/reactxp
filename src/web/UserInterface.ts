/**
 * UserInterface.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the ReactXP interfaces related to
 * UI (layout measurements, etc.).
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as SyncTasks from 'synctasks';

import FrontLayerViewManager from './FrontLayerViewManager';
import * as RX from '../common/Interfaces';
import ScrollViewConfig from './ScrollViewConfig';

export class UserInterface extends RX.UserInterface {
    private _isNavigatingWithKeyboard = false;

    constructor() {
        super();
        this.keyboardNavigationEvent.subscribe(this._keyboardNavigationStateChanged);
    }

    measureLayoutRelativeToWindow(component: React.Component<any, any>) :
            SyncTasks.Promise<RX.Types.LayoutInfo> {

        const deferred = SyncTasks.Defer<RX.Types.LayoutInfo>();
        let componentDomNode: HTMLElement | null = null;

        try {
            componentDomNode = ReactDOM.findDOMNode(component) as HTMLElement | null;
        } catch {
            // Component is no longer mounted.
        }

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
        ancestor: React.Component<any, any>) : SyncTasks.Promise<RX.Types.LayoutInfo> {

        const deferred = SyncTasks.Defer<RX.Types.LayoutInfo>();
        let componentDomNode: HTMLElement | null = null;
        let ancestorDomNode: HTMLElement | null = null;

        try {
            componentDomNode = ReactDOM.findDOMNode(component) as HTMLElement | null;
            ancestorDomNode = ReactDOM.findDOMNode(ancestor) as HTMLElement | null;
        } catch {
            // Components are no longer mounted.
        }

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

    measureWindow(rootViewId?: string): RX.Types.LayoutInfo {
        // Mo multi window support, default to main window
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
        let pixelRatio = 0;
        if (window.devicePixelRatio) {
            pixelRatio = window.devicePixelRatio;
        }

        return pixelRatio;
    }

    setMainView(element: React.ReactElement<any>): void {
        FrontLayerViewManager.setMainView(element);
    }

    registerRootView(viewKey: string, getComponentFunc: Function) {
        // Nothing to do
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

    evaluateTouchLatency(e: RX.Types.MouseEvent) {
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
