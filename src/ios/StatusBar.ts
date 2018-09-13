/**
 * StatusBar.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * iOS-specific implementation of StatusBar APIs.
 */

import * as RN from 'react-native';

import * as RX from '../common/Interfaces';

export class StatusBar extends RX.StatusBar {
    isOverlay(): boolean {
        // iOS always draws the status bar as an overlay, as opposed
        // to a view that takes up space of its own.
        return true;
    }

    setBarStyle(style: 'default' | 'light-content' | 'dark-content', animated: boolean): void {
        RN.StatusBar.setBarStyle(style, animated);
    }

    setHidden(hidden: boolean, showHideTransition: 'fade' | 'slide'): void {
        RN.StatusBar.setHidden(hidden, showHideTransition);
    }

    setNetworkActivityIndicatorVisible(value: boolean): void {
        RN.StatusBar.setNetworkActivityIndicatorVisible(value);
    }

    setBackgroundColor(color: string, animated: boolean): void {
        // Nothing to do on iOS
    }

    setTranslucent(translucent: boolean): void {
        // Nothing to do on iOS
    }
}

export default new StatusBar();
