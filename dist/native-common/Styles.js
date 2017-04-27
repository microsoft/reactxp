/**
* Styles.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of style functions.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("./lodashMini");
var RN = require("react-native");
var RX = require("../common/Interfaces");
var StyleLeakDetector_1 = require("./StyleLeakDetector");
var forbiddenProps = [
    'wordBreak',
    'appRegion',
    'cursor'
];
var Styles = (function (_super) {
    __extends(Styles, _super);
    function Styles() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Styles.prototype.combine = function (defaultStyle, ruleSet, overrideStyle) {
        var styles = [defaultStyle];
        if (ruleSet) {
            if (ruleSet instanceof Array) {
                styles = styles.concat(ruleSet);
            }
            else {
                styles.push(ruleSet);
            }
        }
        if (overrideStyle) {
            styles.push(overrideStyle);
        }
        return styles;
    };
    // Creates opaque styles that can be used for View
    Styles.prototype.createViewStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates animated styles that can be used for View
    Styles.prototype.createAnimatedViewStyle = function (ruleSet) {
        return this._adaptAnimatedStyles(ruleSet);
    };
    // Creates opaque styles that can be used for ScrollView
    Styles.prototype.createScrollViewStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates opaque styles that can be used for Button
    Styles.prototype.createButtonStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates opaque styles that can be used for WebView
    Styles.prototype.createWebViewStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates opaque styles that can be used for Text
    Styles.prototype.createTextStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates opaque styles that can be used for Text
    Styles.prototype.createAnimatedTextStyle = function (ruleSet) {
        return this._adaptAnimatedStyles(ruleSet);
    };
    // Creates opaque styles that can be used for TextInput
    Styles.prototype.createTextInputStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates opaque styles that can be used for TextInput
    Styles.prototype.createAnimatedTextInputStyle = function (ruleSet) {
        return this._adaptAnimatedStyles(ruleSet);
    };
    // Creates opaque styles that can be used for Image
    Styles.prototype.createImageStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates animated opaque styles that can be used for Image
    Styles.prototype.createAnimatedImageStyle = function (ruleSet) {
        return this._adaptAnimatedStyles(ruleSet);
    };
    // Creates opaque styles that can be used for Link
    Styles.prototype.createLinkStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates opaque styles that can be used for Picker
    Styles.prototype.createPickerStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    Styles.prototype._adaptStyles = function (def, cacheStyle) {
        var adaptedRuleSet = def;
        if (cacheStyle) {
            StyleLeakDetector_1.default.detectLeaks(def);
            // Forbidden props are not allowed in uncached styles. Perform the
            // omit only in the cached path.
            adaptedRuleSet = _.omit(adaptedRuleSet, forbiddenProps);
        }
        // Convert text styling
        var textStyle = adaptedRuleSet;
        if (textStyle.font) {
            if (textStyle.font.fontFamily !== undefined) {
                textStyle.fontFamily = textStyle.font.fontFamily;
            }
            if (textStyle.font.fontWeight !== undefined) {
                textStyle.fontWeight = textStyle.font.fontWeight;
            }
            if (textStyle.font.fontStyle !== undefined) {
                textStyle.fontStyle = textStyle.font.fontStyle;
            }
            delete textStyle.font;
        }
        if (def.flex !== undefined) {
            var flexValue = def.flex;
            delete adaptedRuleSet.flex;
            if (flexValue > 0) {
                // n 1 auto
                adaptedRuleSet.flexGrow = flexValue;
                adaptedRuleSet.flexShrink = 1;
            }
            else if (flexValue < 0) {
                // 0 1 auto
                adaptedRuleSet.flexGrow = 0;
                adaptedRuleSet.flexShrink = 1;
            }
            else {
                // 0 0 auto
                adaptedRuleSet.flexGrow = 0;
                adaptedRuleSet.flexShrink = 0;
            }
        }
        if (cacheStyle) {
            return RN.StyleSheet.create({ _style: adaptedRuleSet })._style;
        }
        return adaptedRuleSet;
    };
    Styles.prototype._adaptAnimatedStyles = function (def) {
        return _.omit(def, forbiddenProps);
    };
    return Styles;
}(RX.Styles));
exports.Styles = Styles;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Styles();
