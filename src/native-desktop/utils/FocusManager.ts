/**
* FocusManager.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Manages focusable elements for better keyboard navigation (RN desktop version)
*/

import { FocusManager as FocusManagerBase,
    FocusableComponentInternal as FocusableComponentInternalBase,
    applyFocusableComponentMixin as applyFocusableComponentMixinBase,
    StoredFocusableComponent } from '../../common/utils/FocusManager';

import AppConfig from '../../common/AppConfig';
import Platform from '../../native-common/Platform';
import UserInterface from '../UserInterface';

const isNativeWindows: boolean = Platform.getType() === 'windows';

let _isNavigatingWithKeyboard: boolean;

UserInterface.keyboardNavigationEvent.subscribe(isNavigatingWithKeyboard => {
    _isNavigatingWithKeyboard = isNavigatingWithKeyboard;
});

import { FocusableComponentStateCallback } from  '../../common/utils/FocusManager';
export { FocusableComponentStateCallback };

export interface FocusManagerFocusableComponent {
    getTabIndex(): number | undefined;
    onFocus(): void;
    focus(): void;
    updateNativeTabIndex(): void;
}

export interface FocusableComponentInternal extends FocusManagerFocusableComponent, FocusableComponentInternalBase {
    tabIndexOverride?: number;
    tabIndexLocalOverride?: number;
    tabIndexLocalOverrideTimer?: number;
    onFocusSink?: () => void;
}

export class FocusManager extends FocusManagerBase {

    constructor(parent: FocusManager | undefined) {
        super(parent);
    }

    protected /* static */ addFocusListenerOnComponent(component: FocusableComponentInternal, onFocus: () => void): void {
        // We intercept the "onFocus" all the focusable elements have to have
        component.onFocusSink = onFocus;
    }

    protected /* static */ removeFocusListenerFromComponent(component: FocusableComponentInternal, onFocus: () => void): void {
        delete  component.onFocusSink;
    }

    protected /* static */ focusComponent(component: FocusableComponentInternal): boolean {
        if (component && component.focus) {
            component.focus();
            return true;
        }
        return false;
    }

    private static focusFirst() {
        const focusable = Object.keys(FocusManager._allFocusableComponents)
            .map(componentId => FocusManager._allFocusableComponents[componentId])
            .filter(storedComponent => !storedComponent.removed && !storedComponent.restricted && !storedComponent.limitedCount);

        if (focusable.length) {
            focusable.sort((a, b) => {
                // This function does its best, but contrary to DOM-land we have no idea on where the native components
                // ended up on screen, unless some expensive measuring is done on them.
                // So we defer to less than optimal "add focusable component" order. A lot of factors (absolute positioning,
                // instance replacements, etc.) can alter the correctness of this method, but I see no other way.
                if (a === b) {
                    return 0;
                }

                if (a.numericId < b.numericId) {
                    return -1;
                } else {
                    return 1;
                }
            });

            let fc = focusable[0].component as FocusableComponentInternal;

            if (fc && fc.focus) {
                fc.focus();
            }
        }
    }

    protected /* static */ resetFocus() {
        if (FocusManager._resetFocusTimer) {
            clearTimeout(FocusManager._resetFocusTimer);
            FocusManager._resetFocusTimer = undefined;
        }

        if (_isNavigatingWithKeyboard) {
            // When we're in the keyboard navigation mode, we want to have the
            // first focusable component to be focused straight away, without the
            // necessity to press Tab.
            // Defer the focusing to let the view finish its initialization and to allow for manual focus setting (if any)
            // to be processed (the asynchronous nature of focus->onFocus path requires a delay)
            FocusManager._resetFocusTimer = setTimeout(() => {
                FocusManager._resetFocusTimer = undefined;

                // Check if the currently focused component is without limit/restriction.
                // We skip setting focus on "first" component in that case because:
                // - focusFirst has its limits, to say it gently
                // - We ended up in resetFocus for a reason that is not true anymore (mostly because focus was set manually)
                const storedComponent = FocusManager._currentFocusedComponent;
                if (!storedComponent || storedComponent.removed || storedComponent.restricted || (storedComponent.limitedCount > 0)) {
                    FocusManager.focusFirst();
                }
            }, 500);
        }
    }

    protected /* static */ _updateComponentFocusRestriction(storedComponent: StoredFocusableComponent) {
        if ((storedComponent.restricted || (storedComponent.limitedCount > 0)) && !('origTabIndex' in storedComponent)) {
            storedComponent.origTabIndex = FocusManager._setComponentTabIndexOverride(
                storedComponent.component as FocusableComponentInternal, -1);
            FocusManager._callFocusableComponentStateChangeCallbacks(storedComponent, true);
        } else if (!storedComponent.restricted && !storedComponent.limitedCount && ('origTabIndex' in storedComponent)) {
            FocusManager._removeComponentTabIndexOverride(storedComponent.component as FocusableComponentInternal);
            delete storedComponent.origTabIndex;
            FocusManager._callFocusableComponentStateChangeCallbacks(storedComponent, false);
        }
    }

    private static _setComponentTabIndexOverride(component: FocusableComponentInternal, tabIndex: number): number | undefined {
        // Save the override on a custom property
        component.tabIndexOverride = tabIndex;

        // Refresh the native view
        updateNativeTabIndex(component);

        // Original value is not used for desktop implementation
        return undefined;
    }

    private static  _removeComponentTabIndexOverride(component: FocusableComponentInternal): void {
        // Remove any override
        delete component.tabIndexOverride;

        // Refresh the native view
        updateNativeTabIndex(component);
    }
}

function updateNativeTabIndex(component: FocusableComponentInternal) {
    // Call special method on component avoiding state changes/re-renderings
    if (component.updateNativeTabIndex) {
        component.updateNativeTabIndex();
    } else {
        if (AppConfig.isDevelopmentMode()) {
            console.error('FocusableComponentMixin: updateNativeTabIndex doesn\'t exist!');
        }
    }
}

export function applyFocusableComponentMixin(Component: any, isConditionallyFocusable?: Function) {
    // Call base
    // This adds the basic "monitor focusable components" functionality.
    applyFocusableComponentMixinBase(Component, isConditionallyFocusable);

    // Hook 'onFocus'
    inheritMethod('onFocus', function (this: FocusableComponentInternal, origCallback: Function) {
        if (this.onFocusSink) {
            this.onFocusSink();
        } else {
            if (AppConfig.isDevelopmentMode()) {
                console.error('FocusableComponentMixin: onFocusSink doesn\'t exist!');
            }
        }

        origCallback.call(this);
    });

    // Hook 'getTabIndex'
    inheritMethod('getTabIndex', function (this: FocusableComponentInternal, origCallback: any) {
        // Check local override first, then focus manager one
        if (this.tabIndexLocalOverride !== undefined) {
            // Local override available, use this one
            return this.tabIndexLocalOverride;
        } else if (this.tabIndexOverride !== undefined) {
            // Override available, use this one
            return this.tabIndexOverride;
        } else {
            // Override not available, defer to original handler to return the prop
            return origCallback.call(this);
        }
    });

    if (isNativeWindows) {
        // UWP platform (at least) is slightly stricter with regard to tabIndex combinations. The "component focusable but not in tab order"
        // case (usually encoded with tabIndex<0 for browsers) is not supported. A negative tabIndex disables focusing/keyboard input
        // completely instead (though a component already having keyboard focus doesn't lose it right away).
        // We try to simulate the right behavior through a trick.
        inheritMethod('focus', function (this: FocusableComponentInternal, origCallback: any) {
            let tabIndex: number | undefined = this.getTabIndex();
            // Check effective tabIndex
            if (tabIndex !== undefined && tabIndex < 0) {
                // A negative tabIndex maps to non focusable in UWP.
                // We temporary apply a local override of "tabIndex=0", and then forward the focus command.
                // A timer makes sure the tabIndex returns back to "non-overriden" state.
                // - If the component is not under FocusManager control (a View with tabIndex===-1, for ex.), the only action
                // available for user is to tab out.
                // - If the component is under FocusManager control, the "tabIndex===-1" is usually due to a limit imposed on the component,
                // and that limit is usually removed when component aquires focus. If not, the user has again one only choice left: to
                // tab out.
                // A more accurate solution would require tracking onBlur and other state.
                this.tabIndexLocalOverride = 0;

                // Refresh the native view
                updateNativeTabIndex(this);

                this.tabIndexLocalOverrideTimer = setTimeout(() => {
                    if (this.tabIndexLocalOverrideTimer !== undefined) {
                        this.tabIndexLocalOverrideTimer = undefined;
                        // Remove override
                        delete this.tabIndexLocalOverride;

                        // Refresh the native view
                        updateNativeTabIndex(this);
                    }
                }, 500);
            }

            // To original
            return origCallback.call(this);
        });

        inheritMethod('componentWillUnmount', function (this: FocusableComponentInternal, origCallback: any) {
            // Reset any pending local override timer
            delete this.tabIndexLocalOverrideTimer;
            // To original (base mixin already has an implementation)
            return origCallback.call(this);
        });
    }

    function inheritMethod(methodName: string, action: Function) {
        let origCallback = Component.prototype[methodName];

        if (origCallback) {
            Component.prototype[methodName] = function () {
                return action.call(this, origCallback, arguments);
            };
        } else {
            if (AppConfig.isDevelopmentMode()) {
                console.error('FocusableComponentMixin: ' + methodName + ' is expected to exist and it doesn\'t!');
            }
        }
    }
}

export default FocusManager;
