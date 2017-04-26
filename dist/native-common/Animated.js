/**
* Animated.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Animation abstraction.
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
var React = require("react");
var RN = require("react-native");
var Easing_1 = require("../common/Easing");
var Image_1 = require("./Image");
var View_1 = require("./View");
var Text_1 = require("./Text");
var TextInput_1 = require("./TextInput");
var RX = require("../common/Interfaces");
var ReactNativeAnimatedClasses = {
    Image: RN.Animated.createAnimatedComponent(Image_1.default),
    Text: RN.Animated.createAnimatedComponent(Text_1.default),
    TextInput: RN.Animated.createAnimatedComponent(TextInput_1.default),
    View: RN.Animated.createAnimatedComponent(View_1.default, true)
};
var AnimatedImage = (function (_super) {
    __extends(AnimatedImage, _super);
    function AnimatedImage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimatedImage.prototype.setNativeProps = function (props) {
        var nativeComponent = this.refs['nativeComponent'];
        if (nativeComponent) {
            if (!nativeComponent.setNativeProps) {
                throw 'Component does not implement setNativeProps';
            }
            nativeComponent.setNativeProps(props);
        }
    };
    AnimatedImage.prototype.render = function () {
        return (React.createElement(ReactNativeAnimatedClasses.Image, __assign({ ref: 'nativeComponent' }, this.props, { style: this.props.style }), this.props.children));
    };
    return AnimatedImage;
}(RX.AnimatedImage));
exports.AnimatedImage = AnimatedImage;
var AnimatedText = (function (_super) {
    __extends(AnimatedText, _super);
    function AnimatedText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimatedText.prototype.setNativeProps = function (props) {
        var nativeComponent = this.refs['nativeComponent'];
        if (nativeComponent) {
            if (!nativeComponent.setNativeProps) {
                throw 'Component does not implement setNativeProps';
            }
            nativeComponent.setNativeProps(props);
        }
    };
    AnimatedText.prototype.render = function () {
        return (React.createElement(ReactNativeAnimatedClasses.Text, __assign({ ref: 'nativeComponent' }, this.props, { style: this.props.style }), this.props.children));
    };
    return AnimatedText;
}(RX.AnimatedText));
exports.AnimatedText = AnimatedText;
var AnimatedTextInput = (function (_super) {
    __extends(AnimatedTextInput, _super);
    function AnimatedTextInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimatedTextInput.prototype.setNativeProps = function (props) {
        var nativeComponent = this.refs['nativeComponent'];
        if (nativeComponent) {
            if (!nativeComponent.setNativeProps) {
                throw 'Component does not implement setNativeProps';
            }
            nativeComponent.setNativeProps(props);
        }
    };
    AnimatedTextInput.prototype.focus = function () {
        var nativeComponent = this.refs['nativeComponent'];
        if (nativeComponent && nativeComponent._component) {
            nativeComponent._component.focus();
        }
    };
    AnimatedTextInput.prototype.blur = function () {
        var nativeComponent = this.refs['nativeComponent'];
        if (nativeComponent && nativeComponent._component) {
            nativeComponent._component.blur();
        }
    };
    AnimatedTextInput.prototype.render = function () {
        return (React.createElement(ReactNativeAnimatedClasses.TextInput, __assign({ ref: 'nativeComponent' }, this.props, { style: this.props.style })));
    };
    return AnimatedTextInput;
}(RX.AnimatedTextInput));
exports.AnimatedTextInput = AnimatedTextInput;
var AnimatedView = (function (_super) {
    __extends(AnimatedView, _super);
    function AnimatedView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimatedView.prototype.setNativeProps = function (props) {
        var nativeComponent = this.refs['nativeComponent'];
        if (nativeComponent) {
            if (!nativeComponent.setNativeProps) {
                throw 'Component does not implement setNativeProps';
            }
            nativeComponent.setNativeProps(props);
        }
    };
    AnimatedView.prototype.focus = function () {
        // Native mobile platform doesn't have the notion of focus for AnimatedViews, so ignore
    };
    AnimatedView.prototype.blur = function () {
        // Native mobile platform doesn't have the notion of blur for AnimatedViews, so ignore
    };
    AnimatedView.prototype.render = function () {
        return (React.createElement(ReactNativeAnimatedClasses.View, __assign({ ref: 'nativeComponent' }, this.props, { style: this.props.style }), this.props.children));
    };
    return AnimatedView;
}(RX.AnimatedView));
exports.AnimatedView = AnimatedView;
var timing = function (value, config) {
    var isLooping = config.loop !== undefined && config.loop != null;
    return {
        start: function (callback) {
            function animate() {
                var timingConfig = {
                    toValue: config.toValue,
                    easing: config.easing ? config.easing.function : null,
                    duration: config.duration,
                    delay: config.delay,
                    isInteraction: config.isInteraction,
                    useNativeDriver: config.useNativeDriver
                };
                RN.Animated.timing(value, timingConfig).start(function (r) {
                    if (callback) {
                        callback(r);
                    }
                    if (isLooping) {
                        value.setValue(config.loop.restartFrom);
                        // Hack to get into the loop
                        animate();
                    }
                });
            }
            // Trigger animation loop (hack for now)
            animate();
        },
        stop: function () {
            isLooping = false;
            value.stopAnimation();
        },
    };
};
exports.Animated = {
    Image: AnimatedImage,
    Text: AnimatedText,
    TextInput: AnimatedTextInput,
    View: AnimatedView,
    Value: RN.Animated.Value,
    Easing: Easing_1.default,
    timing: timing,
    delay: RN.Animated.delay,
    parallel: RN.Animated.parallel,
    sequence: RN.Animated.sequence
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.Animated;
