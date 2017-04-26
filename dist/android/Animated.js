/**
* Animated.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific implementation of Animated wrapper.
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
var Animated_1 = require("../native-common/Animated");
var Text_1 = require("./Text");
var ReactAnimatedText = RN.Animated.createAnimatedComponent(Text_1.default);
var AnimatedText = (function (_super) {
    __extends(AnimatedText, _super);
    function AnimatedText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimatedText.prototype.render = function () {
        return (React.createElement(ReactAnimatedText, __assign({ ref: 'nativeComponent' }, this.props, { style: this.props.style }), this.props.children));
    };
    return AnimatedText;
}(Animated_1.default.Text));
exports.AnimatedText = AnimatedText;
exports.Animated = {
    Image: Animated_1.default.Image,
    Text: AnimatedText,
    TextInput: Animated_1.default.TextInput,
    View: Animated_1.default.View,
    Value: Animated_1.default.Value,
    Easing: Animated_1.default.Easing,
    timing: Animated_1.default.timing,
    delay: Animated_1.default.delay,
    parallel: Animated_1.default.parallel,
    sequence: Animated_1.default.sequence
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.Animated;
