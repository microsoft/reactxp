/**
* StatusBar.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* MacOS-specific implementation of StatusBar APIs.
*/

import RX = require('../common/Interfaces');

export class StatusBar extends RX.StatusBar {
    isOverlay(): boolean {
        // No status bar support on MacOS
        return false;
    }

    setHidden(hidden: boolean, showHideTransition: 'fade' | 'slide'): void {
        // Nothing to do on MacOS
    }

    setBackgroundColor(color: string, animated: boolean): void {
        // Nothing to do on MacOS
    }

    setTranslucent(translucent: boolean): void {
        // Nothing to do on MacOS
    }

    setBarStyle(style: 'default' | 'light-content' | 'dark-content', animated: boolean): void {
        // Nothing to do on MacOS
    }

    setNetworkActivityIndicatorVisible(value: boolean): void {
        // Nothing to do on MacOS
    }
}

export default new StatusBar();
