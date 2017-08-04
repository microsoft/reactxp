/*
* SvgPath.tsx
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform abstraction for
* SVG Path (scalable vector graphics) images.
*/

import React = require('react');

import SvgInterfaces = require('../common/Interfaces');
import SvgTypes = require('../common/Types');

export class SvgPath extends React.Component<SvgTypes.SvgPathProps, {}> {
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
