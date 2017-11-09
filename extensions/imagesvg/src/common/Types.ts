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

export interface SvgCommonProps {
    key?: string | number;
    strokeColor?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    fillColor?: string;
    fillOpacity?: number;
}

export interface ImageSvgProps extends SvgCommonProps, RXTypes.CommonStyledProps<ImageSvgStyleRuleSet> {
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
