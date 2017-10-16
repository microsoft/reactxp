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

import UserInterface from '../UserInterface';

const ATTR_NAME_TAB_INDEX = 'tabindex';
const ATTR_NAME_ARIA_HIDDEN = 'aria-hidden';

let _lastComponentId: number = 0;

interface StoredFocusableComponent {
    id: string;
    component: React.Component<any, any>;
    onFocus: EventListener;
    restricted: boolean;
    limitedCount: number;
    origTabIndex?: number;
    origAriaHidden?: string;
    removed?: boolean;
    callbacks?: FocusableComponentStateCallback[];
}

interface OriginalAttributeValues {
    tabIndex: number;
    ariaHidden: string;
}

let _isNavigatingWithKeyboard: boolean;
let _isShiftPressed: boolean;

UserInterface.keyboardNavigationEvent.subscribe(isNavigatingWithKeyboard => {
    _isNavigatingWithKeyboard = isNavigatingWithKeyboard;
});

let _skipFocusCheck = false;

if ((typeof document !== 'undefined') && (typeof window !== 'undefined')) {
    // The default behaviour on Electron is to release the focus after the
    // Tab key is pressed on a last focusable element in the page and focus
    // the first focusable element on a consecutive Tab key press.
    // We want to avoid losing this first Tab key press.
    let _checkFocusTimer: number;

    // Checking if Shift is pressed to move the focus into the right direction.
    window.addEventListener('keydown', event => {
        _isShiftPressed = event.shiftKey;
    });
    window.addEventListener('keyup', event => {
        _isShiftPressed = event.shiftKey;
    });

    document.body.addEventListener('focusout', event => {
        if (!_isNavigatingWithKeyboard || (event.target === document.body)) {
            return;
        }

        if (_checkFocusTimer) {
            clearTimeout(_checkFocusTimer);
        }

        if (_skipFocusCheck) {
            // When in between the FocusManager restrictions,
            // don't check for the focus change here, FocusManager
            // will take care of it.
            _skipFocusCheck = false;
            return;
        }

        _checkFocusTimer = setTimeout(() => {
            _checkFocusTimer = undefined;

            if (_isNavigatingWithKeyboard &&
                    (!document.activeElement || (document.activeElement === document.body))) {
                // This should work for Electron and the browser should
                // send the focus to the address bar anyway.
                FocusManager.focusFirst(_isShiftPressed);
            }
        }, 0);
    });
}

export type FocusableComponentStateCallback = (restrictedOrLimited: boolean) => void;

export class FocusManager {
    private static _rootFocusManager: FocusManager;

    private static _restrictionStack: FocusManager[] = [];
    private static _currentRestrictionOwner: FocusManager;
    private static _restoreRestrictionTimer: number;
    private static _pendingPrevFocusedComponent: StoredFocusableComponent;
    private static _currentFocusedComponent: StoredFocusableComponent;
    private static _allFocusableComponents: { [id: string]: StoredFocusableComponent } = {};
    private static _resetFocusTimer: number;

    private _parent: FocusManager;
    private _isFocusLimited: boolean;
    private _prevFocusedComponent: StoredFocusableComponent;
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

        const componentId: string = 'fc-' + ++_lastComponentId;

        let storedComponent: StoredFocusableComponent = {
            id: componentId,
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

        const el = ReactDOM.findDOMNode<HTMLElement>(component);
        if (el) {
            el.addEventListener('focus', storedComponent.onFocus);
        }
    }

    removeFocusableComponent(component: React.Component<any, any>) {
        const componentId: string = (component as any)._focusableComponentId;

        if (componentId) {
            const storedComponent: StoredFocusableComponent = FocusManager._allFocusableComponents[componentId];

            const el = ReactDOM.findDOMNode<HTMLElement>(component);
            if (storedComponent && el) {
                el.removeEventListener('focus', storedComponent.onFocus);
            }

            storedComponent.removed = true;
            storedComponent.restricted = false;
            storedComponent.limitedCount = 0;

            FocusManager._updateComponentFocusRestriction(storedComponent);

            delete storedComponent.callbacks;

            for (let parent: FocusManager = this; parent; parent = parent._parent) {
                delete parent._myFocusableComponentIds[componentId];
            }

            delete FocusManager._allFocusableComponents[componentId];
            delete (component as any)._focusableComponentId;
        }
    }

    restrictFocusWithin(noFocusReset?: boolean) {
        // Limit the focus received by the keyboard navigation to all
        // the descendant focusable elements by setting tabIndex of all
        // other elements to -1.
        if (FocusManager._currentRestrictionOwner === this) {
            return;
        }

        if (FocusManager._currentRestrictionOwner) {
            FocusManager._removeFocusRestriction();
        }

        if (!this._prevFocusedComponent) {
            this._prevFocusedComponent = FocusManager._pendingPrevFocusedComponent || FocusManager._currentFocusedComponent;
        }

        FocusManager._clearRestoreRestrictionTimeout();

        FocusManager._restrictionStack.push(this);
        FocusManager._currentRestrictionOwner = this;

        Object.keys(FocusManager._allFocusableComponents).forEach(componentId => {
            if (!(componentId in this._myFocusableComponentIds)) {
                const storedComponent = FocusManager._allFocusableComponents[componentId];
                storedComponent.restricted = true;
                FocusManager._updateComponentFocusRestriction(storedComponent);
            }
        });

        if (!noFocusReset) {
            FocusManager.resetFocus();
        }
    }

    removeFocusRestriction() {
        // Restore the focus to the previous view with restrictFocusWithin or
        // remove the restriction if there is no such view.
        FocusManager._restrictionStack = FocusManager._restrictionStack.filter(focusManager => focusManager !== this);

        if (FocusManager._currentRestrictionOwner === this) {
            // We'll take care of setting the proper focus below,
            // no need to do a regular check for focusout.
            _skipFocusCheck = true;

            let prevFocusedComponent = this._prevFocusedComponent;
            this._prevFocusedComponent = undefined;

            FocusManager._removeFocusRestriction();
            FocusManager._currentRestrictionOwner = undefined;

            // Defer the previous restriction restoration to wait for the current view
            // to be unmounted, or for the next restricted view to be mounted (like
            // showing a modal after a popup).
            FocusManager._clearRestoreRestrictionTimeout();
            FocusManager._pendingPrevFocusedComponent = prevFocusedComponent;

            FocusManager._restoreRestrictionTimer = setTimeout(() => {
                FocusManager._restoreRestrictionTimer = undefined;
                FocusManager._pendingPrevFocusedComponent = undefined;

                const prevRestrictionOwner = FocusManager._restrictionStack.pop();

                let needsFocusReset = true;

                const currentFocusedComponent = FocusManager._currentFocusedComponent;
                if (currentFocusedComponent && !currentFocusedComponent.removed &&
                        !(currentFocusedComponent.id in this._myFocusableComponentIds)) {
                    // The focus has been manually moved to something outside of the current
                    // restriction scope, we should skip focusing the component which was
                    // focused before the restriction and keep the focus as it is.
                    prevFocusedComponent = undefined;
                    needsFocusReset = false;
                }

                if (prevFocusedComponent && !prevFocusedComponent.removed &&
                        !prevFocusedComponent.restricted && !prevFocusedComponent.limitedCount) {
                    // If possible, focus the previously focused component.
                    const el = ReactDOM.findDOMNode<HTMLElement>(prevFocusedComponent.component);
                    if (el && el.focus) {
                        el.focus();
                        needsFocusReset = false;
                    }
                }

                if (prevRestrictionOwner) {
                    prevRestrictionOwner.restrictFocusWithin(true);
                }

                if (needsFocusReset) {
                    FocusManager.resetFocus();
                }
            }, 100);
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

    subscribe(component: React.Component<any, any>, callback: FocusableComponentStateCallback) {
        const storedComponent = FocusManager._getStoredComponent(component);

        if (storedComponent) {
            if (!storedComponent.callbacks) {
                storedComponent.callbacks = [];
            }

            storedComponent.callbacks.push(callback);
        }
    }

    unsubscribe(component: React.Component<any, any>, callback: FocusableComponentStateCallback) {
        const storedComponent = FocusManager._getStoredComponent(component);

        if (storedComponent && storedComponent.callbacks) {
            storedComponent.callbacks = storedComponent.callbacks.filter(cb => {
                return cb !== callback;
            });
        }
    }

    isComponentFocusRestrictedOrLimited(component: React.Component<any, any>): boolean {
        const storedComponent = FocusManager._getStoredComponent(component);
        return storedComponent && (storedComponent.restricted || storedComponent.limitedCount > 0);
    }

    static focusFirst(last?: boolean) {
        const focusable = Object.keys(FocusManager._allFocusableComponents)
            .map(componentId => FocusManager._allFocusableComponents[componentId])
            .filter(storedComponent => !storedComponent.removed && !storedComponent.restricted && !storedComponent.limitedCount)
            .map(storedComponent => ReactDOM.findDOMNode<HTMLElement>(storedComponent.component))
            .filter(el => el && el.focus);

        if (focusable.length) {
            focusable.sort((a, b) => {
                // Some element which is mounted later could come earlier in the DOM,
                // so, we sort the elements by their appearance in the DOM.
                if (a === b) {
                    return 0;
                }
                return a.compareDocumentPosition(b) & document.DOCUMENT_POSITION_PRECEDING ? 1 : -1;
            });

            focusable[last ? focusable.length - 1 : 0].focus();
        }
    }

    static resetFocus() {
        if (FocusManager._resetFocusTimer) {
            clearTimeout(FocusManager._resetFocusTimer);
            FocusManager._resetFocusTimer = undefined;
        }

        if (_isNavigatingWithKeyboard) {
            // When we're in the keyboard navigation mode, we want to have the
            // first focusable component to be focused straight away, without the
            // necessity to press Tab.

            // Defer the focusing to let the view finish its initialization.
            FocusManager._resetFocusTimer = setTimeout(() => {
                FocusManager._resetFocusTimer = undefined;
                FocusManager.focusFirst();
            }, 0);
        } else if ((typeof document !== 'undefined') && document.body && document.body.focus && document.body.blur) {
            // An example to explain this part:
            // We've shown a modal dialog which is higher in the DOM by clicking
            // on a button which is lower in the DOM, we've applied the restrictions
            // and only the elements from the modal dialog are focusable now.
            // But internally the browser keeps the last focus position in the DOM
            // (even if we do blur() for the button) and when Tab is pressed again,
            // the browser will start searching for the next focusable element from
            // this position.
            // This means that the first Tab press will get us to the browser's address
            // bar (or nowhere in case of Electron) and only the second Tab press will
            // lead us to focusing the first focusable element in the modal dialog.
            // In order to avoid losing this first Tab press, we're making <body>
            // focusable, focusing it, removing the focus and making it unfocusable
            // back again.
            const prevTabIndex = FocusManager._setTabIndex(document.body, 0);
            document.body.focus();
            document.body.blur();
            FocusManager._setTabIndex(document.body, prevTabIndex);
        }
    }

    private static _getStoredComponent(component: React.Component<any, any>): StoredFocusableComponent {
        const componentId: string = (component as any)._focusableComponentId;

        if (componentId) {
            return FocusManager._allFocusableComponents[componentId];
        }

        return null;
    }

    private static _callFocusableComponentStateChangeCallbacks(storedComponent: StoredFocusableComponent, restrictedOrLimited: boolean) {
        if (!storedComponent.callbacks) {
            return;
        }

        storedComponent.callbacks.forEach(callback => {
            callback.call(storedComponent.component, restrictedOrLimited);
        });
    }

    private static _removeFocusRestriction() {
        Object.keys(FocusManager._allFocusableComponents).forEach(componentId => {
            let storedComponent = FocusManager._allFocusableComponents[componentId];
            storedComponent.restricted = false;
            FocusManager._updateComponentFocusRestriction(storedComponent);
        });
    }

    private static _clearRestoreRestrictionTimeout() {
        if (FocusManager._restoreRestrictionTimer) {
            clearTimeout(FocusManager._restoreRestrictionTimer);
            FocusManager._restoreRestrictionTimer = undefined;
            FocusManager._pendingPrevFocusedComponent = undefined;
        }
    }

    private static _setComponentTabIndexAndAriaHidden(
            component: React.Component<any, any>, tabIndex: number, ariaHidden: string): OriginalAttributeValues {

        const el = ReactDOM.findDOMNode<HTMLElement>(component);
        return el ?
            {
                tabIndex: FocusManager._setTabIndex(el, tabIndex),
                ariaHidden: FocusManager._setAriaHidden(el, ariaHidden)
            }
            :
            null;
    }

    private static _setTabIndex(element: HTMLElement, value: number): number {
        const prev = element.hasAttribute(ATTR_NAME_TAB_INDEX) ? element.tabIndex : undefined;

        if (value === undefined) {
            if (prev !== undefined) {
                element.removeAttribute(ATTR_NAME_TAB_INDEX);
            }
        } else {
            element.tabIndex = value;
        }

        return prev;
    }

    private static _setAriaHidden(element: HTMLElement, value: string): string {
        const prev = element.hasAttribute(ATTR_NAME_ARIA_HIDDEN) ? element.getAttribute(ATTR_NAME_ARIA_HIDDEN) : undefined;

        if (value === undefined) {
            if (prev !== undefined) {
                element.removeAttribute(ATTR_NAME_ARIA_HIDDEN);
            }
        } else {
            element.setAttribute(ATTR_NAME_ARIA_HIDDEN, value);
        }

        return prev;
    }

    private static _updateComponentFocusRestriction(storedComponent: StoredFocusableComponent) {
        if ((storedComponent.restricted || (storedComponent.limitedCount > 0)) && !('origTabIndex' in storedComponent)) {
            const origValues = FocusManager._setComponentTabIndexAndAriaHidden(storedComponent.component, -1, 'true');
            storedComponent.origTabIndex = origValues ? origValues.tabIndex : undefined;
            storedComponent.origAriaHidden = origValues ? origValues.ariaHidden : undefined;
            FocusManager._callFocusableComponentStateChangeCallbacks(storedComponent, true);
        } else if (!storedComponent.restricted && !storedComponent.limitedCount && ('origTabIndex' in storedComponent)) {
            FocusManager._setComponentTabIndexAndAriaHidden(storedComponent.component,
                    storedComponent.origTabIndex, storedComponent.origAriaHidden);
            delete storedComponent.origTabIndex;
            delete storedComponent.origAriaHidden;
            FocusManager._callFocusableComponentStateChangeCallbacks(storedComponent, false);
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
