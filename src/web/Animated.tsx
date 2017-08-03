/**
* Animated.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Implements animated components for web version of ReactXP.
*/

import _ = require('./utils/lodashMini');
import React = require('react');
import ReactDOM = require('react-dom');

import Easing from '../common/Easing';
import { executeTransition, ITransitionSpec } from './animated/executeTransition';
import RXImage from './Image';
import RXView from './View';
import RXText from './Text';
import RXTextInput from './TextInput';
import RX = require('../common/Interfaces');
import Styles from './Styles';
import Types = require('../common/Types');

// Animated Css Property Units - check /common/Types for the list of available
// css animated properties
var animatedPropUnits: { [key: string]: string } = {
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
    _id: number;
    _triggerAnimation: boolean = false; // Flag that sets animation to start.
    _toValue: number | string;

    // Starts the animation
    abstract start(onEnd?: Types.Animated.EndCallback): void;
    // Stops the animation
    abstract stop(): void;
    // Animate method that kicks the animation
    abstract forceAnimate(): void;
}

// Incrementor for the animated value
// this incrementor is necessary for all the initialization
var animatedValueUniqueId = 0;

// The animated value object
export class Value extends Types.AnimatedValue {
    _value: number | string;
    _listenerId: number;
    _animationId: number;
    _animations: { [key: number]: Animation };
    _listeners: { [key: string]: Types.Animated.ValueListenerCallback };
    _animatedValueUniqueId: number;
    _cssProperties: { [key: string]: string } = {};
    _element: HTMLElement;
    _isInitialized: boolean = false;
    _interpolationConfig: { [key: number]: (number | string) };

    // Initializes the object with the defaults and assigns the id for the animated value.
    constructor(value: number) {
        super(value);
        this._value = value;
        this._animations = {};
        this._listeners = {};
        this._animationId = 0;
        this._listenerId = 0;
        this._animatedValueUniqueId = ++animatedValueUniqueId;
    }

    // Gets the unique id for this animated value
    getId() {
        return this._animatedValueUniqueId;
    }

    // Gets the current animated value (this gets updates after animation concludes)
    getValue(): number | string {
        return this._value;
    }

    interpolate(config: Types.Animated.InterpolationConfigType) {
        // TODO: This is a temporary implementation in order to keep parity with RN's API.
        // In reallity we should support string values as well string tovalues in the animations.
        // We need to work with the RN folks in order to understand what was the motivation for them
        // To not go with that approach instead.
        if (!config || !config.inputRange || !config.outputRange) {
            throw 'The interpolation config is invalid. Make sure you set input and output ranges with the same indexes';
        }

        // TODO: VSO #773423: Support >2 input/output values.
        if (config.inputRange.length !== 2 && config.outputRange.length !== 2) {
            throw 'The interpolation input/output ranges need to be length 2 and map from (input(0) -> output(0))' +
            'and to (input(1) -> input(1))';
        }

        var input0 = config.inputRange[0];
        var input1 = config.inputRange[1];
        if (input0 > input1) {
            throw 'The interpolation input values should be in ascending order.';
        }

        this._interpolationConfig = {};
        _.each(config.inputRange, (value, index) => {
            this._interpolationConfig[value] = config.outputRange[index];
        });

        return this;
    }

    // Gets animation reference by id. An animated value may be referenced in multiple animations.
    getAnimation(id: number): Animation {
        // Return CSS key (transition/animation) string from animation object if available.
        if (this._animations) {
            return this._animations[id];
        }

        return null;
    }

    // Adds a new associated css property to this animated value.
    addCssProperty(key: string, value: string): void {
        if (key && value) {
            this._cssProperties[key] = value;
        } else {
            throw 'Trying to add a css property which has invalid key/value. Key:' + key;
        }
    }

    // Updates a value in this animated reference.
    setValue(value: number | string): void {
        if (value === undefined) {
            throw 'An invalid value was passed into setvalue in the animated value api';
        }

        this._updateValue(value);
        this._updateElementStyles();
    }

    // True if the animated value was correctly initialized; false otherwise.
    isInitialized(): boolean {
        return this._isInitialized;
    }

    // Sets an HTML element for the animated value
    setAsInitialized(element: HTMLElement): void {
        if (!element) {
            throw 'The element being set in the animated value is not valid.';
        }

        if (this._element === element) {
            return;
        }

        // TODO: Support multiple elements in the future.
        this._element = element;
        this._isInitialized = true;
        this._startPendingAnimations();
    }

    // Clears the HTML element reference and marks the value as uninitialized
    destroy(): void {
        this._isInitialized = false;
        this._element = null;
    }

    // Add listener for when the value gets updated.
    addListener(callback: Types.Animated.ValueListenerCallback): string {
        if (callback) {
            this._listenerId++;
            this._listeners[String(this._listenerId)] = callback;
        }

        return String(this._listenerId);
    }

    // Remove a specific listner.
    removeListener(id: string): void {
        delete this._listeners[id];
    }

    // Remove all listeners.
    removeAllListeners(): void {
        this._listeners = {};
    }

    // Add an associated animation into this animated value.
    addAnimation(animation: Animation): number {
        if (!animation) {
            throw 'It\'s not ok to add a null animation into animated value bah';
        }

        this._animationId++;
        animation._id = this._animationId;
        this._animations[this._animationId] = animation;
        return this._animationId;
    }

    // Start a specific animation.
    startAnimation(id: number, onEnd?: Types.Animated.EndCallback): void {
        if (!id) {
            throw 'An id is needed in order to start an animation in the animated value';
        }

        let animation = this._animations[id];
        if (!animation) {
            throw 'Animation not found so not possible to start it.';
        }

        animation.start(onEnd);
    }

    // Stop animation.
    stopAnimation(id: number) {
        if (!id) {
            throw 'An id is needed in order to stop an animation in the animated value';
        }

        let animation = this._animations[id];
        if (!animation) {
            throw 'Animation not found so not possible to stop it.';
        }

        animation.stop();

        // Make sure the reference for this animation is destroyed.
        // This will avoid problems where timing animations are shared across multiple states.
        this._animations[id] = null;
    }

     private _startPendingAnimations() {
        // Start animations if they were waiting for the animated value to be initialized.
        // This is accomplished via the animate flag within the animation (isReadyToAnimate).
        _.each(this._animations, (animation: Animation) => {
            if (animation && animation._triggerAnimation) {
                animation.forceAnimate();
            }
        });
     }

     private _updateElementStyles(): void {
       // Update the style of the element.
       if (this._isInitialized) {
           this.updateElementStylesOnto(this._element.style);
        }
    }

    updateElementStylesOnto(styles: Object) {
        // Just update the style and make sure it renders the frame 1.
        _.each(this._cssProperties, (value: string, key: string) => {
            (styles as any)[key] = value.replace(new RegExp('##', 'g'), this.getCssValueString());
        });
    }

    getCssValueString(): string {
        if (this._interpolationConfig) {
            const fromValue = this._interpolationConfig[this.getValue() as any];

            if (fromValue === undefined) {
                throw 'The interpolation config does not match the animated value or to value specified';
            }

            return fromValue.toString();
        }

        return this.getValue().toString();
    }

    // Update the value and kicks the callbacks.
    private _updateValue(value: number | string): void {
        // If value the same, do nothing.
        if (value === this._value) {
            return;
        }
        this._value = value;

        // Notify subscribers about the new value.
        for (var key in this._listeners) {
            if (typeof this._listeners[key] === 'function') {
                this._listeners[key](this.getValue());
            }
        }
    }
}

// Parser for the transform css. Transform needs a special way to parse animated values.
class AnimatedTransform {
   static initialize(style: any): Value[] {
       // Temporary cache for the animated values parsed so far.
       let animatedValues: Value[] = [];

       if (style['animatedTransform']) {
            _.each(style['animatedTransform'], (transform: { type: string, value: Value }) => {
                animatedValues.push(transform.value);

                // We currently support only one animated transform type per style.
                // The last one will "win".
                transform.value.addCssProperty('transform', transform.type + '(##' + animatedPropUnits[transform.type] + ') ');
            });
       }

       return animatedValues;
    }
}

// Animating functions
class TimingAnimation extends Animation {
    _duration: number;
    _delay: number;
    _easing: Types.Animated.EasingFunction;
    _onEnd: Types.Animated.EndCallback;
    _timeout: any;
    _animatedValue: Value;
    _loop: boolean;
    _initialized: boolean;

    constructor(value: Value, config: Types.Animated.TimingAnimationConfig) {
        super();

        this._animatedValue = value;
        this._toValue = config.toValue;
        this._easing = config.easing || Easing.Default();
        this._duration = config.duration !== undefined ? config.duration : 500;
        this._delay = config.delay || 0;
        this._loop = config.loop !== undefined;
        this._initialized = false;
    }

    private _stripUnits(value: string): string {
        // We need to strip off 'deg' or 'px' units from the end
        // of the interpolated values for compatibility with React Native.
        let trimmedValue = value.trim();
        const unitsToStrip = ['deg', 'px'];
        _.each(unitsToStrip, units => {
            if (_.endsWith(trimmedValue, units)) {
                value = trimmedValue.substr(0, trimmedValue.length - units.length);
                return false;
            }
        });

        return value;
    }

    // Animate the animated value
    forceAnimate(): void {
        if (this._animatedValue.isInitialized()) {
            let properties: ITransitionSpec[] = [];
            let fromValue: string;
            let toValue: string;

            // TODO: Support animating multiple properties in the same animated value at the same time.
            _.each(this._animatedValue._cssProperties, (value: string, property: string) => {
                if (this._animatedValue._interpolationConfig) {
                    fromValue = this._animatedValue._interpolationConfig[this._animatedValue.getValue() as any].toString();
                    toValue = this._animatedValue._interpolationConfig[this._toValue.toString() as any].toString();

                    if (!fromValue || !toValue) {
                        throw 'The interpolation config does not match the animated value or to value specified';
                    }

                    fromValue = this._stripUnits(fromValue);
                    toValue = this._stripUnits(toValue);
                } else {
                    fromValue = this._animatedValue.getValue().toString();
                    toValue = this._toValue.toString();
                }

                let from = value.replace(new RegExp('##', 'g'), fromValue);
                let to = value.replace(new RegExp('##', 'g'), toValue);

                properties.push({
                    property: _.kebabCase(property),
                    duration: this._duration,
                    timing: this._easing.cssName,
                    delay: this._delay,
                    from: from,
                    to: to
                });
            });

            this.resetAnimation();

            executeTransition(this._animatedValue._element, properties, () => {
                if (this._triggerAnimation) {
                    if (!this._loop) {
                        this._animatedValue.setValue(this._toValue);
                    }
                    this._triggerAnimation = false;
                    if (this._onEnd) {
                        this._onEnd({ finished: !this._loop });
                    }
                }
            });
        }
    }

    resetAnimation() {
        if (this._animatedValue.isInitialized()) {
            this._animatedValue._element.style.transition = 'none';
        }
    }

    // Flag the animation to start.
    start(onEnd?: Types.Animated.EndCallback): void {
        this._onEnd = onEnd;
        this._triggerAnimation = true;
        this.forceAnimate();
    }

    // Flag the animation to stop.
    stop(): void {
        this._triggerAnimation = false;
        this._animatedValue.setValue(this._toValue);

        this.resetAnimation();

        if (this._onEnd) {
            this._onEnd({ finished: false });
        }
    }
}

export var timing: Types.Animated.TimingFunction = function(
    value: Value,
    config: Types.Animated.TimingAnimationConfig)
    : Types.Animated.CompositeAnimation {

    if (!value  || !config) {
        throw 'Timing animation requires value and config';
    }

    // Set the animation on the value as soon as the timing animation is created
    // And trigger start and stop through animations
    let id = (value as Value).addAnimation(new TimingAnimation(value as Value, config));
    let isLooping = config.loop !== undefined && config.loop != null;

    return {
        start: function(callback?: Types.Animated.EndCallback): void {
            function animate() : void {
                if (isLooping) {
                    (value as Value).setValue(config.loop.restartFrom);
                }

                (value as Value).startAnimation(id, (r) => {
                    if (callback) {
                        callback(r);
                    }

                    if (!isLooping) {
                        return;
                    }

                    // Hack to get into the loop
                    animate();
                });
            }

            // Trigger animation loop (hack for now)
            animate();
        },

        stop: function(): void {
            isLooping = false;
            (value as Value).stopAnimation(id);
        },
    };
};

export var sequence: Types.Animated.SequenceFunction = function (
    animations: Array<Types.Animated.CompositeAnimation>
): Types.Animated.CompositeAnimation {

    if (!animations) {
        throw 'Sequence animation requires a list of animations';
    }

    let hasBeenStopped = false;
    let doneCount = 0;
    let result = {
        start: function (callback?: Types.Animated.EndCallback) {
            if (!animations || animations.length === 0) {
                throw 'No animations were passed to the animated sequence api';
            }

            var executeNext = () => {
                doneCount++;

                let isFinished = doneCount === animations.length;
                if (hasBeenStopped || isFinished) {
                    doneCount = 0;
                    hasBeenStopped = false;
                    if (callback) {
                        callback({ finished: isFinished });
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

export var parallel: Types.Animated.ParallelFunction = function (
    animations: Array<Types.Animated.CompositeAnimation>
): Types.Animated.CompositeAnimation {

    if (!animations) {
        throw 'Parallel animation requires a list of animations';
    }

    // Variable to make sure we only call stop() at most once
    let hasBeenStopped = false;
    let doneCount = 0;

    var result = {
        start: function (callback?: Types.Animated.EndCallback) {
            if (!animations || animations.length === 0) {
                throw 'No animations were passed to the animated parallel api';
            }

            // Walk through animations and start all as soon as possible.
            animations.forEach((animation, id) => {
                animation.start(animationResult => {
                    doneCount++;
                    let isFinished = doneCount === animations.length;
                    if (hasBeenStopped || isFinished) {
                        doneCount = 0;
                        hasBeenStopped = false;
                        if (callback) {
                            callback({ finished: isFinished });
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

// Function for creating wrapper AnimatedComponent around passed in component
function createAnimatedComponent<PropsType extends Types.CommonProps>(Component: any): any {
    var refName = 'animatedNode';

    class AnimatedComponentGenerated extends React.Component<PropsType, void> implements RX.AnimatedComponent<PropsType, void> {
        private _initialStyle: Object;
        private _propsWithoutStyle: Object;
        private _animatedValues: Value[];

        constructor(props: PropsType) {
            super(props);

            this._updateStyles(props);
        }

        setNativeProps(props: PropsType) {
            throw 'Called setNativeProps on web AnimatedComponent';
        }

        componentWillReceiveProps(props: Types.CommonStyledProps<Types.StyleRuleSet<Object>>) {
            this._updateStyles(props);
        }

        private _updateStyles(props: Types.CommonStyledProps<Types.StyleRuleSet<Object>>) {
            this._propsWithoutStyle = _.omit(props, 'style');

            if (!props.style) {
                this._initialStyle = undefined;
                this._animatedValues = [];
                return;
            }

            // If a style is present, make sure we initialize all animations associated with
            // animated values on it.
            // The way this works is:
            // - Animated value can be associated with multiple animated styles.
            // - When the component is being created we will walk through all the styles
            //   and initialize all the animations within the animated value (the animation
            //   gets registered when the animation function (e.g. timing) gets called, where the
            //   the reference to the animation is kept within the animated value.
            // - We will initialize the animated value with the list of css properties and html element
            //   where the style transition/animation. Should be applied and the css properties
            //   associated with it: key and from/to values.
            // - Then we will kick off the animation as soon as it's initialized or flag it to
            //   start anytime later.

            // Attempt to get static initial styles for the first build.  After the build,
            // initializeComponent will take over and apply styles dynamically.
            let styles = Styles.combine(props.style) as any;

            // Initialize the tricky properties here (e.g. transform).
            this._animatedValues = AnimatedTransform.initialize(styles);

            // Initialize the simple ones here (e.g. opacity);
            for (var key in styles) {
                if (styles[key] instanceof Value) {
                    styles[key].addCssProperty(key, '##' + animatedPropUnits[key]);
                    this._animatedValues.push(styles[key]);
                }
            }

            this._initialStyle = {};

            // Build the simple static styles
            for (var styleKey in styles) {
                if (_.isObject(styles[styleKey])) {
                    continue;
                } else if (styles.hasOwnProperty(styleKey)) {
                    (this._initialStyle as any)[styleKey] = styles[styleKey];
                }
            }

            // Add the complicated styles
            _.each(this._animatedValues, value => {
                value.updateElementStylesOnto(this._initialStyle);
            });
        }

        initializeComponent(props: Types.CommonProps) {
            // Conclude the initialization setting the element.
            const element = ReactDOM.findDOMNode<HTMLElement>(this.refs[refName]);
            if (element) {
                this._animatedValues.forEach(Value => {
                    Value.setAsInitialized(element);
                });
            }
        }

        componentDidMount() {
            this.initializeComponent(this.props);
        }

        componentDidUpdate() {
            this.initializeComponent(this.props);
        }

        componentWillUnmount() {
            _.each(this._animatedValues, value => {
                value.destroy();
            });
            this._animatedValues = [];
        }

        focus() {
            const component = this.refs[refName] as RXView;
            if (component.focus) {
                component.focus();
            }
        }

        blur() {
            const component = this.refs[refName] as RXView;
            if (component.blur) {
                component.blur();
            }
        }

        setFocusRestricted(restricted: boolean) {
            const component = this.refs[refName] as RXView;
            if (component.setFocusRestricted) {
                component.setFocusRestricted(restricted);
            }
        }

        setFocusLimited(limited: boolean) {
            const component = this.refs[refName] as RXView;
            if (component.setFocusLimited) {
                component.setFocusLimited(limited);
            }
        }

        render() {
            return (
                <Component
                    style={ this._initialStyle }
                    { ...this._propsWithoutStyle }
                    ref={ refName }
                >
                    { this.props.children }
                </Component>
            );
        }

        // Update the component's display name for easy debugging in react devtools extension
        static displayName = `Animated.${Component.displayName || Component.name || 'Component'}`;
    }

    return AnimatedComponentGenerated;
}

export var Image = createAnimatedComponent<Types.ImageProps>(RXImage) as typeof RX.AnimatedImage;
export var Text = createAnimatedComponent(RXText) as typeof RX.AnimatedText;
export var TextInput = createAnimatedComponent(RXTextInput) as typeof RX.AnimatedTextInput;
export var View = createAnimatedComponent(RXView) as typeof RX.AnimatedView;

export { Easing };
