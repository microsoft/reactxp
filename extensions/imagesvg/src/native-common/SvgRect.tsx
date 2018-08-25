/**
* SvgPath.tsx
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform abstraction for
* SVG Rect elements.
*/

import React = require('react');
import RNSvg = require('react-native-svg');

import SvgTypes = require('../common/Types');

export class SvgRect extends React.Component<SvgTypes.SvgRectProps, {}> {
    render() {
        return (
            <RNSvg.Rect
                fill={ this.props.fillColor || '#fff' }
                strokeWidth={ this.props.strokeWidth }
                strokeOpacity={ this.props.strokeOpacity }
                fillOpacity={ this.props.fillOpacity }
                stroke={ this.props.strokeColor}
                width={ this.props.width }
                height={ this.props.height }
                x={ this.props.x }
                y={ this.props.y }
            />
        );
    }
}

export default SvgRect;
