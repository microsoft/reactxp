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

// Traits used to hint screen readers, etc.
accessibilityTraits: AccessibilityTrait | AccessibilityTrait[] = undefined;

// Region for accessibility mechanisms
accessibilityLiveRegion: AccessibilityLiveRegion =
    undefined; // Android and web only

// It is hard or impossible to tell by a reference to an instance of a component
// from where this component has been instantiated. You can assign this property
// and check instance.props.accessibilityId. For example accessibilityId is used
// in View's FocusArbitrator callback.
accessibilityId: string = undefined;

// Opacity value the button should animate to, on touch on views that
// have onPress handlers
activeOpacity: number = undefined; // iOS and Android only

// Animation of children
//   - Every child must have a `key`.
//   - String refs aren't supported on children. Only callback refs are.
animateChildEnter: boolean = false;
animateChildLeave: boolean = false;
animateChildMove: boolean = false;

// Id of an element that describes the view for screenreader.
ariaLabelledBy?: string = undefined; // Web only

// A custom role description to be read by the screen readers.
ariaRoleDescription?: string = undefined; // Web only

// Block touches for this component and all of its children
blockPointerEvents: boolean = false; // iOS and Android only

// Disable default opacity animation on touch on views that have
// onPress handlers
disableTouchOpacityAnimation: boolean = false;  // iOS and Android only

// Specifies a unique id for an HTML element
// NOTE: This property may be going away in future versions.
id: string = undefined; // Web only

// Ignore clicks and other mouse events, allowing children or
// components behind to receive them
ignorePointerEvents: boolean = false; // web only

// Expose the element and/or its children as accessible to Screen readers
importantForAccessibility?: ImportantForAccessibility = Auto;

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
restrictFocusWithin: boolean = false;

// When the keyboard navigation is happening, do not focus on this view
// and on all focusable elements inside this view. See also the companion
// method setFocusLimited() below.
// Useful for the list items, allows to skip the consecutive focusing on
// one list item (and item's internal focusable elements) after another
// using the Tab key and implement the switching between the items using
// the arrow keys (or using some other behaviour).
// When limitFocusWithin=LimitFocusType.Limited, the View and the focusable
// components inside the View get both tabIndex=-1 and aria-hidden=true.
// When limitFocusWithin=LimitFocusType.Accessible, the View and the focusable
// components inside the View get only tabIndex=-1.
// WARNING: For the sake of performance, this property is readonly and
// changing it during the View life cycle will produce an error.
limitFocusWithin: LimitFocusType = LimitFocusType.Unlimited;

// Should be focused when the component is mounted, see also arbitrateFocus
// property below.
// WARNING: autoFocus=true means that this View's requestFocus() method will be
// called, however calling requestFocus() might have no effect (for example on web
// View is focusable only when tabIndex is specified), the application has to handle
// this either while setting this property or in the View's FocusArbitrator callback.
autoFocus: boolean = false;

// When multiple components with autoFocus=true inside this View are mounting at
// the same time, and/or multiple components inside this view have received focus()
// call during the same render cycle, this callback will be called so that it's
// possible for the application to decide which one should actually be focused.
arbitrateFocus: FocusArbitrator = undefined;

// Additional invisible DOM elements will be added inside the view
// to track the size changes that are performed behind our back by
// the browser's layout engine faster (ViewBase checks for the layout
// updates once a second and sometimes it's not fast enough)
importantForLayout: boolean = false; // web only

// Mouse-specific Events
// For drag specific events, if onDragStart is present, the view is draggable.
// onDragStart/onDrag/onDragEnd are source specific events
// onDragEnter/onDragOver/onDragLeave/onDrop are destination specific events
onDragStart: (e: DragEvent) => void = undefined;
onDrag: (e: DragEvent) => void = undefined;
onDragEnd: (e: DragEvent) => void = undefined;
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

// Focus Events
onFocus: (e: FocusEvent) => void = undefined;
onBlur: (e: FocusEvent) => void = undefined;

// Keyboard Events
onKeyPress: (e: KeyboardEvent) => void = undefined;

// Touch-specific Events
onLongPress: (e: SyntheticEvent) => void = undefined;
onMoveShouldSetResponder: (e: React.SyntheticEvent) => boolean =
    undefined;
onMoveShouldSetResponderCapture: (e: React.SyntheticEvent) => boolean =
    undefined;
onResponderGrant: (e: React.SyntheticEvent) => void = undefined;
onResponderReject: (e: React.SyntheticEvent) => void = undefined;
onResponderRelease: (e: React.SyntheticEvent) => void = undefined;
onResponderStart: (e: React.TouchEvent) => void = undefined;
onResponderMove: (e: React.TouchEvent) => void = undefined;
onResponderEnd: (e: React.TouchEvent) => void = undefined;
onResponderTerminate: (e: React.SyntheticEvent) => void = undefined;
onResponderTerminationRequest: (e: React.SyntheticEvent) => boolean =
    undefined;
onStartShouldSetResponder: (e: React.SyntheticEvent) => boolean =
    undefined;
onStartShouldSetResponderCapture: (e: React.SyntheticEvent) => boolean =
    undefined;

// Other Events
onLayout: (e: ViewOnLayoutEvent) => void = undefined;

// Rasterize contents using offscreen bitmap (perf optimization)
shouldRasterizeIOS: boolean = false; // iOS only

// Keyboard tab order
tabIndex: number = undefined;

// ID that can be used to identify the instantiated element for testing purposes.
testId: string = undefined;

// Text for a tooltip
title: string = undefined;

// See below for supported styles
style: ViewStyleRuleSet | ViewStyleRuleSet[] = [];

// Should use hardware or software rendering?
viewLayerTypeAndroid: 'none' | 'software' | 'hardware'; // Android only property

// Background color that will be visible on touch on views that have onPress
// handlers
underlayColor: string = undefined; // iOS and Android only

// When true
//  - renders children within the safe area boundaries of a device, i.e. with
//    padding with ensure the children don't cover navigation bars,
//    toolbars etc.
//  - Applies a style of { flex: 1, alignSelf: 'stretch' } to this view.
//  - Some ViewProps may be ignored.
useSafeInsets: boolean = false; // iOS only
```

## Styles
[**Flexbox Styles**](/reactxp/docs/styles.html#flexbox-style-attributes)

[**View Styles**](/reactxp/docs/styles.html#view-style-attributes)

[**Transform Styles**](/reactxp/docs/styles.html#transform-style-attributes)

## Methods
``` javascript
// Sets the focus to the component.
focus(): void;

// The preferable way to focus the component. When requestFocus() is called,
// the actual focus() will be deferred, and if requestFocus() has been
// called for several components, only one of those components will actually
// get a focus() call. By default, last component for which requestFocus() is
// called will get a focus() call, but you can specify arbitrateFocus property
// of a parent View and provide the callback to decide which one of that View's
// descendants should be focused. This is useful for the accessibility: when
// consecutive focus() calls happen one after another, the next one interrupts
// the screen reader announcement for the previous one and the user gets
// confused. autoFocus property of focusable components also uses requestFocus().
requestFocus(): void;

// Blurs the component.
blur(): void;

// The focus does not go outside the view with restrictFocusWithin by default,
// setFocusRestricted() allows to turn this restriction off and back on.
setFocusRestricted(restricted: boolean): void; // web only


// The focus does not go inside the view with limitFocusWithin by default,
// setFocusLimited() allows to turn this limitation off and back on.
setFocusLimited(limited: boolean): void; // web only
```
