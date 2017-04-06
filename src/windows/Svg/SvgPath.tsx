/**
* SvgPath.tsx
* Copyright: Microsoft 2017
*
* RN-specific implementation of the cross-platform abstraction for
* SVG Path (scalable vector graphics) elements.
*/

import React = require('react');

import RX = require('../../common/Interfaces');

// TODO: #694092 Not implemented

export class SvgPath extends RX.SvgPath<{}> {
    render(): any {
        return null;
    }
}

export default SvgPath;
