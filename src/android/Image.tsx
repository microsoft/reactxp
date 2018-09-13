/**
 * Image.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Android-specific implementation of Image component.
 */
import * as RN from 'react-native';

import { Image as CommonImage } from '../native-common/Image';

export class Image extends CommonImage {
    // Overwrite the style for android since native Image has a fade in animation when an image loads
    // Setting the fadeDuration to 0, removes that animation
    protected _getAdditionalProps(): RN.ImagePropertiesAndroid {
        return { fadeDuration: 0 };
    }
}

export default Image;
