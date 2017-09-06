---
id: components/link
title: Link
layout: docs
category: Components
permalink: docs/components/link.html
next: components/picker
---

This component displays a hyperlink. On the web, it translates to an &lt;a&gt; tag.

## Props
``` javascript
// Should fonts be scaled according to system setting?
allowFontScaling: boolean = true; // Android and iOS only

// Should the scale multiplier be capped when allowFontScaling is set to true?
// Possible values include the following:
// null/undefined (default) - inheret from parent/global default
// 0 - no max
// >= 1 - sets the maxContentSizeMultiplier of this node to this value
// Note: Older versions of React Native don’t support this interface. 
maxContentSizeMultiplier: number = null; // Android and iOS only

// For non-zero values, truncates with ellipsis if necessary
numberOfLines: number = 0;

// Called when the mouse cursor enters or leaves the view bounds
onHoverStart: (e: SyntheticEvent) => void = undefined;
onHoverEnd: (e: SyntheticEvent) => void = undefined;

// Event called when the touch or mouse button is released 
// within the bounds of the view and the press has not been canceled
onPress: (e: SyntheticEvent, url: string) => void = undefined;

// Event called when a long touch or mouse (> 1000ms) button is released 
// within the bounds of the view and the press has not been canceled
onLongPress: (e: SyntheticEvent, url:string) => void = undefined;

// Can the link be included in a text selection?
selectable: boolean = false;

// Text for a tooltip
title: string = undefined;

// URL to follow for hyperlink
url: string;

// See below for supported styles
style: LinkStyleRuleSet | LinkStyleRuleSet[] = [];
```

## Styles

[**Flexbox Styles**](/reactxp/docs/styles.html#flexbox-style-attributes)

[**View Styles**](/reactxp/docs/styles.html#view-style-attributes)

[**Transform Styles**](/reactxp/docs/styles.html#transform-style-attributes)

## Methods
No methods

