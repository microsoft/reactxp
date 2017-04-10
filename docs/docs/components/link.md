---
id: components/link
title: Link
layout: docs
category: Components
permalink: docs/components/link.html
next: components/navigator
---

This component displays a hyperlink. On the web, it translates to an &lt;a&gt; tag.

## Props
``` javascript
// For non-zero values, truncates with ellipsis if necessary
numberOfLines: number = 0;

// Called when the mouse cursor enters or leaves the view bounds
onHoverStart: (e: SyntheticEvent) => void = undefined;
onHoverEnd: (e: SyntheticEvent) => void = undefined;

// Event called when the touch or mouse button is released 
// within the bounds of the view and the press has not been canceled
onPress: (e: SyntheticEvent) => void = undefined;

// Can the link be included in a text selection?
selectable: boolean = false;

// Text for a tooltip
title: string = undefined;

// URL to follow for hyperlink
url: string = undefined;

// See below for supported styles
style: LinkStyleRuleSet | LinkStyleRuleSet[] = [];
```

## Styles

[**Flexbox Styles**](/reactxp/docs/styles.html#flexbox-style-attributes)

[**View Styles**](/reactxp/docs/styles.html#view-style-attributes)

[**Transform Styles**](/reactxp/docs/styles.html#transform-style-attributes)

## Methods
No methods

