import Easing from '../common/Easing';
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare abstract class Animation {
    _id: number;
    _triggerAnimation: boolean;
    _toValue: number | string;
    abstract start(onEnd?: Types.Animated.EndCallback): void;
    abstract stop(): void;
    abstract forceAnimate(): void;
}
export declare class Value extends RX.AnimatedValue {
    _value: number | string;
    _listenerId: number;
    _animationId: number;
    _animations: {
        [key: number]: Animation;
    };
    _listeners: {
        [key: number]: Types.Animated.ValueListenerCallback;
    };
    _animatedValueUniqueId: number;
    _cssProperties: {
        [key: string]: string;
    };
    _element: HTMLElement;
    _isInitialized: boolean;
    _interpolationConfig: {
        [key: number]: (number | string);
    };
    constructor(value: number);
    getId(): number;
    getValue(): number | string;
    interpolate(config: Types.Animated.InterpolationConfigType): this;
    getAnimation(id: number): Animation;
    addCssProperty(key: string, value: string): void;
    setValue(value: number | string): void;
    isInitialized(): boolean;
    setAsInitialized(element: HTMLElement): void;
    destroy(): void;
    addListener(callback: Types.Animated.ValueListenerCallback): number;
    removeListener(id: string): void;
    removeAllListeners(): void;
    addAnimation(animation: Animation): number;
    startAnimation(id: number, onEnd?: Types.Animated.EndCallback): void;
    stopAnimation(id: number): void;
    private _startPendingAnimations();
    private _updateElementStyles();
    updateElementStylesOnto(styles: Object): void;
    getCssValueString(): string;
    private _updateValue(value);
}
export declare var timing: Types.Animated.TimingFunction;
export declare var sequence: Types.Animated.SequenceFunction;
export declare var parallel: Types.Animated.ParallelFunction;
export declare var Image: typeof RX.AnimatedImage;
export declare var Text: typeof RX.AnimatedText;
export declare var TextInput: typeof RX.AnimatedTextInput;
export declare var View: typeof RX.AnimatedView;
export { Easing };
