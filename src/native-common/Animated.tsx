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

export interface AnimatedClasses {
    Image: typeof RN.ReactNativeBaseComponent;
    Text: typeof RN.ReactNativeBaseComponent;
    TextInput: typeof RN.ReactNativeBaseComponent;
    View: typeof RN.ReactNativeBaseComponent;
}

export const CommonAnimatedClasses: AnimatedClasses = {
    Image: RN.Animated.createAnimatedComponent(RXImage) as typeof RN.ReactNativeBaseComponent,
    Text: RN.Animated.createAnimatedComponent(RXText) as typeof RN.ReactNativeBaseComponent,
    TextInput: RN.Animated.createAnimatedComponent(RXTextInput) as typeof RN.ReactNativeBaseComponent,
    View: RN.Animated.createAnimatedComponent(RXView)  as typeof RN.ReactNativeBaseComponent
};

let animatedClasses: AnimatedClasses = CommonAnimatedClasses;

class AnimatedWrapper<P, T> extends RX.AnimatedComponent<P, T> {
    protected _mountedComponent: RN.ReactNativeBaseComponent<any, any> | null | undefined;

    setNativeProps(props: P) {
        if (this._mountedComponent && this._mountedComponent.setNativeProps) {
            this._mountedComponent.setNativeProps(props);
        }
    }

    focus() {
        const innerComponent = this._mountedComponent ? (this._mountedComponent as any)._component : undefined;
        if (innerComponent && innerComponent.focus) {
            innerComponent.focus();
        }
    }

    requestFocus() {
        const innerComponent = this._mountedComponent ? (this._mountedComponent as any)._component : undefined;
        if (innerComponent && innerComponent.requestFocus) {
            innerComponent.requestFocus();
        }
    }

    blur() {
        const innerComponent = this._mountedComponent ? (this._mountedComponent as any)._component : undefined;
        if (innerComponent && innerComponent.blur) {
            innerComponent.blur();
        }
    }

    protected _onMount = (component: RN.ReactNativeBaseComponent<any, any>|null) => {
        this._mountedComponent = component;
    }
}

class AnimatedImage extends AnimatedWrapper<Types.AnimatedImageProps, Types.Stateless> {
    render() {
        const additionalProps = { ref: this._onMount, style: this.props.style };
        return (
            <animatedClasses.Image
                { ...this.props }
                { ... additionalProps }
            >
                { this.props.children }
            </animatedClasses.Image>
        );
    }
}

class AnimatedText extends AnimatedWrapper<Types.AnimatedTextProps, Types.Stateless>  {
    render() {
        const additionalProps = { ref: this._onMount, style: this.props.style };
        return (
            <animatedClasses.Text
                { ...this.props }
                { ... additionalProps }
            >
                { this.props.children }
            </animatedClasses.Text>
        );
    }
}

class AnimatedTextInput extends AnimatedWrapper<Types.AnimatedTextInputProps, Types.Stateless>   {
    render() {
        const additionalProps = {ref: this._onMount, style: this.props.style };
        return (
            <animatedClasses.TextInput
                { ...this.props }
                { ... additionalProps }
            >
                { this.props.children }
            </animatedClasses.TextInput>
        );
    }
}

class AnimatedView extends AnimatedWrapper<Types.AnimatedViewProps, Types.Stateless> {
    setFocusRestricted(restricted: boolean) {
        // Nothing to do.
    }

    setFocusLimited(limited: boolean) {
        // Nothing to do.
    }

    render() {
        const additionalProps = {ref: this._onMount, style: this.props.style };
        return (
            <animatedClasses.View
                { ...this.props }
                { ... additionalProps }
            >
                { this.props.children }
            </animatedClasses.View>
        );
    }
}

class FocusRestrictedAnimatedView extends AnimatedView {
    setFocusRestricted(restricted: boolean) {
        const innerComponent = this._mountedComponent ? (this._mountedComponent as any)._component : undefined;
        if (innerComponent && innerComponent.setFocusRestricted) {
            innerComponent.setFocusRestricted(restricted);
        }
    }

    setFocusLimited(limited: boolean) {
        const innerComponent = this._mountedComponent ? (this._mountedComponent as any)._component : undefined;
        if (innerComponent && innerComponent.setFocusLimited) {
            innerComponent.setFocusLimited(limited);
        }
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

export function makeAnimated(nativeAnimatedClasses: AnimatedClasses, useFocusRestrictedView?: boolean): RX.Animated {
    if (nativeAnimatedClasses) {
        animatedClasses = nativeAnimatedClasses;
    }

    return {
        // platform specific animated components
        Image: AnimatedImage,
        Text: AnimatedText,
        TextInput: AnimatedTextInput,
        View: useFocusRestrictedView ? FocusRestrictedAnimatedView :  AnimatedView,
        // common stuff
        ...AnimatedCommon
    } as RX.Animated;
}

export let AnimatedCommon = {
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

export default AnimatedCommon;
