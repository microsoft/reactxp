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
    setTabIndexOverride(tabIndex: number): void;
    removeTabIndexOverride(): void;
    onFocusSink?: () => void;
}

export class FocusManager extends FocusManagerBase {

    constructor(parent: FocusManager | undefined) {
        super(parent);
    }

    protected /* static */ addFocusListenerOnComponent(component: FocusableComponentInternal,
         onFocus: () => void): void {
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
                if (!storedComponent || storedComponent.restricted || (storedComponent.limitedCount > 0)) {
                    FocusManager.focusFirst();
                }
            }, 100);
        }
    }

    protected /* static */  _updateComponentFocusRestriction(storedComponent: StoredFocusableComponent) {
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

    private  static  _setComponentTabIndexOverride(
        component: FocusableComponentInternal, tabIndex: number): number | undefined {

        component.setTabIndexOverride(tabIndex);
        // Original value is not used for desktop implementation
        return undefined;
    }

    private  static  _removeComponentTabIndexOverride(
        component: FocusableComponentInternal): void {
        component.removeTabIndexOverride();
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
                console.error('FocusableComponentMixin: focus sink error!');
            }
        }

        origCallback.call(this);
    });

    // Hook 'getTabIndex'
    inheritMethod('getTabIndex', function (this: FocusableComponentInternal, origCallback: any) {
        // Check override available
        if (this.tabIndexOverride !== undefined) {
            // Override available, use this one
            return this.tabIndexOverride;
        } else {
            // Override not available, defer to original handler to return the prop
            return origCallback.call(this);
        }
    });

    // Implement 'setTabIndexOverride'
    Component.prototype['setTabIndexOverride'] = function (this: FocusableComponentInternal, tabIndex: number) {
        // Save the override on a custom property
        this.tabIndexOverride = tabIndex;

        // Call special method on component avoiding state changes/re-renderings
        if (this.updateNativeTabIndex) {
            this.updateNativeTabIndex();
        } else {
            if (AppConfig.isDevelopmentMode()) {
                console.error('FocusableComponentMixin: updateNativeTabIndex error!');
            }
        }
    };

    // Implement 'setTabIndexOverride'
    Component.prototype['removeTabIndexOverride'] = function (this: FocusableComponentInternal) {
        // Remove the cached override
        delete this.tabIndexOverride;

        // Reset to original value avoiding state changes/re-renderings
        if (this.updateNativeTabIndex) {
            this.updateNativeTabIndex();
        } else {
            if (AppConfig.isDevelopmentMode()) {
                console.error('FocusableComponentMixin: updateNativeTabIndex error!');
            }
        }
    };

    if (isNativeWindows) {
        // UWP platform (at least) is slightly stricter with regard to tabIndex combinations. The "component focusable but not in tab order"
        // case (usually encoded with tabIndex<0 for browsers) is not supported. A negative tabIndex disables focusing/keyboard input
        // completely instead (though a component already having keyboard focus doesn't lose it right away).
        // Even though a comprehensive fix may be needed, we currently fix this partially by simulating the expected behavior on
        // components monitored by FocusManager only:
        // - Calling "focus" on a component with an effective tabIndex<0 forces an override of "tabIndex=0" first. Subsequent onFocus
        // syncronizes the FocusManager internal state and hopefully maintains the component out of any focusing restriction.
        //

        inheritMethod('focus', function (this: FocusableComponentInternal, origCallback: any) {

            let tabIndex: number | undefined = this.getTabIndex();

            if (tabIndex === undefined || tabIndex < 0) {
                this.setTabIndexOverride(0);
            }

            // To original
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
                console.error('FocusableComponentMixin: ' + methodName + ' error!');
            }
        }
    }
}

export default FocusManager;
