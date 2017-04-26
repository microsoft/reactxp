import RN = require('react-native');
import RX = require('../common/Interfaces');
import CommonAnimated from '../native-common/Animated';
export declare class AnimatedText extends CommonAnimated.Text {
    render(): JSX.Element;
}
export declare type AnimatedValue = typeof CommonAnimated.Value;
export declare var Animated: {
    Image: typeof RX.AnimatedImage;
    Text: typeof RX.AnimatedText;
    TextInput: typeof RX.AnimatedTextInput;
    View: typeof RX.AnimatedView;
    Value: typeof RX.AnimatedValue;
    Easing: RX.Types.Animated.Easing;
    timing: RX.Types.Animated.TimingFunction;
    delay: (time: number) => RN.CompositeAnimation;
    parallel: (animations: RN.CompositeAnimation[]) => RN.CompositeAnimation;
    sequence: (animations: RN.CompositeAnimation[]) => RN.CompositeAnimation;
};
export default Animated;
