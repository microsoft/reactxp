import Types = require('../common/Types');
export declare type Interpolator = (progress: number, dimension?: Types.Dimensions) => number;
export declare type InterpolatorWrapper = (previousStyleSet: Types.ViewStyleRuleSet, dimensions: Types.Dimensions, progress: number) => boolean;
export interface TransitionStyle {
    translateX?: (progress: number, dimension: Types.Dimensions) => string;
    translateY?: (progress: number, dimension: Types.Dimensions) => string;
    translateZ?: (progress: number, dimension: Types.Dimensions) => string;
    opacity?: ((progress: number) => number) | number;
    rotateX?: ((progress: number) => number) | number;
    rotateY?: ((progress: number) => number) | number;
    rotateZ?: ((progress: number) => number) | number;
    scaleX?: (progress: number) => number;
    scaleY?: (progress: number) => number;
    scaleZ?: (progress: number) => number;
}
export declare class NavigatorSceneConfig {
    springFriction: number;
    springTension: number;
    defaultTransitionVelocity: number;
    animationInterpolators: {
        into: InterpolatorWrapper;
        out: InterpolatorWrapper;
    };
    constructor(intoStyle: TransitionStyle, outStyle: TransitionStyle);
    private _styleInterpolator(styles);
}
export declare class NavigatorSceneConfigFactory {
    static createConfig(configType: Types.NavigatorSceneConfigType): NavigatorSceneConfig;
}
