/**
* FocusManager.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Manages focusable elements for better keyboard navigation.
*/

import React = require('react');
import ReactDOM = require('react-dom');
import PropTypes = require('prop-types');
import Types = require('../../common/Types');

let _lastComponentId: number = 0;

interface StoredFocusableComponent {
    component: React.Component<any, any>;
    restricted?: boolean;
    origTabIndex?: number;
}

export class FocusManager {
    private static rootFocusManager: FocusManager;
    private static restrictionStack: FocusManager[] = [];
    private static currentRestrictionOwner: FocusManager;

    private static allFocusableComponents: {[id: string]: StoredFocusableComponent} = {};

    private myFocusableComponentIds: {[id: string]: boolean} = {};

    private isRoot: boolean;

    setAsRootFocusManager() {
        FocusManager.rootFocusManager = this;
        this.isRoot = true;
    }

    // Whenever the focusable element is mounted, we let the application
    // know so that FocusManager could account for this element during the
    // focus restriction.
    addFocusableComponent(component: React.Component<any, any>): string {
        let componentId: string = 'fc-' + ++_lastComponentId;

        FocusManager.allFocusableComponents[componentId] = {
            component: component
        };

        if (!this.isRoot) {
            this.myFocusableComponentIds[componentId] = true;
        }

        if (FocusManager.currentRestrictionOwner && (this !== FocusManager.currentRestrictionOwner)) {
            // New focusable element is mounted but it's not in the scope of the
            // current view with restrictFocusWithin property.
            FocusManager.restrictComponentFocus(componentId);
        }

        return componentId;
    }

    removeFocusableComponent(componentId: string) {
        FocusManager.removeComponentFocusRestriction(componentId);
        delete this.myFocusableComponentIds[componentId];
        delete FocusManager.allFocusableComponents[componentId];
    }

    restrictFocusWithin() {
        // Limit the focus received by the keyboard navigation to all
        // the descendant focusable elements by setting tabIndex of all
        // other elements to -1.
        if (FocusManager.currentRestrictionOwner === this) {
            return;
        }

        if (FocusManager.currentRestrictionOwner) {
            FocusManager.removeFocusRestriction();
        }

        FocusManager.restrictionStack.push(this);
        FocusManager.currentRestrictionOwner = this;

        Object.keys(FocusManager.allFocusableComponents).forEach(componentId => {
            if (!(componentId in this.myFocusableComponentIds)) {
                FocusManager.restrictComponentFocus(componentId);
            }
        });
    }

    release() {
        // When the view is unmounted, restore the focus to the previous view with
        // restrictFocusWithin or remove the restriction if there is no such view.
        FocusManager.restrictionStack = FocusManager.restrictionStack.filter(focusManager => {
            return focusManager !== this;
        });

        if (FocusManager.currentRestrictionOwner === this) {
            FocusManager.removeFocusRestriction();
            FocusManager.currentRestrictionOwner = FocusManager.restrictionStack[FocusManager.restrictionStack.length - 1];

            if (FocusManager.currentRestrictionOwner) {
                FocusManager.currentRestrictionOwner.restrictFocusWithin();
            }
        }
    }

    private static removeFocusRestriction() {
        Object.keys(FocusManager.allFocusableComponents).forEach(componentId => {
            FocusManager.removeComponentFocusRestriction(componentId);
        });
    }

    private static setTabIndex(component: React.Component<any, any>, value: number): number {
        let el = ReactDOM.findDOMNode<HTMLElement>(component);

        if (el) {
            let prev = el.hasAttribute('tabindex') ? el.tabIndex : undefined;

            if (value === undefined) {
                if (prev !== undefined) {
                    el.removeAttribute('tabindex');
                }
            } else {
                el.tabIndex = value;
            }

            return prev;
        }

        return null;
    }

    private static restrictComponentFocus(componentId: string) {
        let storedComponent = FocusManager.allFocusableComponents[componentId];

        if (storedComponent && !storedComponent.restricted) {
            storedComponent.origTabIndex = FocusManager.setTabIndex(storedComponent.component, -1);
            storedComponent.restricted = true;
        }
    }

    private static removeComponentFocusRestriction(componentId: string) {
        let storedComponent = FocusManager.allFocusableComponents[componentId];

        if (storedComponent && storedComponent.restricted) {
            FocusManager.setTabIndex(storedComponent.component, storedComponent.origTabIndex);
            delete storedComponent.origTabIndex;
            storedComponent.restricted = false;
        }
    }
}

// A mixin for the focusable elements, to tell the views that
// they exist and should be accounted during the focus restriction.
export function applyFocusableComponentMixin(Component: any) {
    let contextTypes = Component.contextTypes || {};
    contextTypes.focusManager = PropTypes.object;
    Component.contextTypes = contextTypes;

    let origComponentDidMount = Component.prototype.componentDidMount;
    let origComponentWillUnmount = Component.prototype.componentWillUnmount;

    Component.prototype.componentDidMount = componentDidMount;
    Component.prototype.componentWillUnmount = componentWillUnmount;

    function componentDidMount() {
        let focusManager = this.context && this.context.focusManager;
        if (focusManager) {
            this._focusManagerId = focusManager.addFocusableComponent(this);
        } else {
            noFocusManagerError();
        }

        if (origComponentDidMount) {
            origComponentDidMount.apply(this, arguments);
        }

    }

    function componentWillUnmount() {
        let focusManager = this.context && this.context.focusManager;
        if (focusManager && this._focusManagerId) {
            focusManager.removeFocusableComponent(this._focusManagerId);
        } else {
            noFocusManagerError();
        }

        if (origComponentWillUnmount) {
            origComponentWillUnmount.apply(this, arguments);
        }
    }

    function noFocusManagerError() {
        console.error('FocusManager: the context does not provide FocusManager!');
    }
}

export default FocusManager;
