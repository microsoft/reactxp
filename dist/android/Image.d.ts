/**
* Image.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Android-specific implementation of Image component.
*/
import { Image as CommonImage } from '../native-common/Image';
import Types = require('../common/Types');
export declare class Image extends CommonImage {
    protected getStyles(): Types.ImageStyleRuleSet;
}
export default Image;
