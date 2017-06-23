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
    Value: CommonAnimated.Value as typeof Types.AnimatedValue,
    Easing: CommonAnimated.Easing as Types.Animated.Easing,
    timing: CommonAnimated.timing as Types.Animated.TimingFunction,
    delay: CommonAnimated.delay,
    parallel: CommonAnimated.parallel,
    sequence: CommonAnimated.sequence
};

export default Animated;
