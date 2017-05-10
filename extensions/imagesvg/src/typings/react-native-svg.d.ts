/**
* react-native-svg.d.ts
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Type definition file for the React Native SVG module.
* https://github.com/react-native-community/react-native-svg
*/

declare module 'react-native-svg' {

    import React = require('react');
    import RN = require('react-native');

    type ArrayType = [string] | [number];

    interface SvgProps extends RN.ComponentPropsBase {
        height?: string,
        width?: string,
        viewBox?: string,
        opacity?: number,
        preserveAspectRatio?: string;
        style?: RN.StyleRuleSet;
    }

    interface BaseProps extends RN.ComponentPropsBase {
        fill?: string, //The fill prop refers to the color inside the shape.
        fillOpacity?: number, // This prop specifies the opacity of the color or the content the current object is filled with.
        stroke?: string, //The stroke prop controls how the outline of a shape appears.
        strokeWidth?: number, //The strokeWidth prop specifies the width of the outline on the current object.
        strokeOpacity?: number, //The strokeOpacity prop specifies the opacity of the outline on the current object.
        x?: number,
        y?: number,
        strokeLinecap?: string, //oneOf(['butt', 'square', 'round']),
        strokeCap?: string, //.oneOf(['butt', 'square', 'round']),
        strokeLinejoin?: string, //oneOf(['miter', 'bevel', 'round']),
        strokeJoin?: string, //.oneOf(['miter', 'bevel', 'round']),
        strokeDasharray?: ArrayType,
        scale?: number, //Scale value on the current object.
        rotate?: number, //Rotation degree value on the current object.
        originX?: number, //Transform originX coordinates for the current object.
        originY?: number  //Transform originY coordinates for the current object.
    }

    interface TransformProps extends BaseProps {
        scaleX: number,
        scaleY: number,
        transform: number,
    }

    interface PathProps extends BaseProps {
        d: string
    }

    interface RectProps extends BaseProps {
        width?: number,
        height?: number
    }

    interface TextProps extends BaseProps {
        textAnchor: ('start' | 'middle' | 'end'),
        fontFamily: string,
        fontSize: number,
    }

    export class Svg extends React.Component<SvgProps, {}> { }
    export class Path extends React.Component<PathProps, {}> { }
    export class Rect extends React.Component<RectProps, {}> { }
    export class Text extends React.Component<TextProps, {}> { }
}
