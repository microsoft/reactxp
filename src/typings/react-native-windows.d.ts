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
    import * as React from 'react';
    import * as RN from 'react-native';

    interface TextWindowsSelectionChangeEventData {
        selectedText: string;
    }

    interface TextWindowsProps {
        children?: React.ReactNode;
        onSelectionChange?: (e: RN.NativeSyntheticEvent<TextWindowsSelectionChangeEventData>) => void;
    }

    interface AccessibilityEvents {
        onAccessibilityTap?: (e: RN.NativeSyntheticEvent<any>) => void;
    }

    interface ViewProps {
        tabNavigation?: 'cycle' | 'local';
    }

    //
    // Focusable view related declarations
    // ----------------------------------------------------------------------
    type FocusableWindowsProps<P = {}> = P & {
        ref?: (current: any) => void;
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
