/**
 * FocusManager.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Manages focusable elements for better keyboard navigation (web version)
 */

import * as ReactDOM from 'react-dom';

import {
    FocusArbitratorProvider,
    FocusCandidateInternal,
    FocusCandidateType
} from '../../common/utils/AutoFocusHelper';
import {
    applyFocusableComponentMixin as applyFocusableComponentMixinCommon,
    FocusableComponentInternal,
    FocusableComponentStateCallback,
    FocusManager as FocusManagerBase,
    StoredFocusableComponent as StoredFocusableComponentBase
} from '../../common/utils/FocusManager';
import Timers from '../../common/utils/Timers';
import UserInterface from '../UserInterface';

const ATTR_NAME_TAB_INDEX = 'tabindex';
const ATTR_NAME_ARIA_HIDDEN = 'aria-hidden';
let _isShiftPressed: boolean;

export { FocusableComponentStateCallback };

export interface StoredFocusableComponent extends StoredFocusableComponentBase {
    origTabIndex?: number;
    origAriaHidden?: string;
    curTabIndex?: number;
    curAriaHidden?: boolean;
}

export class FocusManager extends FocusManagerBase {
    private static _setTabIndexTimer: number | undefined;
    private static _setTabIndexElement: HTMLElement | undefined;
    private static _lastFocusedProgrammatically: HTMLElement | undefined;

    constructor(parent: FocusManager | undefined) {
        super(parent);
    }

    // Not really public
    static initListeners(): void {
        // The default behaviour on Electron is to release the focus after the
        // Tab key is pressed on a last focusable element in the page and focus
        // the first focusable element on a consecutive Tab key press.
        // We want to avoid losing this first Tab key press.
        let _checkFocusTimer: number | undefined;

        // Checking if Shift is pressed to move the focus into the right direction.
        window.addEventListener('keydown', event => {
            _isShiftPressed = event.shiftKey;
        });
        window.addEventListener('keyup', event => {
            _isShiftPressed = event.shiftKey;
        });

        document.body.addEventListener('focusout', event => {
            if (!UserInterface.isNavigatingWithKeyboard() || (event.target === document.body)) {
                return;
            }

            if (_checkFocusTimer) {
                clearTimeout(_checkFocusTimer);
            }

            if (FocusManager._skipFocusCheck) {
                // When in between the FocusManager restrictions,
                // don't check for the focus change here, FocusManager
                // will take care of it.
                FocusManager._skipFocusCheck = false;
                return;
            }

            _checkFocusTimer = Timers.setTimeout(() => {
                _checkFocusTimer = undefined;

                if (UserInterface.isNavigatingWithKeyboard() &&
                        (!FocusManager._currentFocusedComponent || !FocusManager._currentFocusedComponent.removed) &&
                        (!document.activeElement || (document.activeElement === document.body))) {
                    // This should work for Electron and the browser should
                    // send the focus to the address bar anyway.
                    FocusManager.focusFirst(_isShiftPressed);
                }
            }, 100);
        });
    }

    protected addFocusListenerOnComponent(component: FocusableComponentInternal, onFocus: () => void): void {
        try {
            const el = ReactDOM.findDOMNode(component) as HTMLElement | null;
            if (el) {
                el.addEventListener('focus', onFocus);
            }
        } catch {
            // Swallow exception due to component unmount race condition.
        }
    }

    protected removeFocusListenerFromComponent(component: FocusableComponentInternal, onFocus: () => void): void {
        try {
            const el = ReactDOM.findDOMNode(component) as HTMLElement | null;
            if (el) {
                el.removeEventListener('focus', onFocus);
            }
        } catch {
            // Swallow exception due to component unmount race condition.
        }
    }

    protected focusComponent(component: FocusableComponentInternal): boolean {
        try {
            const el = ReactDOM.findDOMNode(component) as HTMLElement | null;
            if (el && el.focus) {
                FocusManager.setLastFocusedProgrammatically(el);
                el.focus();
                return true;
            }
        } catch {
            // Swallow exception due to component unmount race condition.
        }
        return false;
    }

    static setLastFocusedProgrammatically(element: HTMLElement | undefined) {
        this._lastFocusedProgrammatically = element;
    }

    static getLastFocusedProgrammatically(reset?: boolean): HTMLElement | undefined {
        const ret = FocusManager._lastFocusedProgrammatically;
        if (ret && reset) {
            FocusManager._lastFocusedProgrammatically = undefined;
        }
        return ret;
    }

    private static _isComponentAvailable(storedComponent: StoredFocusableComponent): boolean {
        return !storedComponent.accessibleOnly &&
            !storedComponent.removed &&
            !storedComponent.restricted &&
            storedComponent.limitedCount === 0 &&
            storedComponent.limitedCountAccessible === 0;
    }

    private static _getFirstFocusable(last?: boolean, parent?: FocusManager) {
        const focusable = Object.keys(FocusManager._allFocusableComponents)
            .filter(componentId => !parent || (componentId in parent._myFocusableComponentIds))
            .map(componentId => FocusManager._allFocusableComponents[componentId])
            .filter(FocusManager._isComponentAvailable)
            .map(storedComponent => ({ storedComponent, el: ReactDOM.findDOMNode(storedComponent.component) as HTMLElement }))
            .filter(f => f.el && f.el.focus && ((f.el.tabIndex || 0) >= 0) && !(f.el as any).disabled);

        if (focusable.length) {
            focusable.sort((a, b) => {
                // Some element which is mounted later could come earlier in the DOM,
                // so, we sort the elements by their appearance in the DOM.
                if (a === b) {
                    return 0;
                }
                return a.el.compareDocumentPosition(b.el) & document.DOCUMENT_POSITION_PRECEDING ? 1 : -1;
            });

            return focusable[last ? focusable.length - 1 : 0];
        }

        return undefined;
    }

    static focusFirst(last?: boolean) {
        const first = FocusManager._getFirstFocusable(last);

        if (first) {
            const storedComponent = first.storedComponent;

            FocusArbitratorProvider.requestFocus(
                storedComponent.component,
                () => {
                    FocusManager.setLastFocusedProgrammatically(first.el);
                    first.el.focus();
                },
                () => FocusManager._isComponentAvailable(storedComponent),
                FocusCandidateType.FocusFirst
            );
        }
    }

    protected /* static */ resetFocus(focusFirstWhenNavigatingWithKeyboard: boolean) {
        if (FocusManager._resetFocusTimer) {
            clearTimeout(FocusManager._resetFocusTimer);
            FocusManager._resetFocusTimer = undefined;
        }

        if (UserInterface.isNavigatingWithKeyboard() && focusFirstWhenNavigatingWithKeyboard) {
            // When we're in the keyboard navigation mode, we want to have the
            // first focusable component to be focused straight away, without the
            // necessity to press Tab.
            const first = FocusManager._getFirstFocusable(false, FocusManager._currentRestrictionOwner as FocusManager);

            if (first) {
                const storedComponent = first.storedComponent;

                FocusArbitratorProvider.requestFocus(
                    storedComponent.component,
                    () => {
                        FocusManager.setLastFocusedProgrammatically(first.el);
                        first.el.focus();
                    },
                    () => FocusManager._isComponentAvailable(storedComponent),
                    FocusCandidateType.FocusFirst
                );
            }
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
            // Defer the work to avoid triggering sync layout.
            FocusManager._resetFocusTimer = Timers.setTimeout(() => {
                FocusManager._resetFocusTimer = undefined;

                const currentFocused = FocusManager._currentFocusedComponent;
                if (currentFocused && !currentFocused.removed && !currentFocused.restricted) {
                    // No need to reset the focus because it's moved inside the restricted area
                    // already (manually or with autofocus).
                    return;
                }

                const prevTabIndex = FocusManager._setTabIndex(document.body, -1);
                FocusManager.setLastFocusedProgrammatically(document.body);
                document.body.focus();
                document.body.blur();
                FocusManager._setTabIndex(document.body, prevTabIndex);
            }, 100);
        }
    }

    protected /* static */  _updateComponentFocusRestriction(storedComponent: StoredFocusableComponent) {
        const newAriaHidden = storedComponent.restricted || (storedComponent.limitedCount > 0) ? true : undefined;
        const newTabIndex = newAriaHidden || (storedComponent.limitedCountAccessible > 0) ? -1 : undefined;
        const restrictionRemoved = newTabIndex === undefined;

        if ((storedComponent.curTabIndex !== newTabIndex) || (storedComponent.curAriaHidden !== newAriaHidden)) {
            const el = ReactDOM.findDOMNode(storedComponent.component) as HTMLElement | null;

            if (el) {
                if (storedComponent.curTabIndex !== newTabIndex) {
                    storedComponent.curTabIndex = newTabIndex;

                    if (restrictionRemoved) {
                        FocusManager._setTabIndex(el, storedComponent.origTabIndex);
                    } else {
                        const prevTabIndex = FocusManager._setTabIndex(el, newTabIndex);
                        if (!('origTabIndex' in storedComponent)) {
                            storedComponent.origTabIndex = prevTabIndex;
                        }
                    }
                }

                if (storedComponent.curAriaHidden !== newAriaHidden) {
                    storedComponent.curAriaHidden = newAriaHidden;

                    if (restrictionRemoved) {
                        FocusManager._setAriaHidden(el, storedComponent.origAriaHidden);
                    } else {
                        const prevAriaHidden = FocusManager._setAriaHidden(el, newAriaHidden ? 'true' : undefined);
                        if (!('origAriaHidden' in storedComponent)) {
                            storedComponent.origAriaHidden = prevAriaHidden;
                        }
                    }
                }

                if (restrictionRemoved) {
                    delete storedComponent.origTabIndex;
                    delete storedComponent.origAriaHidden;
                }
            }

            FocusManager._callFocusableComponentStateChangeCallbacks(storedComponent, !restrictionRemoved);
        }
    }

    private static _setTabIndex(element: HTMLElement, value: number | undefined): number | undefined {
        // If a tabIndex assignment is pending for this element, cancel it now.
        if (FocusManager._setTabIndexTimer && element === FocusManager._setTabIndexElement) {
            clearTimeout(FocusManager._setTabIndexTimer);
            FocusManager._setTabIndexTimer = undefined;
        }

        const prev = element.hasAttribute(ATTR_NAME_TAB_INDEX) ? element.tabIndex : undefined;
        if (value === undefined) {
            if (prev !== undefined) {
                element.removeAttribute(ATTR_NAME_TAB_INDEX);
            }
        } else if (value !== prev) {
            // Setting tabIndex to -1 on the active element would trigger sync layout. Defer it.
            if (value === -1 && element === document.activeElement) {
                // If a tabIndex assignment is pending for another element, run it now as we know
                // that it's not active anymore.
                if (FocusManager._setTabIndexTimer) {
                    FocusManager._setTabIndexElement!.tabIndex = -1;
                    clearTimeout(FocusManager._setTabIndexTimer);
                    FocusManager._setTabIndexTimer = undefined;
                }

                FocusManager._setTabIndexElement = element;
                FocusManager._setTabIndexTimer = Timers.setTimeout(() => {
                    element.tabIndex = value;
                }, 0);
            } else {
                element.tabIndex = value;
            }
        }

        return prev;
    }

    private static _setAriaHidden(element: HTMLElement, value: string | undefined): string | undefined {
        const prev = element.hasAttribute(ATTR_NAME_ARIA_HIDDEN) ? element.getAttribute(ATTR_NAME_ARIA_HIDDEN) || undefined : undefined;

        if (value === undefined) {
            if (prev !== undefined) {
                element.removeAttribute(ATTR_NAME_ARIA_HIDDEN);
            }
        } else {
            element.setAttribute(ATTR_NAME_ARIA_HIDDEN, value);
        }

        return prev;
    }

    static sortAndFilterAutoFocusCandidates(candidates: FocusCandidateInternal[]): FocusCandidateInternal[] {
        return candidates
            .filter(candidate => {
                const id = (candidate.component as FocusableComponentInternal).focusableComponentId;
                if (id) {
                    const storedComponent = FocusManager._allFocusableComponents[id];
                    if (storedComponent &&
                        (storedComponent.removed ||
                            (storedComponent.limitedCount > 0) || (storedComponent.limitedCountAccessible > 0))) {
                        return false;
                    }
                }
                return true;
            })
            .map(candidate => ({ candidate, el: ReactDOM.findDOMNode(candidate.component) as HTMLElement }))
            .sort((a, b) => {
                // Some element which is mounted later could come earlier in the DOM,
                // so, we sort the elements by their appearance in the DOM.
                if (a === b) {
                    return 0;
                }
                return a.el.compareDocumentPosition(b.el) & document.DOCUMENT_POSITION_PRECEDING ? 1 : -1;
            })
            .map(ce => ce.candidate);
    }
}

export function applyFocusableComponentMixin(Component: any, isConditionallyFocusable?: Function) {
    applyFocusableComponentMixinCommon(Component, isConditionallyFocusable);

    const origFocus = Component.prototype.focus;

    if (origFocus) {
        Component.prototype.focus = function() {
            try {
                // tslint:disable-next-line
                const el = ReactDOM.findDOMNode(this) as HTMLElement | null;
                if (el) {
                    FocusManager.setLastFocusedProgrammatically(el);
                }
            } catch {
                // Swallow exception due to component unmount race condition.
            }

            // tslint:disable-next-line
            origFocus.apply(this, arguments);
        };
    }
}

if ((typeof document !== 'undefined') && (typeof window !== 'undefined')) {
    FocusManager.initListeners();
}

export default FocusManager;
