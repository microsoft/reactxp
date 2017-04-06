/**
* ImageSvg.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform abstraction for
* SVG (scalable vector graphics) images.
*/

import React = require('react');

import RX = require('../../common/Interfaces');

// TODO: #694092 Not implemented

export class ImageSvg extends RX.ImageSvg<{}> {
    render(): any {
        return null;
    }
}

export default ImageSvg;
