/**
 * ProgressIndicator.js
 * Copyright: Microsoft 2017
 *
 * Circular progress indicator that shows off the use of ImageSVG
 * ReactXP extension.
 */

import React from 'react';

import RX  from 'reactxp';
import {default as RXImageSvg, SvgPath as RXSvgPath} from 'reactxp-imagesvg';

export default class ProgressIndicator extends RX.Component {
    render() {
        const size = this.props.size;
        const progress = this.props.progress;
        const radius = size / 2;
        const deg = progress * 360;
        const radians = Math.PI * (deg - 90) / 180;
        const endX = radius + radius * Math.cos(radians);
        const endY = radius + radius * Math.sin(radians);
        const path = 'M' + radius + ',' + radius +
            ' L' + radius + ',0' +
            ' A' + radius + ',' + radius + ' 0 ' + (deg > 180 ? 1 : 0) + ',1 ' + endX + ',' + endY +
            'z';
        return (
            <RXImageSvg
                viewBox={ '0 0 ' + size + ' ' + size }
                style={ this.props.style }
                width={ size }
                height={ size }
            >
                <RXSvgPath
                    fillColor={ this.props.fillColor }
                    d={ path }
                />
            </RXImageSvg>
        );
    }
}
