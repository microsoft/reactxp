/**
 * ProgressIndicator.tsx
 * Copyright: Microsoft 2017
 *
 * Circular progress indicator that shows off the use of ImageSVG ReactXP extension.
 */

import * as React from 'react';
import * as RX from 'reactxp';
import RXImageSvg, { SvgPath as RXSvgPath, Types as SvgTypes } from 'reactxp-imagesvg';

export interface ProgressIndicatorProps extends RX.CommonStyledProps<SvgTypes.ImageSvgStyleRuleSet, ProgressIndicator>  {
    fillColor: string;
    progress: number;
    size: number;
}

export class ProgressIndicator extends RX.Component<ProgressIndicatorProps, RX.Stateless> {
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

    private _buildPath(): string {
        const { progress, size } = this.props;
        const radius = size / 2;
        const deg = progress  * 360;
        const radians = Math.PI * (deg - 90) / 180;
        const endX = radius + radius * Math.cos(radians);
        const endY = radius + radius * Math.sin(radians);

        return `M${ radius }, ${ radius }, L${ radius }, 0 A${ radius }, ${ radius } 0 ${ (deg > 180 ? 1 : 0) }, 1 ${ endX }, ${ endY }z`;
    }
}
