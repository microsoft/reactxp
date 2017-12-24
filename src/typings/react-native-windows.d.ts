/**
* react-native-windows.d.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Type definition file for React Native Windows
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
        isTabStop?                      : boolean;
        tabIndex?                       : number;
        tabNavigation?                  : string; // enum( 'local', 'cycle', 'once' );
        disableSystemFocusVisuals?      : boolean;
        onFocus?                        : Function;
        onBlur?                         : Function;
        handledKeyDownKeys?             : number[];
        handledKeyUpKeys?               : number[];
        onKeyDown?                      : Function;
        onKeyUp?                        : Function;
    }

    class FocusableWindows extends RN.ReactNativeBaseComponent<FocusableProps, {}> { }

    //
    // Declarations for "enhanced" components
    // Even though this is a good place to define these and to avoid poluting react-native.d.ts, truth is
    // the real life objects will be visible in the ReactNative namespace rather than ReactWindows
    // ----------------------------------------------------------------------
    interface ScrollViewProps extends RN.ScrollViewProps {
        onKeyDown?                      : Function;
        onKeyUp?                        : Function;
        tabNavigation?                  : string; // enum( 'local', 'cycle', 'once' );
        disableKeyboardBasedScrolling?  : boolean;
    }
    class ScrollView extends RN.ReactNativeBaseComponent<ScrollViewProps, {}> { }

    interface TextInputProps extends RN.TextInputProps {
        tabIndex?                       : number;
    }
    class TextInput extends RN.ReactNativeBaseComponent<TextInputProps, {}>
    {
        static State: RN.TextInputState;
    }
}
