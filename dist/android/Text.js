/**
* Text.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific implementation of Text component.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var RN = require("react-native");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var Text_1 = require("../native-common/Text");
var Styles_1 = require("../native-common/Styles");
var _styles = {
    defaultText: Styles_1.default.createTextStyle({
        includeFontPadding: false,
        textAlignVertical: 'center'
    })
};
var Text = (function (_super) {
    __extends(Text, _super);
    function Text() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Text.prototype._getStyles = function () {
        return Styles_1.default.combine(_styles.defaultText, this.props.style);
    };
    // We override the render method to work around a couple of Android-specific
    // bugs in RN. First, numberOfLines needs to be set to null rather than 0 to
    // indicate an unbounded number of lines. Second, ellipsizeMode needs to be set
    // to null to indicate the default behavior.
    Text.prototype.render = function () {
        var importantForAccessibility = AccessibilityUtil_1.default.importantForAccessibilityToString(this.props.importantForAccessibility);
        return (React.createElement(RN.Text, { style: this._getStyles(), ref: 'nativeText', importantForAccessibility: importantForAccessibility, numberOfLines: this.props.numberOfLines === 0 ? null : this.props.numberOfLines, allowFontScaling: this.props.allowFontScaling, ellipsizeMode: this.props.ellipsizeMode, onPress: this.props.onPress, textBreakStrategy: this.props.textBreakStrategy }, this.props.children));
    };
    Text.prototype.focus = function () {
        AccessibilityUtil_1.default.setAccessibilityFocus(this);
    };
    return Text;
}(Text_1.Text));
exports.Text = Text;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Text;
