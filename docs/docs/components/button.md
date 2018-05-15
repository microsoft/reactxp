---
id: components/button
title: Button
layout: docs
category: Components
permalink: docs/components/button.html
next: components/gestureview
---

Like View, this component is a generic container for other components. However, it adds some additional capabilities -- support for presses or clicks and hovering.

## Props
In addition to the [common accessibility props](/reactxp/docs/accessibility.html), the following props are supported.

``` javascript
// Text to be used by screen readers
accessibilityLabel: boolean = false;

// Traits used to hint screen readers, etc.
accessibilityTraits: AccessibilityTrait | AccessibilityTrait[] = undefined;

// It is hard or impossible to tell by a reference to an instance of a component
// from where this component has been instantiated. You can assign this property
// and check instance.props.accessibilityId. For example accessibilityId is used
// in View's FocusArbitrator callback.
accessibilityId: string = undefined;

// Id of an expandable element revealed by the button. Describes a relation
// between button and element to screen reader.
ariaControls: string = undefined; // Web only

// Specifies a unique id for an HTML element
id: string = undefined; // Web only

// Expose the element and/or its children as accessible to Screen readers
importantForAccessibility?: ImportantForAccessibility = ImportantForAccessibility.Yes;

// Delay in ms before onLongPress is called
delayLongPress: number = 1000;

// If disabled, touch and mouse input events are ignored
disabled: boolean = false;

// By default, opacity of a disabled element is 0.5. This value can be
// overriden with this property
disabledOpacity: number = undefined;

// Should be focused when the component is mounted, see also View's arbitrateFocus
// property.
// WARNING: autoFocus=true means that this Button's requestFocus() method will be
// called, however calling requestFocus() might have no effect (for example the
// button is disabled), the application has to handle this either while setting
// this property or in the View's FocusArbitrator callback.
autoFocus: boolean = false;

// Called when VoiceOver is on and the user double tapped to
// activate a control
onAccessibilityTapIOS: (e: SyntheticEvent) => void; // iOS Only

// Focus Events
onFocus: (e: FocusEvent) => void = undefined;
onBlur: (e: FocusEvent) => void = undefined;

// Called when the mouse cursor enters or leaves the view bounds
onHoverStart: (e: SyntheticEvent) => void;
onHoverEnd: (e: SyntheticEvent) => void;

// Keyboard Events
onKeyPress: (e: KeyboardEvent) => void = undefined;

// Called when the user has pressed and held for a specified duration
onLongPress: (e: SyntheticEvent) => void;

// Called when the touch or mouse button is released within the
// bounds of the view and the press has not been canceled
onPress: (e: SyntheticEvent) => void;

// Called when touch is initiated or mouse button is pressed
onPressIn: (e: SyntheticEvent) => void;

// Called when touch or the mouse button is released or the
// user's finger or mouse cursor is no longer over the view
onPressOut: (e: SyntheticEvent) => void;

// Rasterize contents using offscreen bitmap (perf optimization)
shouldRasterizeIOS: boolean = false; // iOS only

// See below for supported styles
style: ButtonStyleRuleSet | ButtonStyleRuleSet[] = [];

// Keyboard tab order
tabIndex: number = undefined;

// Text for a tooltip
title: string = undefined;

// Visual touchfeedback properties
// Disable default opacity animation on touch of buttons
disableTouchOpacityAnimation: boolean = false;  // iOS and Android only

// Opacity value the button should animate to on button touch
activeOpacity: number = undefined; // iOS and Android only

// Background color that will be visible on button touch
underlayColor: string = undefined; // iOS and Android only
```

## Styles

[**Flexbox Styles**](/reactxp/docs/styles.html#flexbox-style-attributes)

[**View Styles**](/reactxp/docs/styles.html#view-style-attributes)

[**Transform Styles**](/reactxp/docs/styles.html#transform-style-attributes)

## Methods
``` javascript
// Sets the accessibility focus to the component.
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
```

