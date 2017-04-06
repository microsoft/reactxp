/**
* Image.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific implementation of Image component.
*/

import { Image as CommonImage } from '../native-common/Image';
import Styles from '../native-common/Styles';
import Types = require('../common/Types');

var _styles = {
    androidImage: {
        fadeDuration: 0
    }
};

export class Image extends CommonImage {

    // Overwrite the style for android since native Image has a fade in animation when an image loads
    // Setting the fadeDuration to 0, removes that animation
    protected getStyles(): Types.ImageStyleRuleSet {
        const parentStyle = super.getStyles();
        return Styles.combine(parentStyle, _styles.androidImage);
    }
}

export default Image;
