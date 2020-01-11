/**
 * NavigatorSceneConfigFactory.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * NavigatorSceneConfigFactory creates an 'object' of type NavigatorSceneConfig,
 * which is consumed by the Navigator. This object contains properties to execute
 * spring animation for transition between scenes. NavigatorSceneConfigFactory and
 * NavigatorSceneConfig are both exported.
 */

import * as RX from 'reactxp';

import * as _ from '../common/lodashMini';
import * as Types from '../common/Types';

// Interpolator type, which accepts a combination of these types and returns a interpolated/calculated result
// Interpolator wrapper, which is given as a callback method to Navigator to call the animation interpolator
export type Interpolator = (progress: number, dimension?: RX.Types.Dimensions) => number;
export type InterpolatorWrapper = (previousStyleSet: RX.Types.ViewStyleRuleSet,
    dimensions: RX.Types.Dimensions, progress: number) => boolean;

// Interface to define the transition styles for multiple views
export interface TransitionStyle {
    translateX?: (progress: number, dimension: RX.Types.Dimensions) => string;
    translateY?: (progress: number, dimension: RX.Types.Dimensions) => string;
    translateZ?: (progress: number, dimension: RX.Types.Dimensions) => string;
    // Note: Weird type: Either a 'function type' or a 'number'
    opacity?: ((progress: number) => number) | number;
    rotateX?: ((progress: number) => number) | number;
    rotateY?: ((progress: number) => number) | number;
    rotateZ?: ((progress: number) => number) | number;
    scaleX?: (progress: number) => number;
    scaleY?: (progress: number) => number;
    scaleZ?: (progress: number) => number;
}

// Defined style interpolators for each transition type
class SceneConfigStyles {
    static fadeToTheLeft: TransitionStyle = {
        translateX: (t, dimensions) =>(t * -dimensions.width * 0.3) + 'px',
        opacity: 1,
    };

    static fadeToTheRight: TransitionStyle = {
        translateX: (t, dimensions) => (t * dimensions.width * 0.3) + 'px',
        opacity: 1,
    };

    static fadeIn: TransitionStyle = {
        opacity: t => t,
    };

    static fadeOut: TransitionStyle = {
        opacity: t => 1 - t,
    };

    static fadeOutToTop: TransitionStyle = {
        opacity: t => 1 - t,
        translateY: (t, dimensions) => (t * -0.1 * dimensions.height) + 'px',
    };

    static toTheLeft: TransitionStyle = {
        translateX: (t, dimensions) => (t * -dimensions.width) + 'px',
    };

    static toTheUp: TransitionStyle = {
        translateY: (t, dimensions) => (t * -dimensions.height) + 'px',
    };

    static toTheDown: TransitionStyle = {
        translateY: (t, dimensions) => (t * dimensions.height) + 'px',
    };

    static fromTheRight: TransitionStyle = {
        opacity: 1,
        translateX: (t, dimensions) => (dimensions.width - (t * dimensions.width)) + 'px',
    };

    static fromTheLeft: TransitionStyle = {
        opacity: 1,
        translateX: (t, dimensions) => (-dimensions.width + (t * dimensions.width)) + 'px',
    };

    static fromTheDown: TransitionStyle = {
        translateY: (t, dimensions) => (dimensions.height - t * dimensions.height) + 'px',
    };

    static fromTheUp: TransitionStyle = {
        opacity: 1,
        translateY: (t, dimensions) => (-dimensions.height + t * dimensions.height) + 'px',
    };

    static fromTheFront: TransitionStyle = {
        opacity: 1,
        translateY: (t, dimensions) => (dimensions.height - t * dimensions.height) + 'px',
    };

    static toTheBack: TransitionStyle = {
        scaleX: t => (1 - (t * 0.05)),
        scaleY: t => (1 - (t * 0.05)),
        opacity: 1,
    };

    // CSS requires all transforms to be combined into one transform property. bundleCompoundStyles searches a style
    // definition for separate transforms and melts it down to a "transform" property.
    static bundleCompoundStyles(styles: { [name: string]: string | number }): any {
        const transforms: { [name: string]: string | number } = { };
        const remaining: { [name: string]: string | number } = { };

        for (const name in styles) {
            if (styles.hasOwnProperty(name)) {
                switch (name) {
                    case 'translateX':
                    case 'translateY':
                    case 'translateZ':
                    case 'scaleX':
                    case 'scaleY':
                    case 'scaleZ':
                    case 'rotateX':
                    case 'rotateY':
                    case 'rotateZ':
                        transforms[name] = styles[name];
                        break;

                    default:
                        remaining[name] = styles[name];
                        break;
                }
            }
        }

        // Add transforms into remaining object
        if (!_.isEmpty(transforms)) {
            remaining.transform = _.map(transforms, (val, key) => key + '(' + val + ')').join(' ');
        }

        return remaining;
    }
}

// Navigator config class. Navigator works on the instances of this class
export class NavigatorSceneConfig {
    // Rebound spring parameters when transitioning FROM this scene
    springFriction = 26;
    springTension = 200;

    // Velocity to start at when transitioning without gesture
    defaultTransitionVelocity = 1.5;

    // Returns an object of functions that return a function
    animationInterpolators: {
        into: InterpolatorWrapper;
        out: InterpolatorWrapper;
    };

    constructor(intoStyle: TransitionStyle, outStyle: TransitionStyle) {
        // Into, Out interpolators are required to do a scene transition
        this.animationInterpolators = {
            into: this._styleInterpolator(intoStyle),
            out: this._styleInterpolator(outStyle),
        };
    }

    // Private method that hangs as a callback on animationInterpolator object
    // It calculates new styles and updates the previousStyles object sent to decide
    // if the animation triggered or not in the component that calls it
    private _styleInterpolator(styles: TransitionStyle): InterpolatorWrapper {
        return (previousStyleSet: RX.Types.ViewStyleRuleSet, dimensions: RX.Types.Dimensions, progress: number): boolean => {
            // Calls the interpolator method for each type and calculates
            const newStyleSet = SceneConfigStyles.bundleCompoundStyles(
                _.mapValues(styles, (interpolator: Interpolator | number) => (
                    _.isNumber(interpolator) ? interpolator : interpolator(progress, dimensions)
                )) as any);

            // Check if anything has changed since last frame.
            if (_.isEqual(previousStyleSet, newStyleSet)) {
                return false;
            }

            // Copy the new props into the previous object.
            for (const prop in newStyleSet) {
                if (newStyleSet.hasOwnProperty(prop)) {
                    _.assign(previousStyleSet, {[prop]: _.get(newStyleSet, prop)});
                }
            }

            return true;
        };
    }
}

// Factory class to create Navigator scene configurations for each type of transition between routes
export class NavigatorSceneConfigFactory {

    // Helper method that creates a new Animation config for a scene
    static createConfig(configType: Types.NavigatorSceneConfigType): NavigatorSceneConfig {
        switch (configType) {
            case Types.NavigatorSceneConfigType.FloatFromRight:
                return new NavigatorSceneConfig(SceneConfigStyles.fromTheRight, SceneConfigStyles.fadeToTheLeft);

            case Types.NavigatorSceneConfigType.FloatFromLeft:
                return new NavigatorSceneConfig(SceneConfigStyles.fromTheLeft, SceneConfigStyles.fadeToTheRight);

            case Types.NavigatorSceneConfigType.FloatFromBottom:
                return new NavigatorSceneConfig(SceneConfigStyles.fromTheFront, SceneConfigStyles.toTheBack);

            case Types.NavigatorSceneConfigType.Fade:
                return new NavigatorSceneConfig(SceneConfigStyles.fadeIn, SceneConfigStyles.fadeOut);

            case Types.NavigatorSceneConfigType.FadeWithSlide:
                return new NavigatorSceneConfig(SceneConfigStyles.fadeIn, SceneConfigStyles.fadeOutToTop);

            default:
                // Float from Right
                return new NavigatorSceneConfig(SceneConfigStyles.fromTheLeft, SceneConfigStyles.fadeToTheRight);
        }
    }
}
