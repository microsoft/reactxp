/*
* Interfaces.ts
* Copyright: Microsoft 2017
*
* Interface exposed by ImageSvg component.
*/

import React = require('react');

import Types = require('./Types');

export abstract class ImageSvg<S> extends React.Component<Types.ImageSvgProps, S> {
}

export abstract class SvgPath<S> extends React.Component<Types.SvgPathProps, S> {
}

export interface PluginInterface {
    Types: typeof Types;
    
    default: typeof ImageSvg;
    SvgPath: typeof SvgPath;
}

