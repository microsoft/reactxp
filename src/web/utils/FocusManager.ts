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

let _lastFocusManagerId: number = 0;
let _lastComponentId: number = 0;

interface StoredFocusableComponent {
    component: React.Component<any, any>;
    restricted?: boolean;
    origTabIndex?: number;
}

interface FocusableComponentsMap {
    [id: string]: boolean;
}

export class FocusManager {
    private static _rootFocusManager: FocusManager;
    private static _restrictionStack: FocusManager[] = [];
    private static _currentRestrictionOwner: FocusManager;

    private static _allFocusableComponents: { [id: string]: StoredFocusableComponent } = {};

    private _myFocusableComponentIds: FocusableComponentsMap = {};

    private _id: string;
    private _isRoot: boolean;
    private _parent: FocusManager;
    private _children: { [id: string]: FocusManager } = {};

    constructor() {
        this._id = 'fm-' + ++_lastFocusManagerId;
    }

    setAsRootFocusManager() {
        FocusManager._rootFocusManager = this;
        this._isRoot = true;
    }

    addToParentFocusManager(parent: FocusManager) {
        if (!parent) {
            console.error('FocusManager: parent FocusManager is not provided!');
            return;
        }

        this._parent = parent;
        this._parent._children[this._id] = this;
    }

    removeFromParentFocusManager() {
        if (this._parent) {
            delete this._parent._children[this._id];
            this._parent = undefined;
        }
    }

    // Whenever the focusable element is mounted, we let the application
    // know so that FocusManager could account for this element during the
    // focus restriction.
    addFocusableComponent(component: React.Component<any, any>): string {
        let componentId: string = 'fc-' + ++_lastComponentId;

        FocusManager._allFocusableComponents[componentId] = {
            component: component
        };

        if (!this._isRoot) {
            this._myFocusableComponentIds[componentId] = true;
        }

        if (!this._isInRestrictionOwner()) {
            // New focusable element is mounted but it's not in the scope of the
            // current view with restrictFocusWithin property.
            FocusManager._restrictComponentFocus(componentId);
        }

        return componentId;
    }

    removeFocusableComponent(componentId: string) {
        FocusManager._removeComponentFocusRestriction(componentId);
        delete this._myFocusableComponentIds[componentId];
        delete FocusManager._allFocusableComponents[componentId];
    }

    restrictFocusWithin() {
        // Limit the focus received by the keyboard navigation to all
        // the descendant focusable elements by setting tabIndex of all
        // other elements to -1.
        if (FocusManager._currentRestrictionOwner === this) {
            return;
        }

        if (FocusManager._currentRestrictionOwner) {
            FocusManager._removeFocusRestriction();
        }

        FocusManager._restrictionStack.push(this);
        FocusManager._currentRestrictionOwner = this;

        let focusableComponents = this._flattenFocusableChildren();

        Object.keys(FocusManager._allFocusableComponents).forEach(componentId => {
            if (!(componentId in focusableComponents)) {
                FocusManager._restrictComponentFocus(componentId);
            }
        });
    }

    restoreFocusRestriction() {
        // When the view is unmounted or when restrictFocusWithin property is changed,
        // restore the focus to the previous view with restrictFocusWithin or remove
        // the restriction if there is no such view.
        FocusManager._restrictionStack = FocusManager._restrictionStack.filter(focusManager => {
            return focusManager !== this;
        });

        if (FocusManager._currentRestrictionOwner === this) {
            FocusManager._removeFocusRestriction();
            FocusManager._currentRestrictionOwner = FocusManager._restrictionStack[FocusManager._restrictionStack.length - 1];

            if (FocusManager._currentRestrictionOwner) {
                FocusManager._currentRestrictionOwner.restrictFocusWithin();
            }
        }
    }

    private _isInRestrictionOwner(): boolean {
        if (!FocusManager._currentRestrictionOwner) {
            return true;
        }

        for (let ro: FocusManager = this; ro; ro = ro._parent) {
            if (ro === FocusManager._currentRestrictionOwner) {
                return true;
            }
        }

        return false;
    }

    private _flattenFocusableChildren(): FocusableComponentsMap {
        let flattenedChildren: FocusableComponentsMap = {};

        let traverse = (parent: FocusManager) => {
            Object.keys(parent._myFocusableComponentIds).forEach(componentId => {
                flattenedChildren[componentId] = true;
            });

            Object.keys(parent._children).forEach(focusManagerId => {
                traverse(parent._children[focusManagerId]);
            });
        };

        traverse(this);

        return flattenedChildren;
    }

    private static _removeFocusRestriction() {
        Object.keys(FocusManager._allFocusableComponents).forEach(componentId => {
            FocusManager._removeComponentFocusRestriction(componentId);
        });
    }

    private static _setTabIndex(component: React.Component<any, any>, value: number): number {
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

    private static _restrictComponentFocus(componentId: string) {
        let storedComponent = FocusManager._allFocusableComponents[componentId];

        if (storedComponent && !storedComponent.restricted) {
            (storedComponent.component as any)._focusIsRestricted = true;
            storedComponent.origTabIndex = FocusManager._setTabIndex(storedComponent.component, -1);
            storedComponent.restricted = true;
        }
    }

    private static _removeComponentFocusRestriction(componentId: string) {
        let storedComponent = FocusManager._allFocusableComponents[componentId];

        if (storedComponent && storedComponent.restricted) {
            FocusManager._setTabIndex(storedComponent.component, storedComponent.origTabIndex);
            delete (storedComponent.component as any)._focusIsRestricted;
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

    inheritMethod('componentDidMount', true, function (focusManager: FocusManager) {
        this._focusableComponentId = focusManager.addFocusableComponent(this);
    });

    inheritMethod('componentWillUnmount', false, function (focusManager: FocusManager, focusableComponentId: string) {
        focusManager.removeFocusableComponent(focusableComponentId);
    });

    function inheritMethod(methodName: string, needsManagerOnly: boolean, action: Function) {
        let origCallback = Component.prototype[methodName];

        Component.prototype[methodName] = function () {
            let focusManager: FocusManager = this.context && this.context.focusManager;
            let focusableComponentId: string;
            let success: boolean;

            if (focusManager) {
                if (!needsManagerOnly) {
                    focusableComponentId = this._focusableComponentId;
                }

                if (needsManagerOnly || (!needsManagerOnly && focusableComponentId)) {
                    action.call(this, focusManager, focusableComponentId);
                    success = true;
                }
            }

            if (!success) {
                console.error('FocusableComponentMixin: context error!');
            }

            if (origCallback) {
                origCallback.apply(this, arguments);
            }
        };
    }
}

export default FocusManager;
