/**
* react-native-windows.d.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Type definition file for React Native Windows only components and modules
* Definitions for extensions pertaining to existing React Native components are merged into the reaxt-native.d.ts file.
*/

declare module 'react-native-windows' {
    //
    // React
    // ----------------------------------------------------------------------

    import React = require('react');
    import RN = require('react-native');

    //
    // Focusable view related declarations
    // ----------------------------------------------------------------------
    interface FocusableProps extends RN.ViewProps {
        isTabStop?: boolean;
        tabIndex?: number;
        tabNavigation?: 'local' | 'cycle' | 'once';
        disableSystemFocusVisuals?: boolean;
        onFocus?: Function;
        onBlur?: Function;
        handledKeyDownKeys?: number[];
        handledKeyUpKeys?: number[];
        onKeyDown?: Function;
        onKeyUp?: Function;
    }

    class FocusableWindows extends RN.ReactNativeBaseComponent<FocusableProps, {}> { }
}
