/**
* SvgPath.tsx
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform abstraction for
* SVG Path elements.
*/

import React = require('react');
import RNSvg = require('react-native-svg');

import SvgTypes = require('../common/Types');

export class SvgPath extends React.Component<SvgTypes.SvgPathProps, {}> {
    render() {
        return (
            <RNSvg.Path
                d={ this.props.d }

                fill={ this.props.fillColor || '#fff' }
                fillOpacity={ this.props.fillOpacity }
                fillRule={ this.props.fillRule }

                stroke={ this.props.strokeColor }
                strokeWidth={ this.props.strokeWidth }
                strokeOpacity={ this.props.strokeOpacity }
                // strokeDasharray={ this.props.strokeDasharray }
                strokeDashoffset={ this.props.strokeDashoffset }
                strokeLinecap={ this.props.strokeLinecap }
                strokeLinejoin={ this.props.strokeLinejoin } 
                strokeMiterlimit={ this.props.strokeMiterlimit }
            />
        );
    }
}

export default SvgPath;
