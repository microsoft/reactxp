/**
* react-native-quick-actions.d.ts
* Author: Sebastien Vachon
* Copyright: Microsoft 2016
*
* Type definition file for the React Native quick actions.
*/

declare module 'react-native-quick-actions' {
    import React = require('react-native');

    interface QuickAction {
        title: string,
        type: string,
        userInfo: { [key: string]: string }
    }

    function popInitialAction(): QuickAction;
    function setShortcutItems(items: { [key: string]: string }): void;
    function clearShortcutItems(): void;
}
