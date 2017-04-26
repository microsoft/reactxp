import RN = require('react-native');
import Types = require('../common/Types');
import RX = require('../common/Interfaces');
export declare class AnimatedImage extends RX.AnimatedImage {
    setNativeProps(props: Types.AnimatedImageProps): void;
    render(): JSX.Element;
}
export declare class AnimatedText extends RX.AnimatedText {
    setNativeProps(props: Types.AnimatedTextProps): void;
    render(): JSX.Element;
}
export declare class AnimatedTextInput extends RX.AnimatedTextInput {
    setNativeProps(props: Types.AnimatedTextInputProps): void;
    focus(): void;
    blur(): void;
    render(): JSX.Element;
}
export declare class AnimatedView extends RX.AnimatedView {
    setNativeProps(props: Types.AnimatedViewProps): void;
    focus(): void;
    blur(): void;
    render(): JSX.Element;
}
export declare var Animated: {
    Image: typeof AnimatedImage;
    Text: typeof AnimatedText;
    TextInput: typeof AnimatedTextInput;
    View: typeof AnimatedView;
    Value: typeof RN.Animated.Value;
    Easing: Types.Animated.Easing;
    timing: (value: RX.AnimatedValue, config: Types.Animated.TimingAnimationConfig) => Types.Animated.CompositeAnimation;
    delay: (time: number) => RN.CompositeAnimation;
    parallel: (animations: RN.CompositeAnimation[]) => RN.CompositeAnimation;
    sequence: (animations: RN.CompositeAnimation[]) => RN.CompositeAnimation;
};
export default Animated;
