/**
 * Animated.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Implements animated components for web version of ReactXP.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as _ from './utils/lodashMini';
import * as RX from '../common/Interfaces';
import { executeTransition, TransitionSpec } from './animated/executeTransition';
import AppConfig from '../common/AppConfig';
import Easing from '../common/Easing';
import RXImage from './Image';
import RXView from './View';
import RXText from './Text';
import RXTextInput from './TextInput';
import Styles from './Styles';

// Animated Css Property Units - check /common/Types for the list of available
// css animated properties
const animatedPropUnits: { [key: string]: string } = {
    // AnimatedFlexboxStyleRules
    height: 'px',
    width: 'px',
    left: 'px',
    right: 'px',
    top: 'px',
    bottom: 'px',

    // AnimatedTransformStyleRules
    perspective: '',
    rotate: 'deg',
    rotateX: 'deg',
    rotateY: 'deg',
    scale: '',
    scaleX: '',
    scaleY: '',
    scaleZ: '',
    translateX: 'px',
    translateY: 'px',
    skewX: '',
    skewY: '',

    // AnimatedViewAndImageCommonStyleRules
    backgroundColor: '',
    opacity: '',
    borderRadius: 'px',

    // AnimatedTextStyleRules
    color: '',
    fontSize: 'px'
 };

// Every Animation subclass should extend this.
export abstract class Animation {
    _id: number|undefined;

    // Starts the animation
    abstract start(onEnd?: RX.Types.Animated.EndCallback): void;

    // Stops the animation
    abstract stop(): void;
}

// Interface for a component that wants to know when the value
// of an Animated.Value changes or is about to be animated.
interface ValueListener {
    setValue(valueObject: Value, newValue: number | string): void;
    startTransition(valueObject: Value, from: number|string, toValue: number|string, duration: number,
        easing: string, delay: number, onEnd: RX.Types.Animated.EndCallback): void;
    stopTransition(valueObject: Value): number|string|undefined;
}

// The animated value object
export class Value extends RX.Types.AnimatedValue {
    protected _value: number|string;
    private _listeners: ValueListener[];

    // Initializes the object with the defaults and assigns the id for the animated value.
    constructor(value: number) {
        super(value);
        this._value = value;
        this._listeners = [];
    }

    // Gets the current animated value (this gets updates after animation concludes)
    _getValue(): number | string {
        return this._value;
    }

    _isInterpolated(): boolean {
        return false;
    }

    interpolate(config: RX.Types.Animated.InterpolationConfigType) {
        return new InterpolatedValue(config, this);
    }

    // Updates a value in this animated reference.
    setValue(value: number | string): void {
        if (value === undefined) {
            throw 'An invalid value was passed into setvalue in the animated value api';
        }

        // If value the same, do nothing.
        if (value === this._value) {
            return;
        }
        this._value = value;

        // Notify subscribers about the new value.
        _.each(this._listeners, listener => listener.setValue(this, value));
    }

    // Add listener for when the value gets updated.
    _addListener(listenerToAdd: ValueListener): void {
        if (this._listeners.indexOf(listenerToAdd) < 0) {
            this._listeners.push(listenerToAdd);
        }
    }

    // Remove a specific listner.
    _removeListener(listenerToRemove: ValueListener): void {
        this._listeners = _.filter(this._listeners, listener => listener !== listenerToRemove);
    }

    // Remove all listeners.
    _removeAllListeners(): void {
        this._listeners = [];
    }

    // Start a specific animation.
    _startTransition(toValue: number|string, duration: number, easing: string, delay: number,
            onEnd: RX.Types.Animated.EndCallback): void {

        // If there are no listeners, the app probably has a bug where it's
        // starting an animation before the associated element is mounted.
        // Complete the animation immediately by updating to the end value
        // and caling the onEnd callback.
        if (this._listeners.length === 0) {
            this._updateFinalValue(toValue);
            if (onEnd) {
                onEnd({ finished: false });
            }

            return;
        }

        _.each(this._listeners, listener => {
            listener.startTransition(this, this._getValue(), toValue, duration, easing, delay, onEnd);
        });
    }

    // Stop animation.
    _stopTransition() {
        _.each(this._listeners, listener => {
            let updatedValue = listener.stopTransition(this);
            if (updatedValue !== undefined) {
                this._updateFinalValue(updatedValue);
            }
        });
    }

    // After an animation is stopped or completed, updates
    // the final value.
    _updateFinalValue(value: number|string) {
        this._value = value;
    }
}

export class InterpolatedValue extends Value {
    private _interpolationConfig: { [key: number]: string|number } | undefined;
    constructor(private _config: RX.Types.Animated.InterpolationConfigType, rootValue: Value) {
        super(rootValue._getValue() as number);

        if (!this._config || !this._config.inputRange || !this._config.outputRange ||
                this._config.inputRange.length < 2 || this._config.outputRange.length < 2 ||
                this._config.inputRange.length !== this._config.outputRange.length) {
            throw 'The interpolation config is invalid. Input and output arrays must be same length.';
        }

        // This API doesn't currently support more than two elements in the
        // interpolation array. Supporting this in the web would require the
        // use of JS-driven animations or keyframes, both of which are prohibitively
        // expensive from a performance and responsiveness perspective.
        if (this._config.inputRange.length !== 2) {
            if (AppConfig.isDevelopmentMode()) {
                console.log('Web implementation of interpolate API currently supports only two interpolation values.');
            }
        }

        const newInterpolationConfig: { [key: number]: string|number } = {};
        _.each(this._config.inputRange, (key, index) => {
            newInterpolationConfig[key] = this._config.outputRange[index];
        });
        this._interpolationConfig = newInterpolationConfig;

        let self = this;
        rootValue._addListener({
            setValue(valueObject: Value, newValue: number | string): void {
                self.setValue(newValue);
            },
            startTransition(valueObject: Value, from: number|string, toValue: number|string, duration: number,
                    easing: string, delay: number, onEnd: RX.Types.Animated.EndCallback): void {
                if (!_.isNumber(toValue)) {
                    throw 'Must use numbers as inputs to InterpolatedValues';
                }
                self._startTransition(toValue, duration, easing, delay, () => undefined);
            },
            stopTransition(valueObject: Value): number|string|undefined {
                self._stopTransition();
                return self._getValue();
            }
        });
    }

    _isInterpolated(): boolean {
        return true;
    }

    _getInterpolatedValue(inputVal: number): string|number {
        if (!this._interpolationConfig) {
            throw 'There is no interpolation config but one is required';
        }

        if (this._interpolationConfig[inputVal]) {
            return this._interpolationConfig[inputVal];
        }

        if (!_.isNumber(this._config.outputRange[0])) {
            throw 'Non-transitional interpolations on web only supported as numerics';
        }

        if (inputVal < this._config.inputRange[0]) {
            return this._config.outputRange[0];
        }
        for (let i = 1; i < this._config.inputRange.length - 1; i++) {
            if (inputVal < this._config.inputRange[i]) {
                const ratio = (inputVal - this._config.inputRange[i - 1]) /
                    (this._config.inputRange[i] - this._config.inputRange[i - 1]);
                return (this._config.outputRange as number[])[i] * ratio +
                    (this._config.outputRange as number[])[i - 1] * (1 - ratio);
            }
        }
        return this._config.outputRange[this._config.inputRange.length - 1];
    }
}

export let timing: RX.Types.Animated.TimingFunction = function(
    value: Value, config: RX.Types.Animated.TimingAnimationConfig): RX.Types.Animated.CompositeAnimation {

    if (!value  || !config) {
        throw 'Timing animation requires value and config';
    }

    let stopLooping = false;
    return {
        start: function(onEnd?: RX.Types.Animated.EndCallback): void {
            let animate = () => {
                if (config.loop) {
                    value.setValue(config.loop.restartFrom);
                }

                let easing: RX.Types.Animated.EasingFunction = config.easing || Easing.Default();
                let duration = config.duration !== undefined ? config.duration : 500;
                let delay = config.delay || 0;
                value._startTransition(config.toValue, duration, easing.cssName, delay, result => {
                    // Restart the loop?
                    if (config.loop && !stopLooping) {
                        animate();
                    } else {
                        value._updateFinalValue(config.toValue);
                    }

                    if (onEnd) {
                        onEnd(result);
                    }
                });
            };

            // Trigger animation loop
            animate();
        },

        stop: function(): void {
            stopLooping = true;
            value._stopTransition();
        }
    };
};

export let sequence: RX.Types.Animated.SequenceFunction = function (
    animations: Array<RX.Types.Animated.CompositeAnimation>): RX.Types.Animated.CompositeAnimation {

    if (!animations) {
        throw 'Sequence animation requires a list of animations';
    }

    let hasBeenStopped = false;
    let doneCount = 0;
    let result = {
        start: function (onEnd?: RX.Types.Animated.EndCallback) {
            if (!animations || animations.length === 0) {
                throw 'No animations were passed to the animated sequence API';
            }

            var executeNext = () => {
                doneCount++;

                let isFinished = doneCount === animations.length;
                if (hasBeenStopped || isFinished) {
                    doneCount = 0;
                    hasBeenStopped = false;
                    if (onEnd) {
                        onEnd({ finished: isFinished });
                    }

                    return;
                }

                animations[doneCount].start(executeNext);
            };

            animations[doneCount].start(executeNext);
        },

        stop: function () {
            if (doneCount < animations.length) {
                doneCount = 0;
                hasBeenStopped = true;
                animations[doneCount].stop();
            }
        }
    };

    return result;
};

export var parallel: RX.Types.Animated.ParallelFunction = function (
    animations: Array<RX.Types.Animated.CompositeAnimation>): RX.Types.Animated.CompositeAnimation {

    if (!animations) {
        throw 'Parallel animation requires a list of animations';
    }

    // Variable to make sure we only call stop() at most once
    let hasBeenStopped = false;
    let doneCount = 0;

    var result = {
        start: function (onEnd?: RX.Types.Animated.EndCallback) {
            if (!animations || animations.length === 0) {
                throw 'No animations were passed to the animated parallel API';
            }

            // Walk through animations and start all as soon as possible.
            animations.forEach((animation, id) => {
                animation.start(animationResult => {
                    doneCount++;
                    let isFinished = doneCount === animations.length;
                    if (hasBeenStopped || isFinished) {
                        doneCount = 0;
                        hasBeenStopped = false;
                        if (onEnd) {
                            onEnd({ finished: isFinished });
                        }

                        return;
                    }
                });
            });
        },

        stop: function (): void {
            doneCount = 0;
            hasBeenStopped = true;
            animations.forEach(animation => {
                animation.stop();
            });
        }
    };

    return result;
};

interface ExtendedTransition extends TransitionSpec {
    onEnd?: RX.Types.Animated.EndCallback;
    toValue?: number|string;
}

interface AnimatedAttribute {
    valueObject: Value;
    activeTransition?: ExtendedTransition;
}

type AnimatedValueMap = { [transform: string]: AnimatedAttribute };

// Function for creating wrapper AnimatedComponent around passed in component
function createAnimatedComponent<PropsType extends RX.Types.CommonProps>(Component: any): any {
    class AnimatedComponentGenerated extends React.Component<PropsType, void>
            implements RX.AnimatedComponent<PropsType, void>, ValueListener {

        private _mountedComponent: any = null;
        private _propsWithoutStyle: any;
        // Gets initialized via _updateStypes
        private _processedStyle!: { [attribute: string]: string};

        private _animatedAttributes: AnimatedValueMap;
        // Gets initialized via _updateStypes
        private _staticTransforms!: { [transform: string]: string };
        private _animatedTransforms: AnimatedValueMap;

        constructor(props: PropsType) {
            super(props);

            this._animatedAttributes = {};
            this._animatedTransforms = {};
            this._updateStyles(props);
        }

        setNativeProps(props: PropsType) {
            if (AppConfig.isDevelopmentMode()) {
                console.error('setNativeProps not supported on web');
            }
        }

        componentWillReceiveProps(props: RX.Types.CommonStyledProps<RX.Types.StyleRuleSet<Object>>) {
            this._updateStyles(props);
        }

        setValue(valueObject: Value, newValue: number | string): void {
            // We should never get here if the component isn't mounted,
            // but we'll add this additional protection.
            if (!this._mountedComponent) {
                return;
            }

            let attrib = this._findAnimatedAttributeByValue(this._animatedAttributes, valueObject);
            if (attrib) {
                const domNode = this._getDomNode();
                if (domNode) {
                    const cssValue = this._generateCssAttributeValue(attrib, valueObject, valueObject._getValue());
                    (domNode.style as any)[attrib] = cssValue;
                }
                return;
            }

            let transform = this._findAnimatedAttributeByValue(this._animatedTransforms, valueObject);
            if (transform) {
                const domNode = this._getDomNode();
                if (domNode) {
                    domNode.style.transform = this._generateCssTransformList(true);
                }
            }
        }

        startTransition(valueObject: Value, fromValue: number|string, toValue: number|string, duration: number,
                easing: string, delay: number, onEnd: RX.Types.Animated.EndCallback): void {

            // We should never get here if the component isn't mounted,
            // but we'll add this additional protection.
            if (!this._mountedComponent) {
                return;
            }

            let updateTransition = false;

            let attrib = this._findAnimatedAttributeByValue(this._animatedAttributes, valueObject);
            if (attrib) {
                if (this._animatedAttributes[attrib].activeTransition) {
                    if (AppConfig.isDevelopmentMode()) {
                        console.error('Animation started while animation was already pending');
                    }
                }
                this._animatedAttributes[attrib].activeTransition = {
                    property: Styles.convertJsToCssStyle(attrib),
                    from: this._generateCssAttributeValue(attrib, this._animatedAttributes[attrib].valueObject, fromValue),
                    to: this._generateCssAttributeValue(attrib, this._animatedAttributes[attrib].valueObject, toValue),
                    duration,
                    timing: easing,
                    delay,
                    toValue,
                    onEnd
                };
                updateTransition = true;
            }

            let transform = this._findAnimatedAttributeByValue(this._animatedTransforms, valueObject);
            if (transform) {
                if (this._animatedTransforms[transform].activeTransition) {
                    if (AppConfig.isDevelopmentMode()) {
                        console.error('Animation started while animation was already pending');
                    }
                }
                this._animatedTransforms[transform].activeTransition = {
                    property: transform,
                    from: fromValue,
                    to: toValue,
                    duration,
                    timing: easing,
                    delay,
                    toValue,
                    onEnd
                };
                updateTransition = true;
            }

            if (updateTransition) {
                this._updateTransition();
            }
        }

        // Stops a pending transition, returning the value at the current time.
        stopTransition(valueObject: Value): number|string|undefined {
            // We should never get here if the component isn't mounted,
            // but we'll add this additional protection.
            if (!this._mountedComponent) {
                return;
            }

            let partialValue: number|string|undefined;
            let stoppedTransition: ExtendedTransition|undefined;
            let updateTransition = false;

            let attrib = this._findAnimatedAttributeByValue(this._animatedAttributes, valueObject);
            if (attrib) {
                let activeTransition = this._animatedAttributes[attrib].activeTransition;
                if (activeTransition) {
                    partialValue = activeTransition.toValue;

                    // We don't currently support updating to an intermediate
                    // value for interpolated values because this would involve
                    // mapping the interpolated value in reverse. Instead, we'll
                    // simply update it to the "toValue".
                    if (!valueObject._isInterpolated()) {
                        const domNode = this._getDomNode();
                        if (domNode) {
                            let computedStyle = window.getComputedStyle(domNode, undefined);
                            if (computedStyle && (computedStyle as any)[attrib]) {
                                partialValue = (computedStyle as any)[attrib];
                            }
                        }
                    }

                    stoppedTransition = this._animatedAttributes[attrib].activeTransition;
                    delete this._animatedAttributes[attrib].activeTransition;
                    updateTransition = true;
                }
            } else {
                let transform = this._findAnimatedAttributeByValue(this._animatedTransforms, valueObject);
                if (transform) {
                    let activeTransition = this._animatedTransforms[transform].activeTransition;
                    if (activeTransition) {
                        // We don't currently support updating to an intermediate value
                        // for transform values. This is because getComputedStyle
                        // returns a transform matrix for 'transform'. To implement this, we'd
                        // need to convert the matrix back to a rotation, scale, etc.
                        partialValue = activeTransition.toValue;

                        stoppedTransition = this._animatedTransforms[transform].activeTransition;
                        delete this._animatedTransforms[transform].activeTransition;
                        updateTransition = true;
                    }
                }
            }

            if (stoppedTransition && stoppedTransition.onEnd) {
                stoppedTransition.onEnd({ finished: false });
            }

            if (updateTransition) {
                this._updateTransition();
            }

            return partialValue;
        }

        private _getDomNode(): HTMLElement|null {
            return ReactDOM.findDOMNode(this._mountedComponent) as HTMLElement|null;
        }

        // Looks for the specified value object in the specified map. Returns
        // the key for the map (i.e. the attribute name) if found.
        private _findAnimatedAttributeByValue(map: AnimatedValueMap, valueObj: Value): string|undefined {
            let keys = _.keys(map);
            let index = _.findIndex(keys, key => map[key].valueObject === valueObj);
            return index >= 0 ? keys[index] : undefined;
        }

        // Updates the "transform" CSS attribute for the element to reflect all
        // active transitions.
        private _updateTransition() {
            // We should never get here if the component isn't mounted,
            // but we'll add this additional protection.
            if (!this._mountedComponent) {
                return;
            }

            let activeTransitions: TransitionSpec[] = [];
            _.each(this._animatedAttributes, attrib => {
                if (attrib.activeTransition) {
                    activeTransitions.push(attrib.activeTransition);
                }
            });

            // If there are any transform transitions, we need to combine
            // these into a single transition. That means we can't specify
            // different durations, delays or easing functions for each. That's
            // an unfortunate limitation of CSS.
            let keys = _.keys(this._animatedTransforms);
            let index = _.findIndex(keys, key => !!this._animatedTransforms[key].activeTransition);
            if (index >= 0) {
                let transformTransition = this._animatedTransforms[keys[index]].activeTransition!;
                activeTransitions.push({
                    property: 'transform',
                    from: this._generateCssTransformList(false),
                    to: this._generateCssTransformList(true),
                    duration: transformTransition.duration,
                    timing: transformTransition.timing,
                    delay: transformTransition.delay
                });
            }

            if (activeTransitions.length > 0) {
                const domNode = this._getDomNode();
                if (domNode) {
                    executeTransition(domNode, activeTransitions, () => {
                        // Clear all of the active transitions and invoke the onEnd callbacks.
                        let completeTransitions: ExtendedTransition[] = [];

                        _.each(this._animatedAttributes, attrib => {
                            if (attrib.activeTransition) {
                                completeTransitions.push(attrib.activeTransition);
                                delete attrib.activeTransition;
                            }
                        });

                        _.each(this._animatedTransforms, transform => {
                            if (transform.activeTransition) {
                                completeTransitions.push(transform.activeTransition);
                                delete transform.activeTransition;
                            }
                        });

                        _.each(completeTransitions, transition => {
                            if (transition.onEnd) {
                                transition.onEnd({ finished: true });
                            }
                        });
                    });
                }
            }
        }

        // Generates the CSS value for the specified attribute given
        // an animated value object.
        private _generateCssAttributeValue(attrib: string, valueObj: Value, newValue: number|string): string {
            if (valueObj._isInterpolated()) {
                newValue = (valueObj as InterpolatedValue)._getInterpolatedValue(newValue as number);
            }

            // If the value is a raw number, append the default units.
            // If it's a string, we assume the caller has specified the units.
            if (typeof newValue === 'number') {
                newValue = newValue + animatedPropUnits[attrib];
            }
            return newValue;
        }

        private _generateCssTransformValue(transform: string, valueObj: Value, newValue: number|string): string {
            if (valueObj._isInterpolated()) {
                newValue = (valueObj as InterpolatedValue)._getInterpolatedValue(newValue as number);
            }

            // If the value is a raw number, append the default units.
            // If it's a string, we assume the caller has specified the units.
            if (typeof newValue === 'number') {
                newValue = newValue + animatedPropUnits[transform];
            }
            return newValue;
        }

        // Regenerates the list of transforms, combining all static and animated transforms.
        private _generateCssTransformList(useActiveValues: boolean): string {
            let transformList: string[] = [];
            _.each(this._staticTransforms, (value, transform) => {
                transformList.push(transform + '(' + value + ')');
            });
            _.each(this._animatedTransforms, (value, transform) => {
                let newValue = useActiveValues && value.activeTransition ? value.activeTransition.to : value.valueObject._getValue();
                transformList.push(transform + '(' + this._generateCssTransformValue(transform, value.valueObject, newValue) + ')');
            });
            return transformList.join(' ');
        }

        private _updateStyles(props: RX.Types.CommonStyledProps<RX.Types.StyleRuleSet<Object>>) {
            this._propsWithoutStyle = _.omit(props, 'style');

            let rawStyles = Styles.combine(props.style || {}) as any;
            this._processedStyle = {};

            let newAnimatedAttributes: { [transform: string]: Value } = {};

            for (let attrib in rawStyles) {
                // Handle transforms separately.
                if (attrib === 'staticTransforms' || attrib === 'animatedTransforms') {
                    continue;
                }

                // Is this a dynamic (animated) value?
                if (rawStyles[attrib] instanceof Value) {
                    let valueObj = rawStyles[attrib];
                    this._processedStyle[attrib] = this._generateCssAttributeValue(attrib, valueObj, valueObj._getValue());
                    newAnimatedAttributes[attrib] = valueObj;
                } else {
                    // Copy the static style value.
                    this._processedStyle[attrib] = rawStyles[attrib];
                }
            }

            // Handle transforms, which require special processing because they need to
            // be combined into a single 'transform' CSS attribute.
            this._staticTransforms = rawStyles['staticTransforms'] || {};
            let newAnimatedTransforms: { [transform: string]: Value } = rawStyles['animatedTransforms'] || {};

            // Update this._animatedAttributes and this._animatedTransforms so they match
            // the updated style.

            // Remove any previous animated attributes that are no longer present
            // or associated with different value objects.
            _.each(this._animatedAttributes, (value, attrib) => {
                if (!newAnimatedAttributes[attrib] || newAnimatedAttributes[attrib] !== value.valueObject) {
                    if (value.activeTransition) {
                        if (AppConfig.isDevelopmentMode()) {
                            console.error('Animated style attribute removed while the animation was active');
                        }
                    }
                    value.valueObject._removeListener(this);
                    delete this._animatedAttributes[attrib];
                }
            });

            // Add new animated attributes.
            _.each(newAnimatedAttributes, (value, attrib) => {
                if (!this._animatedAttributes[attrib]) {
                    this._animatedAttributes[attrib] = { valueObject: value };
                    if (this._mountedComponent) {
                        value._addListener(this);
                    }
                }
            });

            // Remove any previous animated transforms that are no longer present
            // or associated with different value objects.
            _.each(this._animatedTransforms, (value, transform) => {
                if (!newAnimatedTransforms[transform] || newAnimatedTransforms[transform] !== value.valueObject) {
                    if (value.activeTransition) {
                        if (AppConfig.isDevelopmentMode()) {
                            console.warn('Should not remove an animated transform attribute while the animation is active');
                        }
                    }
                    value.valueObject._removeListener(this);
                    delete this._animatedTransforms[transform];
                }
            });

            // Add new animated transforms.
            _.each(newAnimatedTransforms, (value, transform) => {
                if (!this._animatedTransforms[transform]) {
                    this._animatedTransforms[transform] = { valueObject: value };
                    if (this._mountedComponent) {
                        value._addListener(this);
                    }
                }
            });

            // Update the transform attribute in this._processedStyle.
            let transformList = this._generateCssTransformList(true);
            if (transformList) {
                this._processedStyle['transform'] = transformList;
            }
        }

        componentDidMount() {
            _.each(this._animatedAttributes, value => {
                value.valueObject._addListener(this);
            });

            _.each(this._animatedTransforms, value => {
                value.valueObject._addListener(this);
            });
        }

        componentWillUnmount() {
            _.each(this._animatedAttributes, value => {
                value.valueObject._removeListener(this);
            });
            this._animatedAttributes = {};

            _.each(this._animatedTransforms, value => {
                value.valueObject._removeListener(this);
            });
            this._animatedTransforms = {};
        }

        focus() {
            if (this._mountedComponent && this._mountedComponent.focus) {
                this._mountedComponent.focus();
            }
        }

        requestFocus() {
            if (this._mountedComponent && this._mountedComponent.requestFocus) {
                this._mountedComponent.requestFocus();
            }
        }

        blur() {
            if (this._mountedComponent && this._mountedComponent.blur) {
                this._mountedComponent.blur();
            }
        }

        setFocusRestricted(restricted: boolean) {
            if (this._mountedComponent && this._mountedComponent.setFocusRestricted) {
                this._mountedComponent.setFocusRestricted(restricted);
            }
        }

        setFocusLimited(limited: boolean) {
            if (this._mountedComponent && this._mountedComponent.setFocusLimited) {
                this._mountedComponent.setFocusLimited(limited);
            }
        }

        render() {
            return (
                <Component
                    style={ this._processedStyle }
                    { ...this._propsWithoutStyle }
                    ref={ this._onMount }
                >
                    { this.props.children }
                </Component>
            );
        }

        protected _onMount = (component: any) => {
            this._mountedComponent = component;
        }

        // Update the component's display name for easy debugging in react devtools extension
        static displayName = `Animated.${Component.displayName || Component.name || 'Component'}`;
    }

    return AnimatedComponentGenerated;
}

export var Image = createAnimatedComponent<RX.Types.ImageProps>(RXImage) as typeof RX.AnimatedImage;
export var Text = createAnimatedComponent(RXText) as typeof RX.AnimatedText;
export var TextInput = createAnimatedComponent(RXTextInput) as typeof RX.AnimatedTextInput;
export var View = createAnimatedComponent(RXView) as typeof RX.AnimatedView;

export type Image = RX.AnimatedImage;
export type Text = RX.AnimatedText;
export type TextInput = RX.AnimatedTextInput;
export type View = RX.AnimatedView;

export var createValue: (initialValue: number) => Value = function(initialValue: number) {
    return new Value(initialValue);
};

export var interpolate: (value: Value, inputRange: number[], outputRange: string[]) =>
        Value = function(value: Value, inputRange: number[], outputRange: string[]) {
    return value.interpolate({ inputRange: inputRange, outputRange: outputRange });
};

export { Easing };
