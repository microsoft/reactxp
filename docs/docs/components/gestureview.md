---
id: components/gestureview
title: GestureView
layout: docs
category: Components
permalink: docs/components/gestureview.html
next: components/image
---

This component provides support for common touch gestures -- tapping, double-tapping, panning, and pinching. It also handles common mouse-based gestures including double clicking and scroll wheel input.

Information about pending gestures is returned through event handlers. A caller can specify which gestures they are interested in by specifying those event handlers. For example, if you are interested in double taps and horizontal pans, provide an onDoubleTap and onPanHorizontal handler.

## Props
``` javascript
// Gestures and attributes that apply only to touch inputs
onPinchZoom: (gestureState: MultiTouchGestureState) => void = undefined;
onRotate: (gestureState: MultiTouchGestureState) => void = undefined;

// Gestures and attributes that apply only to mouse inputs
onScrollWheel: (gestureState: ScrollWheelGestureState) => void = undefined;
mouseOverCursor: GestureMouseCursor = undefined;

// Gestures and attributes that apply to either touch or mouse inputs
onPan: (gestureState: PanGestureState) => void = undefined;
onPanVertical: (gestureState: PanGestureState) => void = undefined;
onPanHorizontal: (gestureState: PanGestureState) => void = undefined;
onTap: (gestureState: TapGestureState) => void = undefined;
onDoubleTap: (gestureState: TapGestureState) => void = undefined;

// We can set vertical or horizontal as preferred
preferredPan: PreferredPanGesture = undefined; // Horizontal or vertical

// How many pixels (in either horizontal or vertical direction) until
// pan is recognized? Default is 10. Can be any value > 0.
panPixelThreshold: number = undefined;

// Something else wants to become responder. Should this view
// release the responder? Setting true allows release.
releaseOnRequest: boolean = false;

// Alternate text for screen readers.
accessibilityLabel: string = undefined;

// Traits used to hint screen readers, etc.
accessibilityTraits: AccessibilityTrait | AccessibilityTrait[] = undefined;

// Expose the element and/or its children as accessible to Screen readers
importantForAccessibility?: ImportantForAccessibility = ImportantForAccessibility.Yes;
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

