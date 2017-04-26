/**
* Animated.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Implements animated components for web version of ReactXP.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var _ = require("./utils/lodashMini");
var React = require("react");
var ReactDOM = require("react-dom");
var Easing_1 = require("../common/Easing");
exports.Easing = Easing_1.default;
var executeTransition_1 = require("./animated/executeTransition");
var Image_1 = require("./Image");
var View_1 = require("./View");
var Text_1 = require("./Text");
var TextInput_1 = require("./TextInput");
var RX = require("../common/Interfaces");
var Styles_1 = require("./Styles");
// Animated Css Property Units - check /common/Types for the list of available
// css animated properties
var animatedPropUnits = {
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
    fontSize: ''
};
// Every Animation subclass should extend this.
var Animation = (function () {
    function Animation() {
        this._triggerAnimation = false; // Flag that sets animation to start.
    }
    return Animation;
}());
exports.Animation = Animation;
// Incrementor for the animated value
// this incrementor is necessary for all the initialization
var animatedValueUniqueId = 0;
// The animated value object
var Value = (function (_super) {
    __extends(Value, _super);
    // Initializes the object with the defaults and assigns the id for the animated value.
    function Value(value) {
        var _this = _super.call(this, value) || this;
        _this._cssProperties = {};
        _this._isInitialized = false;
        _this._value = value;
        _this._animations = {};
        _this._listeners = {};
        _this._animationId = 0;
        _this._listenerId = 0;
        _this._animatedValueUniqueId = ++animatedValueUniqueId;
        return _this;
    }
    // Gets the unique id for this animated value
    Value.prototype.getId = function () {
        return this._animatedValueUniqueId;
    };
    // Gets the current animated value (this gets updates after animation concludes)
    Value.prototype.getValue = function () {
        return this._value;
    };
    Value.prototype.interpolate = function (config) {
        var _this = this;
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
        _.each(config.inputRange, function (value, index) {
            _this._interpolationConfig[value] = config.outputRange[index];
        });
        return this;
    };
    // Gets animation reference by id. An animated value may be referenced in multiple animations.
    Value.prototype.getAnimation = function (id) {
        // Return CSS key (transition/animation) string from animation object if available.
        if (this._animations) {
            return this._animations[id];
        }
        return null;
    };
    // Adds a new associated css property to this animated value.
    Value.prototype.addCssProperty = function (key, value) {
        if (key && value) {
            this._cssProperties[key] = value;
        }
        else {
            throw 'Trying to add a css property which has invalid key/value. Key:' + key;
        }
    };
    // Updates a value in this animated reference.
    Value.prototype.setValue = function (value) {
        if (value === undefined) {
            throw 'An invalid value was passed into setvalue in the animated value api';
        }
        this._updateValue(value);
        this._updateElementStyles();
    };
    // True if the animated value was correctly initialized; false otherwise.
    Value.prototype.isInitialized = function () {
        return this._isInitialized;
    };
    // Sets an HTML element for the animated value
    Value.prototype.setAsInitialized = function (element) {
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
    };
    // Clears the HTML element reference and marks the value as uninitialized
    Value.prototype.destroy = function () {
        this._isInitialized = false;
        this._element = null;
    };
    // Add listener for when the value gets updated.
    Value.prototype.addListener = function (callback) {
        if (callback) {
            this._listenerId++;
            this._listeners[this._listenerId] = callback;
        }
        return this._listenerId;
    };
    // Remove a specific listner.
    Value.prototype.removeListener = function (id) {
        delete this._listeners[id];
    };
    // Remove all listeners.
    Value.prototype.removeAllListeners = function () {
        this._listeners = {};
    };
    // Add an associated animation into this animated value.
    Value.prototype.addAnimation = function (animation) {
        if (!animation) {
            throw 'It\'s not ok to add a null animation into animated value bah';
        }
        this._animationId++;
        animation._id = this._animationId;
        this._animations[this._animationId] = animation;
        return this._animationId;
    };
    // Start a specific animation.
    Value.prototype.startAnimation = function (id, onEnd) {
        if (!id) {
            throw 'An id is needed in order to start an animation in the animated value';
        }
        var animation = this._animations[id];
        if (!animation) {
            throw 'Animation not found so not possible to start it.';
        }
        animation.start(onEnd);
    };
    // Stop animation.
    Value.prototype.stopAnimation = function (id) {
        if (!id) {
            throw 'An id is needed in order to stop an animation in the animated value';
        }
        var animation = this._animations[id];
        if (!animation) {
            throw 'Animation not found so not possible to stop it.';
        }
        animation.stop();
        // Make sure the reference for this animation is destroyed.
        // This will avoid problems where timing animations are shared across multiple states.
        this._animations[id] = null;
    };
    Value.prototype._startPendingAnimations = function () {
        // Start animations if they were waiting for the animated value to be initialized.
        // This is accomplished via the animate flag within the animation (isReadyToAnimate).
        _.each(this._animations, function (animation) {
            if (animation && animation._triggerAnimation) {
                animation.forceAnimate();
            }
        });
    };
    Value.prototype._updateElementStyles = function () {
        // Update the style of the element.
        if (this._isInitialized) {
            this.updateElementStylesOnto(this._element.style);
        }
    };
    Value.prototype.updateElementStylesOnto = function (styles) {
        var _this = this;
        // Just update the style and make sure it renders the frame 1.
        _.each(this._cssProperties, function (value, key) {
            styles[key] = value.replace(new RegExp('##', 'g'), _this.getCssValueString());
        });
    };
    Value.prototype.getCssValueString = function () {
        if (this._interpolationConfig) {
            var fromValue = this._interpolationConfig[this.getValue()];
            if (fromValue === undefined) {
                throw 'The interpolation config does not match the animated value or to value specified';
            }
            return fromValue.toString();
        }
        return this.getValue().toString();
    };
    // Update the value and kicks the callbacks.
    Value.prototype._updateValue = function (value) {
        // If value the same, do nothing.
        if (value === this._value) {
            return;
        }
        this._value = value;
        // Notify subscribers about the new value.
        for (var key in this._listeners) {
            if (typeof this._listeners[key] === 'ValueListenerCallback') {
                this._listeners[key](this.getValue());
            }
        }
    };
    return Value;
}(RX.AnimatedValue));
exports.Value = Value;
// Parser for the transform css. Transform needs a special way to parse animated values.
var AnimatedTransform = (function () {
    function AnimatedTransform() {
    }
    AnimatedTransform.initialize = function (style) {
        // Temporary cache for the animated values parsed so far.
        var animatedValues = [];
        if (style['animatedTransform']) {
            _.each(style['animatedTransform'], function (transform) {
                animatedValues.push(transform.value);
                // We currently support only one animated transform type per style.
                // The last one will "win".
                transform.value.addCssProperty('transform', transform.type + '(##' + animatedPropUnits[transform.type] + ') ');
            });
        }
        return animatedValues;
    };
    return AnimatedTransform;
}());
// Animating functions
var TimingAnimation = (function (_super) {
    __extends(TimingAnimation, _super);
    function TimingAnimation(value, config) {
        var _this = _super.call(this) || this;
        _this._animatedValue = value;
        _this._toValue = config.toValue;
        _this._easing = config.easing || Easing_1.default.Default();
        _this._duration = config.duration !== undefined ? config.duration : 500;
        _this._delay = config.delay || 0;
        _this._loop = config.loop !== undefined;
        _this._initialized = false;
        return _this;
    }
    TimingAnimation.prototype._stripUnits = function (value) {
        // We need to strip off 'deg' or 'px' units from the end
        // of the interpolated values for compatibility with React Native.
        var trimmedValue = value.trim();
        var unitsToStrip = ['deg', 'px'];
        _.each(unitsToStrip, function (units) {
            if (_.endsWith(trimmedValue, units)) {
                value = trimmedValue.substr(0, trimmedValue.length - units.length);
                return false;
            }
        });
        return value;
    };
    // Animate the animated value
    TimingAnimation.prototype.forceAnimate = function () {
        var _this = this;
        if (this._animatedValue.isInitialized()) {
            var properties_1 = [];
            var fromValue_1;
            var toValue_1;
            // TODO: Support animating multiple properties in the same animated value at the same time.
            _.each(this._animatedValue._cssProperties, function (value, property) {
                if (_this._animatedValue._interpolationConfig) {
                    fromValue_1 = _this._animatedValue._interpolationConfig[_this._animatedValue.getValue()].toString();
                    toValue_1 = _this._animatedValue._interpolationConfig[_this._toValue.toString()].toString();
                    if (!fromValue_1 || !toValue_1) {
                        throw 'The interpolation config does not match the animated value or to value specified';
                    }
                    fromValue_1 = _this._stripUnits(fromValue_1);
                    toValue_1 = _this._stripUnits(toValue_1);
                }
                else {
                    fromValue_1 = _this._animatedValue.getValue().toString();
                    toValue_1 = _this._toValue.toString();
                }
                var from = value.replace(new RegExp('##', 'g'), fromValue_1);
                var to = value.replace(new RegExp('##', 'g'), toValue_1);
                properties_1.push({
                    property: _.kebabCase(property),
                    duration: _this._duration,
                    timing: _this._easing.cssName,
                    delay: _this._delay,
                    from: from,
                    to: to
                });
            });
            this.resetAnimation();
            executeTransition_1.executeTransition(this._animatedValue._element, properties_1, function () {
                if (_this._triggerAnimation) {
                    if (!_this._loop) {
                        _this._animatedValue.setValue(_this._toValue);
                    }
                    _this._triggerAnimation = false;
                    if (_this._onEnd) {
                        _this._onEnd({ finished: !_this._loop });
                    }
                }
            });
        }
    };
    TimingAnimation.prototype.resetAnimation = function () {
        if (this._animatedValue.isInitialized()) {
            this._animatedValue._element.style.transition = 'none';
        }
    };
    // Flag the animation to start.
    TimingAnimation.prototype.start = function (onEnd) {
        this._onEnd = onEnd;
        this._triggerAnimation = true;
        this.forceAnimate();
    };
    // Flag the animation to stop.
    TimingAnimation.prototype.stop = function () {
        this._triggerAnimation = false;
        this._animatedValue.setValue(this._toValue);
        this.resetAnimation();
        if (this._onEnd) {
            this._onEnd({ finished: false });
        }
    };
    return TimingAnimation;
}(Animation));
exports.timing = function (value, config) {
    if (!value || !config) {
        throw 'Timing animation requires value and config';
    }
    // Set the animation on the value as soon as the timing animation is created
    // And trigger start and stop through animations
    var id = value.addAnimation(new TimingAnimation(value, config));
    var isLooping = config.loop !== undefined && config.loop != null;
    return {
        start: function (callback) {
            function animate() {
                if (isLooping) {
                    value.setValue(config.loop.restartFrom);
                }
                value.startAnimation(id, function (r) {
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
        stop: function () {
            isLooping = false;
            value.stopAnimation(id);
        },
    };
};
exports.sequence = function (animations) {
    if (!animations) {
        throw 'Sequence animation requires a list of animations';
    }
    var hasBeenStopped = false;
    var doneCount = 0;
    var result = {
        start: function (callback) {
            if (!animations || animations.length === 0) {
                throw 'No animations were passed to the animated sequence api';
            }
            var executeNext = function () {
                doneCount++;
                var isFinished = doneCount === animations.length;
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
exports.parallel = function (animations) {
    if (!animations) {
        throw 'Parallel animation requires a list of animations';
    }
    // Variable to make sure we only call stop() at most once
    var hasBeenStopped = false;
    var doneCount = 0;
    var result = {
        start: function (callback) {
            if (!animations || animations.length === 0) {
                throw 'No animations were passed to the animated parallel api';
            }
            // Walk through animations and start all as soon as possible.
            animations.forEach(function (animation, id) {
                animation.start(function (animationResult) {
                    doneCount++;
                    var isFinished = doneCount === animations.length;
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
        stop: function () {
            doneCount = 0;
            hasBeenStopped = true;
            animations.forEach(function (animation) {
                animation.stop();
            });
        }
    };
    return result;
};
// Function for creating wrapper AnimatedComponent around passed in component
function createAnimatedComponent(Component) {
    var refName = 'animatedNode';
    var AnimatedComponentGenerated = (function (_super) {
        __extends(AnimatedComponentGenerated, _super);
        function AnimatedComponentGenerated(props) {
            var _this = _super.call(this, props) || this;
            _this._updateStyles(props);
            return _this;
        }
        AnimatedComponentGenerated.prototype.setNativeProps = function (props) {
            throw 'Called setNativeProps on web AnimatedComponent';
        };
        AnimatedComponentGenerated.prototype.componentWillReceiveProps = function (props) {
            this._updateStyles(props);
        };
        AnimatedComponentGenerated.prototype._updateStyles = function (props) {
            var _this = this;
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
            var styles = Styles_1.default.combine(null, props.style);
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
                }
                else if (styles.hasOwnProperty(styleKey)) {
                    this._initialStyle[styleKey] = styles[styleKey];
                }
            }
            // Add the complicated styles
            _.each(this._animatedValues, function (value) {
                value.updateElementStylesOnto(_this._initialStyle);
            });
        };
        AnimatedComponentGenerated.prototype.initializeComponent = function (props) {
            // Conclude the initialization setting the element.
            var element = ReactDOM.findDOMNode(this.refs[refName]);
            if (element) {
                this._animatedValues.forEach(function (Value) {
                    Value.setAsInitialized(element);
                });
            }
        };
        AnimatedComponentGenerated.prototype.componentDidMount = function () {
            this.initializeComponent(this.props);
        };
        AnimatedComponentGenerated.prototype.componentDidUpdate = function () {
            this.initializeComponent(this.props);
        };
        AnimatedComponentGenerated.prototype.componentWillUnmount = function () {
            _.each(this._animatedValues, function (value) {
                value.destroy();
            });
            this._animatedValues = [];
        };
        AnimatedComponentGenerated.prototype.focus = function () {
            if (this.refs[refName] instanceof View_1.default) {
                var component = this.refs[refName];
                if (component.focus) {
                    component.focus();
                }
            }
        };
        AnimatedComponentGenerated.prototype.blur = function () {
            if (this.refs[refName] instanceof View_1.default) {
                var component = this.refs[refName];
                if (component.blur) {
                    component.blur();
                }
            }
        };
        AnimatedComponentGenerated.prototype.render = function () {
            return (React.createElement(Component, __assign({ style: this._initialStyle }, this._propsWithoutStyle, { ref: refName }), this.props.children));
        };
        return AnimatedComponentGenerated;
    }(React.Component));
    // Update the component's display name for easy debugging in react devtools extension
    AnimatedComponentGenerated.displayName = "Animated." + (Component.displayName || Component.name || 'Component');
    return AnimatedComponentGenerated;
}
exports.Image = createAnimatedComponent(Image_1.default);
exports.Text = createAnimatedComponent(Text_1.default);
exports.TextInput = createAnimatedComponent(TextInput_1.default);
exports.View = createAnimatedComponent(View_1.default);
