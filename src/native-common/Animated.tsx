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

import Easing from '../common/Easing';
import Types = require('../common/Types');
import RXImage from './Image';
import RXView from './View';
import RXText from './Text';
import RXTextInput from './TextInput';
import RX = require('../common/Interfaces');

const ReactNativeAnimatedClasses = {
    Image: RN.Animated.createAnimatedComponent(RXImage),
    Text: RN.Animated.createAnimatedComponent(RXText),
    TextInput: RN.Animated.createAnimatedComponent(RXTextInput),
    View: RN.Animated.createAnimatedComponent(RXView, true)
};

export class AnimatedImage extends RX.AnimatedImage {
    setNativeProps(props: Types.AnimatedImageProps) {
        const nativeComponent = this.refs['nativeComponent'] as any;
        if (nativeComponent) {
            if (!nativeComponent.setNativeProps) {
                throw 'Component does not implement setNativeProps';
            }
            nativeComponent.setNativeProps(props);
        }
    }

    render() {
        return (
            <ReactNativeAnimatedClasses.Image
                ref='nativeComponent'
                { ...this.props }
                style={ this.props.style }
            >
                { this.props.children }
            </ReactNativeAnimatedClasses.Image>
        );
    }
}

export class AnimatedText extends RX.AnimatedText {
    setNativeProps(props: Types.AnimatedTextProps) {
        const nativeComponent = this.refs['nativeComponent'] as any;
        if (nativeComponent) {
            if (!nativeComponent.setNativeProps) {
                throw 'Component does not implement setNativeProps';
            }
            nativeComponent.setNativeProps(props);
        }
    }

    render() {
        return (
            <ReactNativeAnimatedClasses.Text
                ref='nativeComponent'
                { ...this.props }
                style={ this.props.style }
            >
                { this.props.children }
            </ReactNativeAnimatedClasses.Text>
        );
    }
}

export class AnimatedTextInput extends RX.AnimatedTextInput {
    setNativeProps(props: Types.AnimatedTextInputProps) {
        const nativeComponent = this.refs['nativeComponent'] as any;
        if (nativeComponent) {
            if (!nativeComponent.setNativeProps) {
                throw 'Component does not implement setNativeProps';
            }
            nativeComponent.setNativeProps(props);
        }
    }

    focus() {
        const nativeComponent = this.refs['nativeComponent'] as any;
        if (nativeComponent && nativeComponent._component) {
            nativeComponent._component.focus();
        }
    }

    blur() {
        const nativeComponent = this.refs['nativeComponent'] as any;
        if (nativeComponent && nativeComponent._component) {
            nativeComponent._component.blur();
        }
    }

    render() {
        return (
            <ReactNativeAnimatedClasses.TextInput
                ref='nativeComponent'
                { ...this.props }
                style={ this.props.style }
            />
        );
    }
}

export class AnimatedView extends RX.AnimatedView {
    setNativeProps(props: Types.AnimatedViewProps) {
        const nativeComponent = this.refs['nativeComponent'] as any;
        if (nativeComponent) {
            if (!nativeComponent.setNativeProps) {
                throw 'Component does not implement setNativeProps';
            }
            nativeComponent.setNativeProps(props);
        }
    }

    focus() {
        // Native mobile platform doesn't have the notion of focus for AnimatedViews, so ignore
    }

    blur() {
        // Native mobile platform doesn't have the notion of blur for AnimatedViews, so ignore
    }

    setFocusRestricted(restricted: boolean) {
        // Nothing to do.
    }

    setFocusLimited(limited: boolean) {
        // Nothing to do.
    }

    render() {
        return (
            <ReactNativeAnimatedClasses.View
                ref='nativeComponent'
                { ...this.props }
                style={ this.props.style }
            >
                { this.props.children }
            </ReactNativeAnimatedClasses.View>
        );
    }
}

var timing = function(
    value: Types.AnimatedValue,
    config: Types.Animated.TimingAnimationConfig)
    : Types.Animated.CompositeAnimation {

    let isLooping = config.loop !== undefined && config.loop != null;
    return {
        start: function(callback?: Types.Animated.EndCallback): void {
            function animate() : void {
                const timingConfig: RN.AnimatedTimingConfig = {
                    toValue: config.toValue,
                    easing: config.easing ? config.easing.function : undefined,
                    duration: config.duration,
                    delay: config.delay,
                    isInteraction: config.isInteraction,
                    useNativeDriver: config.useNativeDriver
                };

                RN.Animated.timing(value, timingConfig).start((r) => {
                    if (callback) {
                        callback(r);
                    }

                    if (isLooping) {
                        value.setValue(config.loop!!!.restartFrom);
                        // Hack to get into the loop
                        animate();
                    }
                });
            }

            // Trigger animation loop (hack for now)
            animate();
        },

        stop: function(): void {
            isLooping = false;
            (value as any).stopAnimation();
        },
    };
};

export var Animated = {
    Image: AnimatedImage,
    Text: AnimatedText,
    TextInput: AnimatedTextInput,
    View: AnimatedView,
    Easing: Easing as Types.Animated.Easing,

    timing: timing,
    delay: RN.Animated.delay,
    parallel: RN.Animated.parallel,
    sequence: RN.Animated.sequence,

    // NOTE: Direct access to "Value" will be going away in the near future.
    // Please move to createValue and interpolate instead.
    Value: RN.Animated.Value,
    createValue: (initialValue: number) => new RN.Animated.Value(initialValue),
    interpolate: (animatedValue: RN.Animated.Value, inputRange: number[], outputRange: string[]) => {
        return animatedValue.interpolate({
            inputRange: inputRange,
            outputRange: outputRange
        });
    }
};

export default Animated;
