---
id: extensions/imagesvg
title: ImageSvg
layout: docs
category: Extensions
permalink: docs/extensions/imagesvg.html
next: extensions/navigator
---

This component displays a vector image (SVG format), which can come from a local source or from the network. Props control the fill color, stroke color and stroke width.

The path(s) are specified using the standard SVG string format. Paths must be specified in a nested SvgPath component instance. Multiple SvgPath children can be specified, each with different stroke and fill parameters.

To install: ```npm install reactxp-imagesvg```

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

## SvgPath Props
``` javascript
// Path definition string
d: string = undefined;

// Color and opacity of fill; default values are provided by SVG
fillColor: color;
fillOpacity: number;

// Color, width and opacity of stroke; default values are provided by SVG
strokeColor: color;
strokeWidth: number;
strokeOpacity: number;
```

## Styles

[**Flexbox Styles**](docs/styles.html#flexbox-style-attributes)

[**View Styles**](docs/styles.html#view-style-attributes)

[**Transform Styles**](docs/styles.html#transform-style-attributes)

## Methods
No methods

## Sample Usage
``` javascript
return (
    <RX.ImageSvg
        height={ 20 }
        width={ 20 }
        style={ _styles.container }
    >
        <RX.SvgPath
            fillColor={ 'orange' }
            d={ 'M 0 0 h 20 v 20 z' }
        />
    </RX.ImageSvg>
);
```


