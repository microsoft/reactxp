/**
 * StatusBar.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Windows-specific implementation of StatusBar APIs.
 */

import * as RX from '../common/Interfaces';

export class StatusBar extends RX.StatusBar {
    isOverlay(): boolean {
        // We currently only care about Windows desktop which doesn't have a
        // status bar.
        return false;
    }

    setHidden(hidden: boolean, showHideTransition: 'fade' | 'slide'): void {
        // Nothing to do on Windows
    }

    setBackgroundColor(color: string, animated: boolean): void {
        // Nothing to do on Windows
    }

    setTranslucent(translucent: boolean): void {
        // Nothing to do on Windows
    }

    setBarStyle(style: 'default' | 'light-content' | 'dark-content', animated: boolean): void {
        // Nothing to do on Windows
    }

    setNetworkActivityIndicatorVisible(value: boolean): void {
        // Nothing to do on Windows
    }
}

export default new StatusBar();
