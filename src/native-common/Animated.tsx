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
    View: RN.Animated.createAnimatedComponent(RXView)
};

export class AnimatedImage extends RX.AnimatedImage {
    private _mountedComponent: typeof ReactNativeAnimatedClasses.Image;

    setNativeProps(props: Types.AnimatedImageProps) {
        if (this._mountedComponent && this._mountedComponent.setNativeProps) {
            this._mountedComponent.setNativeProps(props);
        }
    }

    render() {
        return (
            <ReactNativeAnimatedClasses.Image
                ref={ this._onMount }
                { ...this.props }
                style={ this.props.style }
            >
                { this.props.children }
            </ReactNativeAnimatedClasses.Image>
        );
    }

    protected _onMount = (component: RN.ReactNativeBaseComponent<any, any>|null) => {
        this._mountedComponent = component;
    }
}

export class AnimatedText extends RX.AnimatedText {
    private _mountedComponent: typeof ReactNativeAnimatedClasses.Text;

    setNativeProps(props: Types.AnimatedTextProps) {
        if (this._mountedComponent && this._mountedComponent.setNativeProps) {
            this._mountedComponent.setNativeProps(props);
        }
    }

    render() {
        return (
            <ReactNativeAnimatedClasses.Text
                ref={ this._onMount }
                { ...this.props }
                style={ this.props.style }
            >
                { this.props.children }
            </ReactNativeAnimatedClasses.Text>
        );
    }

    protected _onMount = (component: RN.ReactNativeBaseComponent<any, any>|null) => {
        this._mountedComponent = component;
    }
}

export class AnimatedTextInput extends RX.AnimatedTextInput {
    private _mountedComponent: typeof ReactNativeAnimatedClasses.TextInput;

    setNativeProps(props: Types.AnimatedTextInputProps) {
        if (this._mountedComponent && this._mountedComponent.setNativeProps) {
            this._mountedComponent.setNativeProps(props);
        }
    }

    focus() {
        if (this._mountedComponent && this._mountedComponent._component) {
            if (this._mountedComponent._component.focus) {
                this._mountedComponent._component.focus();
            }
        }
    }

    blur() {
        if (this._mountedComponent && this._mountedComponent._component) {
            if (this._mountedComponent._component.blur) {
                this._mountedComponent._component.blur();
            }
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

export class AnimatedView extends RX.AnimatedView {
    protected _mountedComponent: RN.ReactNativeBaseComponent<any, any>|null = null;

    setNativeProps(props: Types.AnimatedViewProps) {
        if (this._mountedComponent && this._mountedComponent.setNativeProps) {
            this._mountedComponent.setNativeProps(props);
        }
    }

    focus() {
        // Native mobile platform doesn't have the notion of focus for AnimatedViews, so ignore.
    }

    blur() {
        // Native mobile platform doesn't have the notion of blur for AnimatedViews, so ignore.
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
                ref={ this._onMount }
                { ...this.props }
                style={ this.props.style }
            >
                { this.props.children }
            </ReactNativeAnimatedClasses.View>
        );
    }

    protected _onMount = (component: RN.ReactNativeBaseComponent<any, any>|null) => {
        this._mountedComponent = component;
    }
}

let timing = function(
    value: Types.AnimatedValue,
    config: Types.Animated.TimingAnimationConfig)
    : Types.Animated.CompositeAnimation {

    let isLooping = config.loop !== undefined && config.loop != null;
    return {
        start: function(onEnd?: Types.Animated.EndCallback): void {
            function animate() : void {
                const timingConfig: RN.Animated.TimingAnimationConfig = {
                    toValue: config.toValue,
                    easing: config.easing ? config.easing.function : undefined,
                    duration: config.duration,
                    delay: config.delay,
                    isInteraction: config.isInteraction,
                    useNativeDriver: config.useNativeDriver
                };

                RN.Animated.timing(value as RN.Animated.Value, timingConfig).start(result => {
                    if (onEnd) {
                        onEnd(result);
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

export let Animated = {
    Image: AnimatedImage,
    Text: AnimatedText,
    TextInput: AnimatedTextInput,
    View: AnimatedView,
    Easing: Easing as Types.Animated.Easing,

    timing: timing,
    delay: RN.Animated.delay,
    parallel: RN.Animated.parallel,
    sequence: RN.Animated.sequence,

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
