/**
* AutoFocusHelper.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Provides the logic to decide if the component needs to be autofocused
* on mount, depending on a combination of AutoFocus enum values.
*/

import Types = require('../Types');

let _isAndroid = false;
let _isIOS = false;
let _isWeb = false;
let _isWindows = false;
let _isMac = false;

let _isNavigatingWithKeyboard: () => boolean;

let _autoFocusTimer: number|undefined;
let _pendingAutoFocusItems: AutoFocusItem[] = [];

enum AutoFocusPriority {
    High,
    Low
}

interface AutoFocusItem {
    focus: () => void;
    isAvailable: () => boolean;
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

export function autoFocusIfNeeded(value: Types.AutoFocus|Types.AutoFocus[], focus: () => void, isAvailable: () => boolean): boolean {
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
            case Types.AutoFocus.No:
                return false;

            case Types.AutoFocus.Yes:
                isPlatformSpecified = shouldFocusAndroid = shouldFocusIOS = shouldFocusWeb = shouldFocusWindows = shouldFocusMac = true;
                isKeyboardSpecified = shouldFocusWhenNavigatingWithKeyboard = shouldFocusWhenNavigatingWithoutKeyboard = true;
                break;

            case Types.AutoFocus.WhenNavigatingWithKeyboard:
                shouldFocusWhenNavigatingWithKeyboard = isKeyboardSpecified = true;
                break;

            case Types.AutoFocus.WhenNavigatingWithoutKeyboard:
                shouldFocusWhenNavigatingWithoutKeyboard = isKeyboardSpecified = true;
                break;

            case Types.AutoFocus.Android:
                shouldFocusAndroid = isPlatformSpecified = true;
                break;

            case Types.AutoFocus.IOS:
                shouldFocusIOS = isPlatformSpecified = true;
                break;

            case Types.AutoFocus.Web:
                shouldFocusWeb = isPlatformSpecified = true;
                break;

            case Types.AutoFocus.Windows:
                shouldFocusWindows = isPlatformSpecified = true;
                break;

            case Types.AutoFocus.Mac:
                shouldFocusMac = isPlatformSpecified = true;
                break;

            case Types.AutoFocus.PriorityHigh:
                priority = AutoFocusPriority.High;
                break;

            case Types.AutoFocus.PriorityLow:
                priority = AutoFocusPriority.Low;
                break;

            case Types.AutoFocus.Delay100:
                delay = 100;
                break;

            case Types.AutoFocus.Delay500:
                delay = 500;
                break;

            case Types.AutoFocus.Delay1000:
                delay = 1000;
                break;
        }
    }

    if (isKeyboardSpecified) {
        const isNavigatingWithKeyboard = _isNavigatingWithKeyboard();

        if ((isNavigatingWithKeyboard && !shouldFocusWhenNavigatingWithKeyboard) ||
            (!isNavigatingWithKeyboard && !shouldFocusWhenNavigatingWithoutKeyboard)) {

            return false;
        }
    }

    if (isPlatformSpecified &&
        ((_isAndroid && !shouldFocusAndroid) || (_isIOS && !shouldFocusIOS) || (_isWeb && !shouldFocusWeb) ||
         (_isWindows && !shouldFocusWindows) || (_isMac && !shouldFocusMac))) {

        return false;
    }

    _pendingAutoFocusItems.push({
        focus,
        isAvailable,
        delay,
        priority,
        order: _pendingAutoFocusItems.length
    });

    if (_autoFocusTimer) {
        clearTimeout(_autoFocusTimer);
    }

    // Defer the action to wait for all components which are being mounted at
    // the same tick.
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
                if (autoFocusItem.isAvailable()) {
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

    return true;
}
