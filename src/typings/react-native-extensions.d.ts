/**
* react-native-extensions.d.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Type definition file that extends the public React Native type definition file.
*/

import React = require('react');
import RN = require('react-native');

declare module 'react-native' {
    interface ExtendedViewProps extends RN.ViewProps {
        onMouseEnter?: (e: RN.NativeSyntheticEvent) => void;
        onMouseLeave?: (e: RN.NativeSyntheticEvent) => void;
        onAccessibilityTapIOS?: (e: RN.NativeSyntheticEvent) => void;
        tooltip?: string;
    }

    interface ExtendedTextProps extends RN.TextProps {
        maxContentSizeMultiplier?: number;
        disableContextMenu?: boolean;
        tooltip?: string;
    }

    interface ExtendedTextInputProps extends RN.TextInputProps {
        onFocus?: (e: RN.NativeSyntheticEvent) => void;
        onBlur?: (e: RN.NativeSyntheticEvent) => void;
        onScroll?: (e: RN.NativeSyntheticEvent) => void;
        onPaste?: (e: RN.NativeSyntheticEvent) => void;
        maxContentSizeMultiplier?: number;
        tabIndex?: number;
    }

    interface ExtendedImageProps extends RN.ImageProps {
        shouldRasterizeIOS?: boolean;
        tooltip?: string;
    }

    abstract class ReactNativeBaseComponent<P, S> extends React.Component<P, S> {
        setNativeProps(nativeProps: P): void;
        focus(): void;
        blur(): void;
        measure(callback: ((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void)): void;
        measureLayout(relativeToNativeNode: number, onSuccess: ((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void), onFail: () => void): void;
        refs: {
            [key: string]: ReactNativeBaseComponent<any, any>;
        }
    }

    module Touchable {
        type RectOffset = {
            top: number,
            left: number,
            right: number,
            bottom: number
        }

        interface State {
            touchable: any
        }

        interface TouchableMixin extends React.Mixin<any, any> {
            touchableGetInitialState: () => State
            touchableHandleStartShouldSetResponder: () => {}
            touchableHandleResponderTerminationRequest: () => {}
            touchableHandleResponderGrant: (e: React.SyntheticEvent<any>, dispatchID: string) => {}
            touchableHandleResponderMove: (e: React.SyntheticEvent<any>) => {}
            touchableHandleResponderRelease: (e: React.SyntheticEvent<any>) => {}
            touchableHandleResponderTerminate: (e: React.SyntheticEvent<any>) => {}
            touchableHandleActivePressIn?: (e: React.SyntheticEvent<any>) => {}
            touchableHandleActivePressOut?: (e: React.SyntheticEvent<any>) => {}
            touchableHandlePress?: (e: React.SyntheticEvent<any>) => {}
            touchableHandleLongPress?: (e: React.SyntheticEvent<any>) => {}
            touchableGetHighlightDelayMS?: () => number
            touchableGetPressRectOffset?: () => RectOffset
        }

        var Mixin: TouchableMixin;
    }

    interface ExtendedAccessibilityInfoStatic extends RN.AccessibilityInfoStatic {
        static initialHighContrast: boolean|undefined;
    }

    interface ExtendedNativeSyntheticEvent extends NativeSyntheticEvent {
        persist?: () => void;
    }
}
