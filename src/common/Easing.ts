/**
* Easing.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Easing functions for animations.
*/

import Bezier = require('./Bezier');
import Types = require('./Types');

export class Easing implements Types.Animated.Easing {
    CubicBezier(x1: number, y1: number, x2: number, y2: number): Types.Animated.EasingFunction {
        return {
            cssName: 'cubic-bezier(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ')',
            function: Bezier.bezier(x1, y1, x2, y2)
        };
    }

    Default(): Types.Animated.EasingFunction {
        let bezier = this.CubicBezier(0.42, 0, 1, 1);
        return {
            cssName: 'ease',
            function: bezier.function
        };
    }

    Linear(): Types.Animated.EasingFunction {
        return {
            cssName: 'linear',
            function: (input: number) => { return input; }
        };
    }

    Out(): Types.Animated.EasingFunction {
        let bezier = this.CubicBezier(0, 0, 0.58, 1);
        return {
            cssName: 'ease-out',
            function: bezier.function
        };
    }

    In(): Types.Animated.EasingFunction {
        let bezier = this.CubicBezier(0.42, 0, 1, 1);
        return {
            cssName: 'ease-in',
            function: bezier.function
        };
    }

    InOut(): Types.Animated.EasingFunction {
        let bezier = this.CubicBezier(0.42, 0, 0.58, 1);
        return {
            cssName: 'ease-in-out',
            function: bezier.function
        };
    }

    OutBack(): Types.Animated.EasingFunction {
        let bezier = this.CubicBezier(0.175, 0.885, 0.320, 1.275);
        return {
            cssName: bezier.cssName,
            function: bezier.function
        };
    }

    InBack(): Types.Animated.EasingFunction {
        let bezier = this.CubicBezier(0.600, -0.280, 0.735, 0.045);
        return {
            cssName: bezier.cssName,
            function: bezier.function
        };
    }

    InOutBack(): Types.Animated.EasingFunction {
        let bezier = this.CubicBezier(0.680, -0.550, 0.265, 1.550);
        return {
            cssName: bezier.cssName,
            function: bezier.function
        };
    }

    Steps(intervals: number, end: boolean = true): Types.Animated.EasingFunction {
        return {
            cssName: 'steps(' + intervals + ', ' + (end ? 'end' : 'start') + ')',
            function: (input: number) => {
                let interval = intervals * input;
                if (end) {
                    interval = Math.floor(interval);
                } else {
                    interval = Math.ceil(interval);
                }
                return interval / intervals;
            }
        };
    }

    StepStart(): Types.Animated.EasingFunction {
        let steps = this.Steps(1, false);
        return {
            cssName: 'steps(1, start)',
            function: steps.function
        };
    }

    StepEnd(): Types.Animated.EasingFunction {
        let steps = this.Steps(1, true);
        return {
            cssName: 'steps(1, end)',
            function: steps.function
        };
    }
}

export default new Easing();
