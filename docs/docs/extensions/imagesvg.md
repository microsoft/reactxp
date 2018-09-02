---
id: extensions/imagesvg
title: ImageSvg
layout: docs
category: Extensions
permalink: docs/extensions/imagesvg.html
next: extensions/navigator
---

This component displays a vector image (SVG format). Props control the fill color, stroke color and stroke width.

The path(s) are specified using the standard SVG string format. Paths must be specified in a nested SvgPath component instance. Multiple SvgPath children can be specified, each with different stroke and fill parameters.  SvgRect children
are also supported at this time, with the limited props available in react-native-svg.

To install: ```npm install reactxp-imagesvg``` or  ```yarn add reactxp-imagesvg```

## ImageSvg Props
``` javascript
// See below for supported styles
style: RX.ImageSvgStyleRuleSet | RX.ImageSvgStyleRuleSet[] = [];

// Color and opacity of fill; default values are provided by SVG
fillColor: color;
fillOpacity: number;

// Preserve aspect ratio or stretch?
preserveAspectRatio: boolean = true;

// Color, width and opacity of stroke; default values are provided by SVG
strokeColor: color;
strokeWidth: number;
strokeOpacity: number;

// Tooltip for image
title: string = undefined;

// Bounding box
viewBox: string = undefined;

// Shadow
webShadow: boolean = false; // web-specific
```

## CommonPathProps Props
These props apply to all of the sub-SVG-element types below:

``` javascript
// Color and opacity of fill; default values are provided by SVG
fillColor: string;      // Same as "fill" in react-native-svg and web
fillOpacity: string|number;
fillRule: 'evenodd' | 'nonzero';

// Color, width and opacity of stroke; default values are provided by SVG
strokeColor: string;   // Same as "stroke" in react-native-svg and web
strokeWidth: string|number;
strokeOpacity: string|number;
strokeDashoffset: string|number;
strokeLinecap: 'butt' | 'square' | 'round';
strokeLinejoin: 'miter' | 'bevel' | 'round';
strokeMiterlimit: string|number;
```

## SvgPath Props
``` javascript
// Path definition string
d: string = undefined;
```

## SvgRect Props
``` javascript
// Position and dimension information for the rect
x: number;
y: number;
width: number;
height: number;
rx: number;
ry: number;
```

## Styles

[**Flexbox Styles**](/reactxp/docs/styles.html#flexbox-style-attributes)

[**View Styles**](/reactxp/docs/styles.html#view-style-attributes)

[**Transform Styles**](/reactxp/docs/styles.html#transform-style-attributes)

## Methods
No methods

## Sample Usage
``` javascript
import { default as RXImageSvg, SvgPath as RXSvgPath, Types as SvgTypes }
    from 'reactxp-imagesvg';

return (
    <RXImageSvg height={ 20 } width={ 20 }>
        <RXSvgPath
            fillColor={ 'orange' }
            d={ 'M 0 0 h 20 v 20 z' }
        />
        <RXSvgRect
            fillColor={ 'blue' }
            x={ 10 }
            y={ 20 }
            width={ 30 }
            height={ 40 }
        />
    </RXImageSvg>
);
```


