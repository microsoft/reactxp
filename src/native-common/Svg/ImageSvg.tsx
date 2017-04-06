/**
* ImageSvg.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform abstraction for
* SVG (scalable vector graphics) images.
*/

import assert = require('assert');
import React = require('react');
import ArtSvg = require('react-native-art-svg');

import RX = require('../../common/Interfaces');

export class ImageSvg extends RX.ImageSvg<{}> {
    render() {

        assert.ok(this.props.width && this.props.height, 'The width and height on imagesvg are mandatory.');

        if (this.props.width > 0 && this.props.height > 0) {
            return (
                <ArtSvg.Svg
                    width={ this.props.width.toString() }
                    height={ this.props.height.toString() }
                    style={ this.props.style }
                    opacity={ this.props.strokeOpacity }
                    preserveAspectRatio={ this.props.preserveAspectRatio }
                    viewbox={ this.props.viewBox }
                >
                    { this.props.children }
                </ArtSvg.Svg>
            );
        } else {
            return null;
        }
    }
}

export default ImageSvg;
