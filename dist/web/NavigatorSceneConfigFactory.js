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
"use strict";
var _ = require("./utils/lodashMini");
var Types = require("../common/Types");
// Defined style interpolators for each transition type
var SceneConfigStyles = (function () {
    function SceneConfigStyles() {
    }
    /* tslint:enable:no-unused-variable */
    // CSS requires all transforms to be combined into one transform property. bundleCompoundStyles searches a style
    // definition for separate transforms and melts it down to a "transform" property.
    SceneConfigStyles.bundleCompoundStyles = function (styles) {
        var transforms = {};
        var remaining = {};
        for (var name in styles) {
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
                        transforms[name] = _.get(styles, name);
                        break;
                    default:
                        remaining[name] = _.get(styles, name);
                        break;
                }
            }
        }
        // Add transforms into remaining object
        if (!_.isEmpty(transforms)) {
            remaining['transform'] = _.map(transforms, function (val, key) { return key + '(' + val + ')'; }).join(' ');
        }
        return remaining;
    };
    return SceneConfigStyles;
}());
SceneConfigStyles.fadeToTheLeft = {
    translateX: function (t, dimensions) { return (t * -dimensions.width * 0.3) + 'px'; },
    opacity: 1
};
SceneConfigStyles.fadeToTheRight = {
    translateX: function (t, dimensions) { return (t * dimensions.width * 0.3) + 'px'; },
    opacity: 1
};
SceneConfigStyles.fadeIn = {
    opacity: function (t) { return (t); }
};
SceneConfigStyles.fadeOut = {
    opacity: function (t) { return (1 - t); }
};
SceneConfigStyles.fadeOutToTop = {
    opacity: function (t) { return (1 - t); },
    translateY: function (t, dimensions) { return (t * -0.1 * dimensions.height) + 'px'; }
};
SceneConfigStyles.toTheLeft = {
    translateX: function (t, dimensions) { return (t * -dimensions.width) + 'px'; }
};
SceneConfigStyles.toTheUp = {
    translateY: function (t, dimensions) { return (t * -dimensions.height) + 'px'; }
};
SceneConfigStyles.toTheDown = {
    translateY: function (t, dimensions) { return (t * dimensions.height) + 'px'; }
};
SceneConfigStyles.fromTheRight = {
    opacity: 1,
    translateX: function (t, dimensions) { return (dimensions.width - (t * dimensions.width)) + 'px'; }
};
SceneConfigStyles.fromTheLeft = {
    opacity: 1,
    translateX: function (t, dimensions) { return (-dimensions.width + (t * dimensions.width)) + 'px'; }
};
SceneConfigStyles.fromTheDown = {
    translateY: function (t, dimensions) { return (dimensions.height - t * dimensions.height) + 'px'; }
};
SceneConfigStyles.fromTheUp = {
    opacity: 1,
    translateY: function (t, dimensions) { return (-dimensions.height + t * dimensions.height) + 'px'; }
};
SceneConfigStyles.fromTheFront = {
    opacity: 1,
    translateY: function (t, dimensions) { return (dimensions.height - t * dimensions.height) + 'px'; }
};
SceneConfigStyles.toTheBack = {
    scaleX: function (t) { return (1 - (t * 0.05)); },
    scaleY: function (t) { return (1 - (t * 0.05)); },
    opacity: 1
};
// Navigator config class. Navigator works on the instances of this class
var NavigatorSceneConfig = (function () {
    function NavigatorSceneConfig(intoStyle, outStyle) {
        // Rebound spring parameters when transitioning FROM this scene
        this.springFriction = 26;
        this.springTension = 200;
        // Velocity to start at when transitioning without gesture
        this.defaultTransitionVelocity = 1.5;
        // Into, Out interpolators are required to do a scene transition
        this.animationInterpolators = {
            into: this._styleInterpolator(intoStyle),
            out: this._styleInterpolator(outStyle)
        };
    }
    // Private method that hangs as a callback on animationInterpolator object
    // It calculates new styles and updates the previousStyles object sent to decide
    // if the animation triggered or not in the component that calls it
    NavigatorSceneConfig.prototype._styleInterpolator = function (styles) {
        return function (previousStyleSet, dimensions, progress) {
            // Calls the interpolator method for each type and calculates
            //
            var newStyleSet = SceneConfigStyles.bundleCompoundStyles(_.mapValues(styles, function (interpolator) {
                return _.isNumber(interpolator) ? interpolator : interpolator(progress, dimensions);
            }));
            // Check if anything has changed since last frame.
            if (_.isEqual(previousStyleSet, newStyleSet)) {
                return false;
            }
            // Copy the new props into the previous object.
            for (var prop in newStyleSet) {
                if (newStyleSet.hasOwnProperty(prop)) {
                    _.assign(previousStyleSet, (_a = {}, _a[prop] = _.get(newStyleSet, prop), _a));
                }
            }
            return true;
            var _a;
        };
    };
    return NavigatorSceneConfig;
}());
exports.NavigatorSceneConfig = NavigatorSceneConfig;
// Factory class to create Navigator scene configurations for each type of transition between routes
var NavigatorSceneConfigFactory = (function () {
    function NavigatorSceneConfigFactory() {
    }
    // Helper method that creates a new Animation config for a scene
    NavigatorSceneConfigFactory.createConfig = function (configType) {
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
    };
    return NavigatorSceneConfigFactory;
}());
exports.NavigatorSceneConfigFactory = NavigatorSceneConfigFactory;
