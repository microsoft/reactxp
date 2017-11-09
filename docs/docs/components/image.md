---
id: components/image
title: Image
layout: docs
category: Components
permalink: docs/components/image.html
next: components/link
---

This component displays an image, which can come from a local source or from the network. It supports JPEG, GIF and PNG formats.

If child elements are specified, the image acts as a background, and the children are rendered on top of it.

## Props
``` javascript
// Alternate text to display if the image cannot be loaded
// or by screen readers
accessibilityLabel: string = undefined;

// HTTP headers to include when fetching the URL.
headers: { [headerName: string]: string } = undefined;

// Called when an error occurs that prevents the image from loading
onError: (e: SyntheticEvent) => void;

// Called when the image successfully loads
onLoad: (e: SyntheticEvent) => void;

// Android-specific resize property
resizeMethod: 'auto' | 'resize' | 'scale' = 'auto'; // Android only

// Determines how to resize the image if its natural size
// does not match the size of the container
resizeMode: 'stretch' | 'contain' | 'cover' | 'auto' | 'repeat' = 'stretch';

// Rasterize contents using offscreen bitmap (perf optimization)
shouldRasterizeIOS: boolean = false; // iOS only

// URL to image
source: string = undefined;

// See below for supported styles
style: ImageStyleRuleSet | ImageStyleRuleSet[] = [];

// Tooltip for image
title: string = undefined;
```

## Styles
[**Flexbox Styles**](/reactxp/docs/styles.html#flexbox-style-attributes)

[**View Styles**](/reactxp/docs/styles.html#view-style-attributes)

[**Transform Styles**](/reactxp/docs/styles.html#transform-style-attributes)

## Methods
``` javascript
// Returns the native width and height of the image. Can be called only after
// the onLoad has been called and only while the component is mounted.
getNativeHeight(): number;
getNativeWidth(): number;
```


