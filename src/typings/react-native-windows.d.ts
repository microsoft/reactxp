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
    type FocusableWindowsProps<P={}> = P & {
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
        componentRef?: Function;
        onAccessibilityTap?: Function;
    };

    interface FocusableWindows<P> extends RN.ReactNativeBaseComponent<FocusableWindowsProps<P>, {}>{
        focus(): void;
        blur(): void;
    }

    type FocusableComponentConstructor<P> = new() => FocusableWindows<P>;

    function createFocusableComponent<P>(Component: any): FocusableComponentConstructor<P>;

    type HyperlinkWindowsProps = RN.TextProps & {
        onFocus?: Function;
        onBlur?: Function;
    }

    class HyperlinkWindows extends RN.ReactNativeBaseComponent<HyperlinkWindowsProps, {}> {
        focus(): void;
        blur(): void;
    }

    type RootInputViewWindowsProps = RN.ViewProps & {
        onAccelKeyDown?: Function;
        onAccelKeyUp?: Function;
        onTouchStartCapture?: Function;
    }

    class RootInputViewWindows extends RN.ReactNativeBaseComponent<RootInputViewWindowsProps, {}> {}
}
