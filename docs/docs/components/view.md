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
// Alternate text for screen readers.
// If not defined, title prop is used.
accessibilityLabel: string = undefined;

// Hide the component from screen readers?
accessibilityHidden: boolean = false;

// Traits used to hint screen readers, etc.
accessibilityTraits: AccessibilityTrait | AccessibilityTrait[] = undefined;

// Region for accessibility mechanisms
accessibilityLiveRegion: AccessibilityLiveRegion = undefined; // Android and web only

// Expose the element and/or its children as accessible to Screen readers
importantForAccessibility?: ImportantForAccessibility = Auto;

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

// When the keyboard navigation is happening, restrict the focusable
// elements within this view. Useful for popups and modals, you
// might want to prevent the focus from going outside of the popup or
// modal. The views with restrictFocusWithin are stacked and the last
// mounted view is a winner. This means if you, for example, have
// restricted the focus within some modal, and you have a popup (which
// also desires for a restricted focus) inside this modal, the popup
// will get the restriction, but when dismissed, the restriction will
// be restored for the modal. See also the companion method
// setFocusRestricted() below.
// WARNING: For the sake of performance, this property is readonly and
// changing it during the View life cycle will produce an error.
restrictFocusWithin: boolean = false; // web only

// When the keyboard navigation is happening, do not focus on this view
// and on all focusable elements inside this view. See also the companion
// method setFocusLimited() below.
// Useful for the list items, allows to skip the consecutive focusing on
// one list item (and item's internal focusable elements) after another
// using the Tab key and implement the switching between the items using
// the arrow keys (or using some other behaviour).
// WARNING: For the sake of performance, this property is readonly and
// changing it during the View life cycle will produce an error.
limitFocusWithin: boolean = false; // web only

// Additional invisible DOM elements will be added inside the view
// to track the size changes that are performed behind our back by
// the browser's layout engine faster (ViewBase checks for the layout
// updates once a second and sometimes it's not fast enough)
importantForLayout: boolean = false; // web only

// Mouse-specific Events
onDragEnter: (e: DragEvent) => void = undefined;
onDragOver: (e: DragEvent) => void = undefined;
onDragLeave: (e: DragEvent) => void = undefined;
onDrop: (e: DragEvent) => void = undefined;
onMouseEnter: (e: MouseEvent) => void = undefined;
onMouseLeave: (e: MouseEvent) => void = undefined;
onMouseMove: (e: MouseEvent) => void = undefined;
onMouseOver: (e: MouseEvent) => void = undefined;

// Mouse & Touch Events
onContextMenu: (e: React.SyntheticEvent) => void;
onPress: (e: SyntheticEvent) => void = undefined;

// Touch-specific Events
onLongPress: (e: SyntheticEvent) => void = undefined;
onMoveShouldSetResponder: (e: React.SyntheticEvent) => boolean = undefined;
onMoveShouldSetResponderCapture: (e: React.SyntheticEvent) => boolean = undefined;
onResponderGrant: (e: React.SyntheticEvent) => void = undefined;
onResponderReject: (e: React.SyntheticEvent) => void = undefined;
onResponderRelease: (e: React.SyntheticEvent) => void = undefined;
onResponderStart: (e: React.TouchEvent) => void = undefined;
onResponderMove: (e: React.TouchEvent) => void = undefined;
onResponderEnd: (e: React.TouchEvent) => void = undefined;
onResponderTerminate: (e: React.SyntheticEvent) => void = undefined;
onResponderTerminationRequest: (e: React.SyntheticEvent) => boolean = undefined;
onStartShouldSetResponder: (e: React.SyntheticEvent) => boolean = undefined;
onStartShouldSetResponderCapture: (e: React.SyntheticEvent) => boolean = undefined;

// Other Events
onLayout: (e: ViewOnLayoutEvent) => void = undefined;

// Rasterize contents using offscreen bitmap (perf optimization)
shouldRasterizeIOS: boolean = false; // iOS only

// Keyboard tab order
tabIndex: number = undefined;

// Text for a tooltip
title: string = undefined;

// See below for supported styles
style: ViewStyleRuleSet | ViewStyleRuleSet[] = [];

// Should use hardware or software rendering?
viewLayerTypeAndroid: 'none' | 'software' | 'hardware'; // Android only property

// Visual touchfeedback properties
// Disable default opacity animation on touch on views that have onPress handlers
disableTouchOpacityAnimation: boolean = false;  // iOS and Android only

// Opacity value the button should animate to, on touch on views that have onPress handlers.
activeOpacity: number = undefined; // iOS and Android only

// Background color that will be visible on touch on views that have onPress handlers.
underlayColor: string = undefined; // ßiOS and Android only
```

## Styles
[**Flexbox Styles**](/reactxp/docs/styles.html#flexbox-style-attributes)

[**View Styles**](/reactxp/docs/styles.html#view-style-attributes)

[**Transform Styles**](/reactxp/docs/styles.html#transform-style-attributes)

## Methods
``` javascript
// Sets the accessibility focus to the component.
focus(): void;

// The focus does not go outside the view with restrictFocusWithin by default,
// setFocusRestricted() allows to turn this restricton off and back on.
setFocusRestricted(restricted: boolean): void; // web only


// The focus does not go inside the view with limitFocusWithin by default,
// setFocusLimited() allows to turn this limitation off and back on.
setFocusLimited(limited: boolean): void; // web only
```
