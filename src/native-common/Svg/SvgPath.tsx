/**
* SvgPath.tsx
* Copyright: Microsoft 2017
*
* RN-specific implementation of the cross-platform abstraction for
* SVG Path (scalable vector graphics) elements.
*/

import React = require('react');
import ArtSvg = require('react-native-art-svg');

import RX = require('../../common/Interfaces');

export class SvgPath extends RX.SvgPath<{}> {
    render() {
        return (
                <ArtSvg.Path
                    key = { this.props.key }
                    d={ this.props.d }
                    fill={ this.props.fillColor || '#fff' }
                    strokeWidth={ this.props.strokeWidth }
                    strokeOpacity={ this.props.strokeOpacity }
                    fillOpacity={ this.props.fillOpacity }
                    stroke={ this.props.strokeColor} />
        );
    }
}

export default SvgPath;
