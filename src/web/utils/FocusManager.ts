/**
* FocusManager.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Manages focusable elements for better keyboard navigation (web version)
*/

import React = require('react');
import ReactDOM = require('react-dom');

import { FocusManager as FocusManagerBase,
    FocusableComponentInternal,
    StoredFocusableComponent,
    OriginalAttributeValues } from '../../common/utils/FocusManager';

import UserInterface from '../UserInterface';

const ATTR_NAME_TAB_INDEX = 'tabindex';
const ATTR_NAME_ARIA_HIDDEN = 'aria-hidden';

let _isNavigatingWithKeyboard: boolean;
let _isShiftPressed: boolean;

UserInterface.keyboardNavigationEvent.subscribe(isNavigatingWithKeyboard => {
    _isNavigatingWithKeyboard = isNavigatingWithKeyboard;
});

import { applyFocusableComponentMixin, FocusableComponentStateCallback } from  '../../common/utils/FocusManager';
export { applyFocusableComponentMixin, FocusableComponentStateCallback };

export class FocusManager extends FocusManagerBase {

    constructor(parent: FocusManager | undefined) {
        super(parent);
    }

    // Not really public
    public static initListeners(): void {
        // The default behaviour on Electron is to release the focus after the
        // Tab key is pressed on a last focusable element in the page and focus
        // the first focusable element on a consecutive Tab key press.
        // We want to avoid losing this first Tab key press.
        let _checkFocusTimer: number|undefined;

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

            if (FocusManager._skipFocusCheck) {
                // When in between the FocusManager restrictions,
                // don't check for the focus change here, FocusManager
                // will take care of it.
                FocusManager._skipFocusCheck = false;
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

    protected /* static */ addFocusListenerOnComponent(component: FocusableComponentInternal, onFocus: () => void): void {
        const el = ReactDOM.findDOMNode(component) as HTMLElement;
        if (el) {
            el.addEventListener('focus', onFocus);
        }
    }

    protected /* static */ removeFocusListenerFromComponent(component: FocusableComponentInternal, onFocus: () => void): void {
        const el = ReactDOM.findDOMNode(component) as HTMLElement;
        if (el) {
            el.removeEventListener('focus', onFocus);
        }
    }

    protected /* static */ focusComponent(component: FocusableComponentInternal): boolean {
        const el = ReactDOM.findDOMNode(component) as HTMLElement;
        if (el && el.focus) {
            el.focus();
            return true;
        }
        return false;
    }

    static focusFirst(last?: boolean) {
        const focusable = Object.keys(FocusManager._allFocusableComponents)
            .map(componentId => FocusManager._allFocusableComponents[componentId])
            .filter(storedComponent => !storedComponent.removed && !storedComponent.restricted && !storedComponent.limitedCount)
            .map(storedComponent => ReactDOM.findDOMNode(storedComponent.component) as HTMLElement)
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

    protected /* static */ resetFocus() {
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

    protected /* static */  _updateComponentFocusRestriction(storedComponent: StoredFocusableComponent) {
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

    private static _setComponentTabIndexAndAriaHidden(
            component: React.Component<any, any>, tabIndex: number|undefined, ariaHidden: string|undefined)
            : OriginalAttributeValues|undefined {

        const el = ReactDOM.findDOMNode(component) as HTMLElement;
        return el ?
            {
                tabIndex: FocusManager._setTabIndex(el, tabIndex),
                ariaHidden: FocusManager._setAriaHidden(el, ariaHidden)
            }
            :
            undefined;
    }

    private static _setTabIndex(element: HTMLElement, value: number|undefined): number|undefined {
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

    private static _setAriaHidden(element: HTMLElement, value: string|undefined): string|undefined {
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
}

if ((typeof document !== 'undefined') && (typeof window !== 'undefined')) {
    FocusManager.initListeners();
}

export default FocusManager;
