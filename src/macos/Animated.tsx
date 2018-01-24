/**
* Animated.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Animation abstraction.
*/
import React = require('react');
import RN = require('react-native');
import RX = require('../common/Interfaces');
import Types = require('../common/Types');

import { Animated as AnimatedBase } from '../native-common/Animated';

import MacTextInput from './TextInput';

// Uses mac specific View and TextInput
const ReactNativeAnimatedClasses = {
    TextInput: RN.Animated.createAnimatedComponent(MacTextInput),
};

export class AnimatedTextInput extends RX.AnimatedTextInput {
    protected _mountedComponent: RN.ReactNativeBaseComponent<any, any>|null = null;

    setNativeProps(props: Types.AnimatedTextInputProps) {
        if (this._mountedComponent && this._mountedComponent.setNativeProps) {
            this._mountedComponent.setNativeProps(props);
        }
    }

    focus() {
        if (this._mountedComponent && this._mountedComponent.focus) {
            this._mountedComponent.focus();
        }
    }

    blur() {
        if (this._mountedComponent && this._mountedComponent.blur) {
            this._mountedComponent.blur();
        }
    }

    render() {
        return (
            <ReactNativeAnimatedClasses.TextInput
                ref={ this._onMount }
                { ...this.props }
                style={ this.props.style }
            />
        );
    }

    protected _onMount = (component: RN.ReactNativeBaseComponent<any, any>|null) => {
        this._mountedComponent = component;
    }
}

export var Animated = {
    Image: AnimatedBase.Image  as typeof RX.AnimatedImage,
    Text: AnimatedBase.Text as typeof RX.AnimatedText,
    TextInput: AnimatedTextInput,
    View: AnimatedBase.View as typeof RX.AnimatedView,
    Easing: AnimatedBase.Easing as Types.Animated.Easing,
    timing: AnimatedBase.timing,
    delay: AnimatedBase.delay,
    parallel: AnimatedBase.parallel,
    sequence: AnimatedBase.sequence,

    Value: RN.Animated.Value,
    createValue: (initialValue: number) => new RN.Animated.Value(initialValue),
    interpolate: (animatedValue: Types.AnimatedValue, inputRange: number[], outputRange: string[]) => {
        return animatedValue.interpolate({
            inputRange: inputRange,
            outputRange: outputRange
        });
    }

};

export default Animated;
