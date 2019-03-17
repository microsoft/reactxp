/*
 * Types.ts
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Type definitions to support the plugin.
 */

import { Types as RXTypes } from 'reactxp';
import * as React from 'react';

export interface ImageSvgStyle extends RXTypes.ViewStyle {
}

export declare type ImageSvgStyleRuleSet = RXTypes.StyleRuleSet<ImageSvgStyle>;

export interface SvgCommonProps {
    key?: string | number;
    strokeColor?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    fillColor?: string;
    fillOpacity?: number;
}

export interface ImageSvgProps extends SvgCommonProps, RXTypes.CommonStyledProps<ImageSvgStyleRuleSet, ImageSvg> {
    children?: RXTypes.ReactNode;
    height: number;
    width: number;
    accessibilityLabel?: string;
    title?: string;
    viewBox?: string;
    preserveAspectRatio?: string;
    webShadow?: string;
}

export interface SvgPathProps extends SvgCommonProps {
    d?: string;
}

export interface SvgRectProps extends SvgCommonProps {
    width: number;
    height: number;
    x: number;
    y: number;
}

export class ImageSvg extends React.Component<ImageSvgProps, RXTypes.Stateless> {}
