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
        onMouseEnter?: Function;
        onMouseLeave?: Function;
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

    interface AccessibilityInfoStaticExtended extends RN.AccessibilityInfoStatic {
        static initialHighContrast: boolean|undefined;
    }
}
