/**
 * FocusManager.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Manages focusable elements for better keyboard navigation.
 */

// tslint:disable:no-invalid-this

import * as PropTypes from 'prop-types';
import * as React from 'react';

import AppConfig from '../../common/AppConfig';
import { Types } from '../../common/Interfaces';
import Timers from './Timers';

let _lastComponentId = 0;

export enum RestrictFocusType {
    Unrestricted = 0,
    // When restrictFocusWithin=Restricted, the focus will not go outside of this View
    // when you're using Tab navigation.
    Restricted = 1,
    // The same as Restricted, but will also focus first focusable component inside
    // this View when UserInterface.isNavigatingWithKeyboard() is true, to save a Tab
    // press for the cases the user is tabbing already.
    RestrictedFocusFirst = 2
}

export interface FocusableInternal {
    focusableComponentId?: string;
}

export type FocusableComponentInternal = React.Component<any, any> & FocusableInternal;

export interface StoredFocusableComponent {
    id: string;
    numericId: number;
    component: FocusableComponentInternal;
    onFocus: () => void;
    accessibleOnly: boolean;
    restricted: boolean;
    limitedCount: number;
    limitedCountAccessible: number;
    removed?: boolean;
    callbacks?: FocusableComponentStateCallback[];
}

export type FocusableComponentStateCallback = (restrictedOrLimited: boolean) => void;

export type FocusManagerRestrictionStateCallback = (restricted: RestrictFocusType) => void;

export abstract class FocusManager {
    private static _restrictionStack: FocusManager[] = [];
    protected static _currentRestrictionOwner: FocusManager | undefined;
    private static _restoreRestrictionTimer: number | undefined;
    private static _pendingPrevFocusedComponent: StoredFocusableComponent | undefined;
    protected static _currentFocusedComponent: StoredFocusableComponent | undefined;
    protected static _allFocusableComponents: { [id: string]: StoredFocusableComponent } = {};
    protected static _skipFocusCheck = false;
    protected static _resetFocusTimer: number | undefined;

    private _parent: FocusManager | undefined;
    private _isFocusLimited: Types.LimitFocusType = Types.LimitFocusType.Unlimited;
    private _currentRestrictType: RestrictFocusType = RestrictFocusType.Unrestricted;
    private _prevFocusedComponent: StoredFocusableComponent | undefined;
    protected _myFocusableComponentIds: { [id: string]: boolean } = {};
    private _restrictionStateCallback: FocusManagerRestrictionStateCallback | undefined;

    constructor(parent: FocusManager | undefined) {
        this._parent = parent;
    }

    protected abstract /* static */ addFocusListenerOnComponent(component: FocusableComponentInternal, onFocus: () => void): void;
    protected abstract /* static */ removeFocusListenerFromComponent(component: FocusableComponentInternal, onFocus: () => void): void;
    protected abstract /* static */ focusComponent(component: FocusableComponentInternal): boolean;

    protected abstract /* static */ resetFocus(focusFirstWhenNavigatingWithKeyboard: boolean) : void;
    protected abstract /* static */ _updateComponentFocusRestriction(storedComponent: StoredFocusableComponent): void;

    // Whenever the focusable element is mounted, we let the application
    // know so that FocusManager could account for this element during the
    // focus restriction.
    addFocusableComponent(component: FocusableComponentInternal, accessibleOnly = false) {
        if (component.focusableComponentId) {
            return;
        }

        const numericComponentId = ++_lastComponentId;
        const componentId: string = 'fc-' + numericComponentId;

        const storedComponent: StoredFocusableComponent = {
            id: componentId,
            numericId: numericComponentId,
            component: component,
            accessibleOnly: accessibleOnly,
            restricted: false,
            limitedCount: 0,
            limitedCountAccessible: 0,
            onFocus: () => {
                FocusManager._currentFocusedComponent = storedComponent;
            }
        };

        component.focusableComponentId = componentId;
        FocusManager._allFocusableComponents[componentId] = storedComponent;

        let withinRestrictionOwner = false;

        for (let parent: FocusManager | undefined = this; parent; parent = parent._parent) {
            parent._myFocusableComponentIds[componentId] = true;

            if (FocusManager._currentRestrictionOwner === parent) {
                withinRestrictionOwner = true;
            }

            if (parent._isFocusLimited === Types.LimitFocusType.Accessible) {
                storedComponent.limitedCountAccessible++;
            } else if (parent._isFocusLimited === Types.LimitFocusType.Limited) {
                storedComponent.limitedCount++;
            }
        }

        if (!withinRestrictionOwner && FocusManager._currentRestrictionOwner) {
            storedComponent.restricted = true;
        }

        this._updateComponentFocusRestriction(storedComponent);

        this.addFocusListenerOnComponent(component, storedComponent.onFocus);
    }

    removeFocusableComponent(component: FocusableComponentInternal) {
        if (!component.focusableComponentId) {
            return;
        }
        const componentId: string = component.focusableComponentId;

        if (componentId) {
            const storedComponent: StoredFocusableComponent = FocusManager._allFocusableComponents[componentId];

            this.removeFocusListenerFromComponent(component, storedComponent.onFocus);

            storedComponent.removed = true;
            storedComponent.restricted = false;
            storedComponent.limitedCount = 0;
            storedComponent.limitedCountAccessible = 0;

            this._updateComponentFocusRestriction(storedComponent);

            delete storedComponent.callbacks;

            for (let parent: FocusManager | undefined = this; parent; parent = parent._parent) {
                delete parent._myFocusableComponentIds[componentId];
            }

            delete FocusManager._allFocusableComponents[componentId];
            delete component.focusableComponentId;
        }
    }

    restrictFocusWithin(restrictType: RestrictFocusType, noFocusReset?: boolean) {
        // Limit the focus received by the keyboard navigation to all
        // the descendant focusable elements by setting tabIndex of all
        // other elements to -1.
        if ((FocusManager._currentRestrictionOwner === this) || (restrictType === RestrictFocusType.Unrestricted)) {
            return;
        }

        this._currentRestrictType = restrictType;

        if (FocusManager._currentRestrictionOwner) {
            this._removeFocusRestriction();
        }

        if (!this._prevFocusedComponent) {
            this._prevFocusedComponent = FocusManager._pendingPrevFocusedComponent || FocusManager._currentFocusedComponent;
        }

        FocusManager._clearRestoreRestrictionTimeout();

        FocusManager._restrictionStack.push(this);
        FocusManager._currentRestrictionOwner = this;

        if (!noFocusReset) {
            this.resetFocus(restrictType === RestrictFocusType.RestrictedFocusFirst);
        }

        Object.keys(FocusManager._allFocusableComponents).forEach(componentId => {
            if (!(componentId in this._myFocusableComponentIds)) {
                const storedComponent = FocusManager._allFocusableComponents[componentId];
                storedComponent.restricted = true;
                this._updateComponentFocusRestriction(storedComponent);
            }
        });

        if (this._restrictionStateCallback) {
            this._restrictionStateCallback(restrictType);
        }
    }

    removeFocusRestriction() {
        // Restore the focus to the previous view with restrictFocusWithin or
        // remove the restriction if there is no such view.
        FocusManager._restrictionStack = FocusManager._restrictionStack.filter(focusManager => focusManager !== this);

        if (FocusManager._currentRestrictionOwner === this) {
            // We'll take care of setting the proper focus below,
            // no need to do a regular check for focusout.
            FocusManager._skipFocusCheck = true;

            let prevFocusedComponent = this._prevFocusedComponent;
            this._prevFocusedComponent = undefined;

            this._removeFocusRestriction();
            FocusManager._currentRestrictionOwner = undefined;

            if (this._restrictionStateCallback) {
                this._restrictionStateCallback(RestrictFocusType.Unrestricted);
            }

            // Defer the previous restriction restoration to wait for the current view
            // to be unmounted, or for the next restricted view to be mounted (like
            // showing a modal after a popup).
            FocusManager._clearRestoreRestrictionTimeout();
            FocusManager._pendingPrevFocusedComponent = prevFocusedComponent;

            FocusManager._restoreRestrictionTimer = Timers.setTimeout(() => {
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

                if (prevFocusedComponent &&
                    !prevFocusedComponent.accessibleOnly &&
                    !prevFocusedComponent.removed &&
                    !prevFocusedComponent.restricted &&
                    prevFocusedComponent.limitedCount === 0 &&
                    prevFocusedComponent.limitedCountAccessible === 0) {
                    // If possible, focus the previously focused component.
                    needsFocusReset = !this.focusComponent(prevFocusedComponent.component);
                }

                if (prevRestrictionOwner) {
                    prevRestrictionOwner.restrictFocusWithin(prevRestrictionOwner._currentRestrictType, !needsFocusReset);
                } else if (needsFocusReset) {
                    this.resetFocus(this._currentRestrictType === RestrictFocusType.RestrictedFocusFirst);
                }
            }, 100);
        }
    }

    limitFocusWithin(limitType: Types.LimitFocusType) {
        if (this._isFocusLimited !== Types.LimitFocusType.Unlimited ||
            (limitType !== Types.LimitFocusType.Limited &&
             limitType !== Types.LimitFocusType.Accessible)) {
            return;
        }

        this._isFocusLimited = limitType;

        Object.keys(this._myFocusableComponentIds).forEach(componentId => {
            const storedComponent = FocusManager._allFocusableComponents[componentId];

            if (limitType === Types.LimitFocusType.Accessible) {
                storedComponent.limitedCountAccessible++;
            } else if (limitType === Types.LimitFocusType.Limited) {
                storedComponent.limitedCount++;
            }

            this._updateComponentFocusRestriction(storedComponent);
        });
    }

    removeFocusLimitation() {
        if (this._isFocusLimited === Types.LimitFocusType.Unlimited) {
            return;
        }

        Object.keys(this._myFocusableComponentIds).forEach(componentId => {
            const storedComponent = FocusManager._allFocusableComponents[componentId];

            if (this._isFocusLimited === Types.LimitFocusType.Accessible) {
                storedComponent.limitedCountAccessible--;
            } else if (this._isFocusLimited === Types.LimitFocusType.Limited) {
                storedComponent.limitedCount--;
            }

            this._updateComponentFocusRestriction(storedComponent);
        });

        this._isFocusLimited = Types.LimitFocusType.Unlimited;
    }

    release() {
        this.removeFocusRestriction();
        this.removeFocusLimitation();
    }

    static subscribe(component: FocusableComponentInternal, callback: FocusableComponentStateCallback) {
        const storedComponent = FocusManager._getStoredComponent(component);

        if (storedComponent) {
            if (!storedComponent.callbacks) {
                storedComponent.callbacks = [];
            }

            storedComponent.callbacks.push(callback);
        }
    }

    static unsubscribe(component: FocusableComponentInternal, callback: FocusableComponentStateCallback) {
        const storedComponent = FocusManager._getStoredComponent(component);

        if (storedComponent && storedComponent.callbacks) {
            storedComponent.callbacks = storedComponent.callbacks.filter(cb => {
                return cb !== callback;
            });
        }
    }

    setRestrictionStateCallback(callback: FocusManagerRestrictionStateCallback | undefined) {
        this._restrictionStateCallback = callback;
    }

    static isComponentFocusRestrictedOrLimited(component: FocusableComponentInternal): boolean {
        const storedComponent = FocusManager._getStoredComponent(component);
        return !!storedComponent &&
            (storedComponent.restricted || storedComponent.limitedCount > 0 || storedComponent.limitedCountAccessible > 0);
    }

    static getCurrentFocusedComponent(): string | undefined {
        return FocusManager._currentFocusedComponent ? FocusManager._currentFocusedComponent.id : undefined;
    }

    private static _getStoredComponent(component: FocusableComponentInternal): StoredFocusableComponent | undefined {
        const componentId: string | undefined = component.focusableComponentId;

        if (componentId) {
            return FocusManager._allFocusableComponents[componentId];
        }

        return undefined;
    }

    protected static _callFocusableComponentStateChangeCallbacks(storedComponent: StoredFocusableComponent, restrictedOrLimited: boolean) {
        if (!storedComponent.callbacks) {
            return;
        }

        storedComponent.callbacks.forEach(callback => {
            callback.call(storedComponent.component, restrictedOrLimited);
        });
    }

    private /* static */ _removeFocusRestriction() {
        Object.keys(FocusManager._allFocusableComponents).forEach(componentId => {
            const storedComponent = FocusManager._allFocusableComponents[componentId];
            storedComponent.restricted = false;
            this._updateComponentFocusRestriction(storedComponent);
        });
    }

    private static _clearRestoreRestrictionTimeout() {
        if (FocusManager._restoreRestrictionTimer) {
            clearTimeout(FocusManager._restoreRestrictionTimer);
            FocusManager._restoreRestrictionTimer = undefined;
            FocusManager._pendingPrevFocusedComponent = undefined;
        }
    }
}

// A mixin for the focusable elements, to tell the views that
// they exist and should be accounted during the focus restriction.
//
// isConditionallyFocusable is an optional callback which will be
// called for componentDidMount() or for componentWillUpdate() to
// determine if the component is actually focusable.
//
// accessibleOnly is true for components that support just being focused
// by screen readers.
// By default components support both screen reader and keyboard focusing.
export function applyFocusableComponentMixin(Component: any, isConditionallyFocusable?: Function, accessibleOnly = false) {
    const contextTypes = Component.contextTypes || {};
    contextTypes.focusManager = PropTypes.object;
    Component.contextTypes = contextTypes;

    inheritMethod('componentDidMount', function(this: FocusableComponentInternal, focusManager: FocusManager) {
        if (!isConditionallyFocusable || isConditionallyFocusable.call(this)) {
            focusManager.addFocusableComponent(this, accessibleOnly);
        }
    });

    inheritMethod('componentWillUnmount', function(this: FocusableComponentInternal, focusManager: FocusManager) {
        focusManager.removeFocusableComponent(this);
    });

    inheritMethod('componentWillUpdate', function(this: FocusableComponentInternal, focusManager: FocusManager, origArgs: IArguments) {
        if (isConditionallyFocusable) {
            const isFocusable = isConditionallyFocusable.apply(this, origArgs);

            if (isFocusable && !this.focusableComponentId) {
                focusManager.addFocusableComponent(this, accessibleOnly);
            } else if (!isFocusable && this.focusableComponentId) {
                focusManager.removeFocusableComponent(this);
            }
        }
    });

    function inheritMethod(methodName: string, action: Function) {
        const origCallback = Component.prototype[methodName];

        Component.prototype[methodName] = function() {
            if (!isConditionallyFocusable || isConditionallyFocusable.call(this)) {

                const focusManager: FocusManager = this._focusManager || (this.context && this.context.focusManager);

                if (focusManager) {
                    action.call(this, focusManager, arguments);
                } else {
                    if (AppConfig.isDevelopmentMode()) {
                        console.error('FocusableComponentMixin: context error!');
                    }
                }
            }

            if (origCallback) {
                origCallback.apply(this, arguments);
            }
        };
    }
}

export default FocusManager;
