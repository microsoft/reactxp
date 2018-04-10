/**
* AutofocusHelper.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Provides the logic to decide if the component needs to be autofocused
* on mount, depending on a combination of AutofocusOnMount enum.
*/

import Types = require('../Types');

let _isAndroid = false;
let _isIOS = false;
let _isWeb = false;
let _isWindows = false;
let _isMac = false;

let _isNavigatingWithKeyboard: () => boolean;

let _autoFocusTimer: number|undefined;
let _pendingAutoFocusItems: AutoFocusAction[] = [];

enum AutoFocusPriority {
    High,
    Low
}

interface AutoFocusAction {
    focus: () => void;
    isMounted: () => boolean;
    delay: number;
    priority: AutoFocusPriority;
    order: number;
}

export function initAutoFocus(platform: Types.PlatformType, isNavigatingWithKeyboard: () => boolean) {
    switch (platform) {
        case 'web':
            _isWeb = true;
            break;

        case 'ios':
            _isIOS = true;
            break;

        case 'android':
            _isAndroid = true;
            break;

        case 'windows':
            _isWindows = true;
            break;

        case 'macos':
            _isMac = true;
            break;
    }

    _isNavigatingWithKeyboard = isNavigatingWithKeyboard;
}

export function autoFocusIfNeeded(value: Types.AutoFocusOnMount|Types.AutoFocusOnMount[], focus: () => void, isMounted: () => boolean) {
    if (!(value instanceof Array)) {
        value = [value];
    }

    let isPlatformSpecified = false;
    let shouldFocusAndroid = false;
    let shouldFocusIOS = false;
    let shouldFocusWeb = false;
    let shouldFocusWindows = false;
    let shouldFocusMac = false;

    let isKeyboardSpecified = false;
    let shouldFocusWhenNavigatingWithKeyboard = false;
    let shouldFocusWhenNavigatingWithoutKeyboard = false;

    let priority = AutoFocusPriority.Low;
    let delay = 0;

    for (let i = 0; i < value.length; i++) {
        switch (value[i]) {
            case Types.AutoFocusOnMount.No:
                return;

            case Types.AutoFocusOnMount.Yes:
                isPlatformSpecified = shouldFocusAndroid = shouldFocusIOS = shouldFocusWeb = shouldFocusWindows = shouldFocusMac = true;
                isKeyboardSpecified = shouldFocusWhenNavigatingWithKeyboard = shouldFocusWhenNavigatingWithoutKeyboard = true;
                break;

            case Types.AutoFocusOnMount.WhenNavigatingWithKeyboard:
                shouldFocusWhenNavigatingWithKeyboard = isKeyboardSpecified = true;
                break;

            case Types.AutoFocusOnMount.WhenNavigatingWithoutKeyboard:
                shouldFocusWhenNavigatingWithoutKeyboard = isKeyboardSpecified = true;
                break;

            case Types.AutoFocusOnMount.Android:
                shouldFocusAndroid = isPlatformSpecified = true;
                break;

            case Types.AutoFocusOnMount.IOS:
                shouldFocusIOS = isPlatformSpecified = true;
                break;

            case Types.AutoFocusOnMount.Web:
                shouldFocusWeb = isPlatformSpecified = true;
                break;

            case Types.AutoFocusOnMount.Windows:
                shouldFocusWindows = isPlatformSpecified = true;
                break;

            case Types.AutoFocusOnMount.Mac:
                shouldFocusMac = isPlatformSpecified = true;
                break;

            case Types.AutoFocusOnMount.PriorityHigh:
                priority = AutoFocusPriority.High;
                break;

            case Types.AutoFocusOnMount.PriorityLow:
                priority = AutoFocusPriority.Low;
                break;

            case Types.AutoFocusOnMount.Delay100:
                delay = 100;
                break;

            case Types.AutoFocusOnMount.Delay500:
                delay = 500;
                break;

            case Types.AutoFocusOnMount.Delay1000:
                delay = 1000;
                break;
        }
    }

    if (isKeyboardSpecified) {
        const isNavigatingWithKeyboard = _isNavigatingWithKeyboard();

        if ((isNavigatingWithKeyboard && !shouldFocusWhenNavigatingWithKeyboard) ||
            (!isNavigatingWithKeyboard && !shouldFocusWhenNavigatingWithoutKeyboard)) {

            return;
        }
    }

    if (isPlatformSpecified && (_isAndroid && !shouldFocusAndroid) || (_isIOS && !shouldFocusIOS)
        || (_isWeb && !shouldFocusWeb) || (_isWindows && !shouldFocusWindows) || (_isMac && !shouldFocusMac)) {

        return;
    }

    _pendingAutoFocusItems.push({
        focus,
        isMounted,
        delay,
        priority,
        order: _pendingAutoFocusItems.length
    });

    if (_autoFocusTimer) {
        clearTimeout(_autoFocusTimer);
    }

    // Defer the action to wait for all components mounted at the same tick.
    _autoFocusTimer = setTimeout(() => {
        _autoFocusTimer = undefined;

        // Sorting by (Autofocus priority, Order of mount).
        _pendingAutoFocusItems.sort((a, b) => {
            return a.priority === b.priority
                ? (a.order === b.order ? 0 : (a.order < b.order ? -1 : 1))
                : (a.priority === AutoFocusPriority.High ? -1 : 1);
        });

        const autoFocusItem = _pendingAutoFocusItems[0];
        _pendingAutoFocusItems = [];

        if (autoFocusItem) {
            const autoFocusAction = () => {
                if (autoFocusItem.isMounted()) {
                    autoFocusItem.focus();
                }
            };

            if (autoFocusItem.delay > 0) {
                _autoFocusTimer = setTimeout(() => {
                    _autoFocusTimer = undefined;
                    autoFocusAction();
                }, autoFocusItem.delay);
            } else {
                autoFocusAction();
            }
        }
    }, 0);
}
