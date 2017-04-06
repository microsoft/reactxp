/**
* SvgPath.tsx
* Copyright: Microsoft 2017
*
* Web-specific implementation of the cross-platform abstraction for
* SVG Path (scalable vector graphics) images.
*/

import React = require('react');

import RX = require('../../common/Interfaces');

export class SvgPath extends RX.SvgPath<{}> {
    render() {
        return (
            <path
                fill={ this.props.fillColor }
                fillOpacity={ this.props.fillOpacity }
                stroke={ this.props.strokeColor }
                strokeOpacity={ this.props.strokeOpacity }
                strokeWidth={ this.props.strokeWidth }
                d={ this.props.d }
            />
        );
    }
}

export default SvgPath;
