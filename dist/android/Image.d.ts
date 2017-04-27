/**
* Image.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific implementation of Image component.
*/
import RN = require('react-native');
import { Image as CommonImage } from '../native-common/Image';
export declare class Image extends CommonImage {
    protected _getAdditionalProps(): RN.ImageProps;
}
export default Image;
