import Types = require('./Types');
export declare class Easing implements Types.Animated.Easing {
    CubicBezier(x1: number, y1: number, x2: number, y2: number): Types.Animated.EasingFunction;
    Default(): Types.Animated.EasingFunction;
    Linear(): Types.Animated.EasingFunction;
    Out(): Types.Animated.EasingFunction;
    In(): Types.Animated.EasingFunction;
    InOut(): Types.Animated.EasingFunction;
    OutBack(): Types.Animated.EasingFunction;
    InBack(): Types.Animated.EasingFunction;
    InOutBack(): Types.Animated.EasingFunction;
    Steps(intervals: number, end?: boolean): Types.Animated.EasingFunction;
    StepStart(): Types.Animated.EasingFunction;
    StepEnd(): Types.Animated.EasingFunction;
}
declare var _default: Easing;
export default _default;
