/**
 * ImageSvg.tsx
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform abstraction for
 * SVG (scalable vector graphics) images.
 */

import * as React from 'react';
import * as RNSvg from 'react-native-svg';

import assert from '../common/assert';
import { ImageSvgProps } from '../common/Types';

export class ImageSvg extends React.Component<ImageSvgProps, {}> {
    render() {
        assert(this.props.width && this.props.height, 'The width and height on imagesvg are mandatory.');

        if (this.props.width > 0 && this.props.height > 0) {
            return (
                <RNSvg.Svg
                    width={ this.props.width.toString() }
                    height={ this.props.height.toString() }
                    style={ this.props.style }
                    opacity={ this.props.strokeOpacity }
                    preserveAspectRatio={ this.props.preserveAspectRatio }
                    viewBox={ this.props.viewBox }
                >
                    { this.props.children }
                </RNSvg.Svg>
            );
        }

        return null;
    }
}

export default ImageSvg;
