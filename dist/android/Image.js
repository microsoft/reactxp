/**
* Image.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific implementation of Image component.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Image_1 = require("../native-common/Image");
var Styles_1 = require("../native-common/Styles");
var _styles = {
    androidImage: {
        fadeDuration: 0
    }
};
var Image = (function (_super) {
    __extends(Image, _super);
    function Image() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Overwrite the style for android since native Image has a fade in animation when an image loads
    // Setting the fadeDuration to 0, removes that animation
    Image.prototype.getStyles = function () {
        var parentStyle = _super.prototype.getStyles.call(this);
        return Styles_1.default.combine(parentStyle, _styles.androidImage);
    };
    return Image;
}(Image_1.Image));
exports.Image = Image;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Image;
