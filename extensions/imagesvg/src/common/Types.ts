/*
* Types.ts
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Type definitions to support the plugin.
*/

import { Types as RXTypes } from 'reactxp';

export interface ImageSvgStyle extends RXTypes.ViewStyle {
}
export declare type ImageSvgStyleRuleSet = RXTypes.StyleRuleSet<ImageSvgStyle>;

type NumberProp = string | number;

export type FillRule = 'evenodd' | 'nonzero';
export type Units = 'userSpaceOnUse' | 'objectBoundingBox';

export type Linecap = 'butt' | 'square' | 'round';
export type Linejoin = 'miter' | 'bevel' | 'round';

export interface FillProps {
    fillColor?: string; // Different from react-native-svg and web impl -- they just use "fill"
    fillOpacity?: NumberProp;
    fillRule?: FillRule;
}
  
export interface StrokeProps {
    strokeColor?: string;   // Different from react-native-svg and web impl -- they just use "stroke"
    strokeWidth?: NumberProp;
    strokeOpacity?: NumberProp;
    // These typings are incompatible between web and react-native-svg.  Requires further understanding...
    // strokeDasharray?: ReadonlyArray<number> | string,
    strokeDashoffset?: NumberProp;
    strokeLinecap?: Linecap;
    strokeLinejoin?: Linejoin;
    strokeMiterlimit?: NumberProp;
}

export interface ImageSvgProps extends RXTypes.CommonStyledProps<ImageSvgStyleRuleSet> {
    // Wacky subset of available props that only does anything on web..?
    strokeColor?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    fillColor?: string;
    fillOpacity?: number;

    children?: RXTypes.ReactNode;
    height: number;
    width: number;
    accessibilityLabel?: string;
    title?: string;
    viewBox?: string;
    preserveAspectRatio?: string;
    webShadow?: string;
}

interface CommonPathProps extends FillProps, StrokeProps {}

export interface SvgPathProps extends CommonPathProps {
    d?: string;
}

export interface SvgRectProps extends CommonPathProps {
    x?: NumberProp;
    y?: NumberProp;
    width?: NumberProp;
    height?: NumberProp;
    rx?: NumberProp;
    ry?: NumberProp;
}
