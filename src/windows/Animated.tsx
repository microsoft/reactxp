/**
* Animated.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN Windows-specific implementation of Animated wrapper.
*/

import React = require('react');
import RN = require('react-native');
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
import { Animated as AnimatedBase } from '../native-common/Animated';

import RXView from './View';

var ReactAnimatedView = RN.Animated.createAnimatedComponent(RXView, true);

export class AnimatedView extends RX.AnimatedView {

    private _animatedComponent: typeof ReactAnimatedView;

    constructor(props: Types.AnimatedViewProps) {
        super(props);
    }

    setNativeProps(props: Types.AnimatedViewProps) {
        if (this._animatedComponent) {
            if (!this._animatedComponent.setNativeProps) {
                throw 'Component does not implement setNativeProps';
            }
            this._animatedComponent.setNativeProps(props);
        }
    }

    render() {
        return (
            <ReactAnimatedView
                ref={ this._onAnimatedComponentRef }
                { ...this.props }
            >
                { this.props.children }
            </ReactAnimatedView>
        );
    }

    focus() {
        if (this._animatedComponent && this._animatedComponent._component) {
            this._animatedComponent._component.focus();
        }
    }

    blur() {
        if (this._animatedComponent && this._animatedComponent._component) {
            this._animatedComponent._component.blur();
        }
    }

    setFocusRestricted(restricted: boolean) {
        if (this._animatedComponent && this._animatedComponent._component) {
            this._animatedComponent._component.setFocusRestricted(restricted);
        }
    }

    setFocusLimited(limited: boolean) {
        if (this._animatedComponent && this._animatedComponent._component) {
            this._animatedComponent._component.setFocusLimited(limited);
        }
    }

    private _onAnimatedComponentRef = (ref: typeof ReactAnimatedView) => {
        this._animatedComponent = ref;
    }
}

export type AnimatedValue = typeof AnimatedBase.Value;

export var Animated = {
    Image: AnimatedBase.Image as typeof RX.AnimatedImage,
    Text: AnimatedBase.Text as typeof RX.AnimatedText,
    TextInput: AnimatedBase.TextInput as typeof RX.AnimatedTextInput,
    View: AnimatedView as typeof RX.AnimatedView,
    Easing: AnimatedBase.Easing as Types.Animated.Easing,
    timing: AnimatedBase.timing as Types.Animated.TimingFunction,
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
