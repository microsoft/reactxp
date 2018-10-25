/**
 * ProgressIndicator.js
 * Copyright: Microsoft 2017
 *
 * Circular progress indicator that shows off the use of ImageSVG
 * ReactXP extension.
 */

import * as RX from 'reactxp';
import React from 'react';
import RXImageSvg, { SvgPath as RXSvgPath } from 'reactxp-imagesvg';

export class ProgressIndicator extends RX.Component {
    render() {
        const size = this.props.size;
        const path = this._buildPath();

        return (
            <RXImageSvg
                viewBox={ '0 0 ' + size + ' ' + size }
                height={ size }
                width={ size }
                style={ this.props.style }
            >
                <RXSvgPath fillColor={ this.props.fillColor } d={ path } />
            </RXImageSvg>
        );
    }

    _buildPath(){
        const { progress, size } = this.props;
        const radius = size / 2;
        const deg = progress  * 360;
        const radians = Math.PI * (deg - 90) / 180;
        const endX = radius + radius * Math.cos(radians);
        const endY = radius + radius * Math.sin(radians);

        return `M${ radius }, ${ radius }, L${ radius }, 0 A${ radius }, ${ radius } 0 ${ (deg > 180 ? 1 : 0) }, 1 ${ endX }, ${ endY }z`;
    }
}
