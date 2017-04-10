---
id: components/view
title: View
layout: docs
category: Components
permalink: docs/components/view.html
next: components/webview
---

This component is a generic container for other components.

## Props
In addition to the [common accessibility props](/reactxp/docs/accessibility.html), the following props are supported.

``` javascript
// Alternate text to display if the image cannot be loaded
// or by screen readers
accessibilityHidden: boolean = false;

// Hide the component from screen readers?
accessibilityHidden: boolean = false;

// Traits used to hint screen readers, etc.
accessibilityTraits: AccessibilityTrait | AccessibilityTrait[] = undefined;

// Region for accessibility mechanisms
accessibilityLiveRegion?: AccessibilityLiveRegion = undefined; // Android and web only

// Animation of children
//   - Every child must have a `key`.
//   - String refs aren't supported on children. Only callback refs are.
animateChildEnter: boolean = false;
animateChildLeave: boolean = false;
animateChildMove: boolean = false;

// Block touches for this component and all of its children
blockPointerEvents: boolean = false; // iOS and Android only

// Ignore clicks and other mouse events, allowing children or
// components behind to receive them
ignorePointerEvents: boolean = false; // web only

// Can the component accept keyboard focus?
focusable: boolean = false; // web only

// Mouse-specific Events
onDragEnter?: (e: DragEvent) => void = undefined;
onDragOver?: (e: DragEvent) => void = undefined;
onDragLeave?: (e: DragEvent) => void = undefined;
onDrop?: (e: DragEvent) => void = undefined;
onMouseEnter?: (e: MouseEvent) => void = undefined;
onMouseLeave?: (e: MouseEvent) => void = undefined;
onMouseMove?: (e: MouseEvent) => void = undefined;
onMouseOver?: (e: MouseEvent) => void = undefined;

// Mouse & Touch Events
onContextMenu?: (e: React.SyntheticEvent) => void;
onPress?: (e: SyntheticEvent) => void = undefined;

// Touch-specific Events
onLongPress?: (e: SyntheticEvent) => void = undefined;
onMoveShouldSetResponder?: (e: React.SyntheticEvent) => boolean = undefined;
onMoveShouldSetResponderCapture?: (e: React.SyntheticEvent) => boolean = undefined;
onResponderGrant?: (e: React.SyntheticEvent) => void = undefined;
onResponderReject?: (e: React.SyntheticEvent) => void = undefined;
onResponderRelease?: (e: React.SyntheticEvent) => void = undefined;
onResponderStart?: (e: React.TouchEvent) => void = undefined;
onResponderMove?: (e: React.TouchEvent) => void = undefined;
onResponderEnd?: (e: React.TouchEvent) => void = undefined;
onResponderTerminate?: (e: React.SyntheticEvent) => void = undefined;
onResponderTerminationRequest?: (e: React.SyntheticEvent) => boolean = undefined;
onStartShouldSetResponder?: (e: React.SyntheticEvent) => boolean = undefined;
onStartShouldSetResponderCapture?: (e: React.SyntheticEvent) => boolean = undefined;

// Other Events
onLayout?: (e: ViewOnLayoutEvent) => void = undefined;

// Rasterize contents using offscreen bitmap (perf optimization)
shouldRasterizeIOS: boolean = false; // iOS only

// Keyboard tab order
tabIndex: number = undefined;

// Text for a tooltip
title: string = undefined;

// See below for supported styles
style_ ViewStyleRuleSet | ViewStyleRuleSet[] = [];

// Should use hardware or software rendering?
viewLayerTypeAndroid: 'none' | 'software' | 'hardware'; // Android only property

// Visual touchfeedback properties
// Disable default opacity animation on touch on views that have onPress handlers
disableTouchOpacityAnimation?: boolean;  // iOS and Android only

// Opacity value the button should animate to, on touch on views that have onPress handlers.
activeOpacity?: number; // iOS and Android only

// Background color that will be visible on touch on views that have onPress handlers. 
underlayColor?: string; // ßiOS and Android only
```

## Styles
[**Flexbox Styles**](/reactxp/docs/styles.html#flexbox-style-attributes)

[**View Styles**](/reactxp/docs/styles.html#view-style-attributes)

[**Transform Styles**](/reactxp/docs/styles.html#transform-style-attributes)

## Methods
``` javascript
// Sets the accessibility focus to the component.
focus(): void;
```


