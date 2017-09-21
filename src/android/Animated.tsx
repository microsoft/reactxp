/**
* Animated.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific implementation of Animated wrapper.
*/

import React = require('react');
import RN = require('react-native');

import RX = require('../common/Interfaces');
import CommonAnimated from '../native-common/Animated';
import RXText from './Text';
import Types = require('../common/Types');

var ReactAnimatedText = RN.Animated.createAnimatedComponent(RXText);

export class AnimatedText extends CommonAnimated.Text {
   render() {
        return (
            <ReactAnimatedText
                ref='nativeComponent'
                { ...this.props }
                style={ this.props.style }
            >
                { this.props.children }
            </ReactAnimatedText>
        );
    }
}

export type AnimatedValue = typeof CommonAnimated.Value;

export var Animated = {
    Image: CommonAnimated.Image as typeof RX.AnimatedImage,
    Text: AnimatedText as typeof RX.AnimatedText,
    TextInput: CommonAnimated.TextInput as typeof RX.AnimatedTextInput,
    View: CommonAnimated.View as typeof RX.AnimatedView,
    Easing: CommonAnimated.Easing as Types.Animated.Easing,
    timing: CommonAnimated.timing as Types.Animated.TimingFunction,
    delay: CommonAnimated.delay,
    parallel: CommonAnimated.parallel,
    sequence: CommonAnimated.sequence,

    // NOTE: Direct access to "Value" will be going away in the near future.
    // Please move to createValue and createInterpolatedValue instead.
    Value: RN.Animated.Value,
    createValue: (initialValue: number) => new RN.Animated.Value(initialValue),
    createInterpolatedValue: (initialValue: number, inputRange: number[], outputRange: string[]) => {
        let value = new RN.Animated.Value(initialValue);
        return value.interpolate({
            inputRange: inputRange,
            outputRange: outputRange
        });
    }
};

export default Animated;
