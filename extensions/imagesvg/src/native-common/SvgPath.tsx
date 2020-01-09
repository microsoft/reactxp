/**
 * SvgPath.tsx
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of the cross-platform abstraction for
 * SVG Path elements.
 */

import * as React from 'react';
import * as RNSvg from 'react-native-svg';

import { SvgPathProps } from '../common/Types';

export class SvgPath extends React.Component<SvgPathProps, {}> {
    render() {
        return (
            <RNSvg.Path
                fill={ this.props.fillColor || '#fff' }
                strokeWidth={ this.props.strokeWidth }
                strokeOpacity={ this.props.strokeOpacity }
                fillOpacity={ this.props.fillOpacity }
                stroke={ this.props.strokeColor }
                d={ this.props.d }
            />
        );
    }
}

export default SvgPath;
