/*
 * Interfaces.ts
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Interface exposed by ImageSvg component.
 */

import * as React from 'react';

import * as Types from './Types';

export abstract class ImageSvg extends React.Component<Types.ImageSvgProps, any> {
}

export abstract class SvgPath extends React.Component<Types.SvgPathProps, any> {
}

export abstract class SvgRect extends React.Component<Types.SvgRectProps, any> {
}

export interface PluginInterface {
    Types: typeof Types;

    default: typeof ImageSvg;
    SvgPath: typeof SvgPath;
    SvgRect: typeof SvgRect;
}
