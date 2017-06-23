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

let _lastComponentId: number = 0;

interface StoredFocusableComponent {
    component: React.Component<any, any>;
    onFocus: EventListener;
    restricted: boolean;
    limitedCount: number;
    origTabIndex?: number;
    removed?: boolean;
}

export class FocusManager {
    private _parent: FocusManager;

    private static _rootFocusManager: FocusManager;

    private static _restrictionStack: FocusManager[] = [];
    private static _currentRestrictionOwner: FocusManager;
    private _isFocusLimited: boolean;

    private static _currentFocusedComponent: StoredFocusableComponent;
    private _prevFocusedComponent: StoredFocusableComponent;

    private static _allFocusableComponents: { [id: string]: StoredFocusableComponent } = {};

    private _myFocusableComponentIds: { [id: string]: boolean } = {};

    constructor(parent: FocusManager) {
        if (parent) {
            this._parent = parent;
        } else if (FocusManager._rootFocusManager) {
            console.error('FocusManager: root is already set');
        } else {
            FocusManager._rootFocusManager = this;
        }
    }

    // Whenever the focusable element is mounted, we let the application
    // know so that FocusManager could account for this element during the
    // focus restriction.
    addFocusableComponent(component: React.Component<any, any>) {
        if ((component as any)._focusableComponentId) {
            return;
        }

        let componentId: string = 'fc-' + ++_lastComponentId;

        let storedComponent: StoredFocusableComponent = {
            component: component,
            restricted: false,
            limitedCount: 0,
            onFocus: () => {
                FocusManager._currentFocusedComponent = storedComponent;
            }
        };

        (component as any)._focusableComponentId = componentId;
        FocusManager._allFocusableComponents[componentId] = storedComponent;

        let withinRestrictionOwner: boolean = false;

        for (let parent: FocusManager = this; parent; parent = parent._parent) {
            parent._myFocusableComponentIds[componentId] = true;

            if (FocusManager._currentRestrictionOwner === parent) {
                withinRestrictionOwner = true;
            }

            if (parent._isFocusLimited) {
                storedComponent.limitedCount++;
            }
        }

        if (!withinRestrictionOwner && FocusManager._currentRestrictionOwner) {
            storedComponent.restricted = true;
        }

        FocusManager._updateComponentFocusRestriction(storedComponent);

        let el = ReactDOM.findDOMNode<HTMLElement>(component);
        if (el) {
            el.addEventListener('focus', storedComponent.onFocus);
        }
    }

    removeFocusableComponent(component: React.Component<any, any>) {
        let componentId: string = (component as any)._focusableComponentId;

        if (componentId) {
            let storedComponent: StoredFocusableComponent = FocusManager._allFocusableComponents[componentId];

            let el = ReactDOM.findDOMNode<HTMLElement>(component);
            if (storedComponent && el) {
                el.removeEventListener('focus', storedComponent.onFocus);
            }

            storedComponent.removed = true;
            storedComponent.restricted = false;
            storedComponent.limitedCount = 0;

            FocusManager._updateComponentFocusRestriction(storedComponent);

            for (let parent: FocusManager = this; parent; parent = parent._parent) {
                delete parent._myFocusableComponentIds[componentId];
            }

            delete FocusManager._allFocusableComponents[componentId];
            delete (component as any)._focusableComponentId;
        }
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

        this._prevFocusedComponent = FocusManager._currentFocusedComponent;

        if (this._prevFocusedComponent && !this._prevFocusedComponent.removed) {
            let el = ReactDOM.findDOMNode<HTMLElement>(this._prevFocusedComponent.component);
            if (el && el.blur) {
                el.blur();
            }
        }

        Object.keys(FocusManager._allFocusableComponents).forEach(componentId => {
            if (!(componentId in this._myFocusableComponentIds)) {
                let storedComponent = FocusManager._allFocusableComponents[componentId];
                storedComponent.restricted = true;
                FocusManager._updateComponentFocusRestriction(storedComponent);
            }
        });
    }

    removeFocusRestriction() {
        // Restore the focus to the previous view with restrictFocusWithin or
        // remove the restriction if there is no such view.
        FocusManager._restrictionStack = FocusManager._restrictionStack.filter(focusManager => {
            return focusManager !== this;
        });

        let prevFocusedComponent = this._prevFocusedComponent;
        delete this._prevFocusedComponent;

        if (FocusManager._currentRestrictionOwner === this) {
            FocusManager._removeFocusRestriction();

            let prevRestrictionOwner = FocusManager._restrictionStack.pop();
            FocusManager._currentRestrictionOwner = undefined;

            // If possible, focus the element which was focused before the restriction.
            if (prevFocusedComponent && !prevFocusedComponent.removed &&
                    !prevFocusedComponent.restricted && !prevFocusedComponent.limitedCount) {
                let el = ReactDOM.findDOMNode<HTMLElement>(prevFocusedComponent.component);
                if (el && el.focus) {
                    el.focus();
                }
            }

            if (prevRestrictionOwner) {
                prevRestrictionOwner.restrictFocusWithin();
            }
        }
    }

    limitFocusWithin() {
        if (this._isFocusLimited) {
            return;
        }

        this._isFocusLimited = true;

        Object.keys(this._myFocusableComponentIds).forEach(componentId => {
            let storedComponent = FocusManager._allFocusableComponents[componentId];
            storedComponent.limitedCount++;
            FocusManager._updateComponentFocusRestriction(storedComponent);
        });
    }

    removeFocusLimitation() {
        if (!this._isFocusLimited) {
            return;
        }

        Object.keys(this._myFocusableComponentIds).forEach(componentId => {
            let storedComponent = FocusManager._allFocusableComponents[componentId];
            storedComponent.limitedCount--;
            FocusManager._updateComponentFocusRestriction(storedComponent);
        });

        this._isFocusLimited = false;
    }

    release() {
        this.removeFocusRestriction();
        this.removeFocusLimitation();
    }

    private static _removeFocusRestriction() {
        Object.keys(FocusManager._allFocusableComponents).forEach(componentId => {
            let storedComponent = FocusManager._allFocusableComponents[componentId];
            storedComponent.restricted = false;
            FocusManager._updateComponentFocusRestriction(storedComponent);
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

    private static _updateComponentFocusRestriction(storedComponent: StoredFocusableComponent) {
        if ((storedComponent.restricted || (storedComponent.limitedCount > 0)) && !('origTabIndex' in storedComponent)) {
            storedComponent.origTabIndex = FocusManager._setTabIndex(storedComponent.component, -1);
        } else if (!storedComponent.restricted && !storedComponent.limitedCount && ('origTabIndex' in storedComponent)) {
            FocusManager._setTabIndex(storedComponent.component, storedComponent.origTabIndex);
            delete storedComponent.origTabIndex;
        }
    }
}

// A mixin for the focusable elements, to tell the views that
// they exist and should be accounted during the focus restriction.
//
// isConditionallyFocusable is an optional callback which will be
// called for componentDidMount() or for componentWillUpdate() to
// determine if the component is actually focusable.
export function applyFocusableComponentMixin(Component: any, isConditionallyFocusable?: Function) {
    let contextTypes = Component.contextTypes || {};
    contextTypes.focusManager = PropTypes.object;
    Component.contextTypes = contextTypes;

    inheritMethod('componentDidMount', function (focusManager: FocusManager) {
        if (!isConditionallyFocusable || isConditionallyFocusable.call(this)) {
            focusManager.addFocusableComponent(this);
        }
    });

    inheritMethod('componentWillUnmount', function (focusManager: FocusManager) {
        focusManager.removeFocusableComponent(this);
    });

    inheritMethod('componentWillUpdate', function (focusManager: FocusManager, origArguments: IArguments) {
        if (isConditionallyFocusable) {
            let isFocusable = isConditionallyFocusable.apply(this, origArguments);

            if (isFocusable && !this._focusableComponentId) {
                focusManager.addFocusableComponent(this);
            } else if (!isFocusable && this._focusableComponentId) {
                focusManager.removeFocusableComponent(this);
            }
        }
    });

    function inheritMethod(methodName: string, action: Function) {
        let origCallback = Component.prototype[methodName];

        Component.prototype[methodName] = function () {
            let focusManager: FocusManager = this._focusManager || (this.context && this.context.focusManager);

            if (focusManager) {
                action.call(this, focusManager, arguments);
            } else {
                console.error('FocusableComponentMixin: context error!');
            }

            if (origCallback) {
                origCallback.apply(this, arguments);
            }
        };
    }
}

export default FocusManager;
