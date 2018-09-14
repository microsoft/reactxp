/*
 * SvgRect.tsx
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform abstraction for
 * SVG Rect elements.
 */

import * as React from 'react';

import { SvgRectProps } from '../common/Types';

export class SvgRect extends React.Component<SvgRectProps, {}> {
    render() {
        return (
            <rect
                fill={ this.props.fillColor }
                fillOpacity={ this.props.fillOpacity }
                stroke={ this.props.strokeColor }
                strokeOpacity={ this.props.strokeOpacity }
                strokeWidth={ this.props.strokeWidth }
                width={ this.props.width }
                height={ this.props.height }
                x={ this.props.x }
                y={ this.props.y }
            />
        );
    }
}

export default SvgRect;
