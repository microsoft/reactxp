/*
* Interfaces.ts
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Interface exposed by ImageSvg component.
*/

import React = require('react');

import Types = require('./Types');

export abstract class ImageSvg extends React.Component<Types.ImageSvgProps, any> {
}

export abstract class SvgPath extends React.Component<Types.SvgPathProps, any> {
}

export interface PluginInterface {
    Types: typeof Types;
    
    default: typeof ImageSvg;
    SvgPath: typeof SvgPath;
}
