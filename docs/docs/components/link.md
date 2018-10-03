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
// It is hard or impossible to tell by a reference to an instance of a component
// from where this component has been instantiated. You can assign this property
// and check instance.props.accessibilityId. For example accessibilityId is used
// in View's FocusArbitrator callback.
accessibilityId: string = undefined;

// Should fonts be scaled according to system setting?
allowFontScaling: boolean = true; // Android and iOS only

// Should be focused when the component is mounted, see also View's arbitrateFocus
// property.
autoFocus: boolean = false;

// Should the scale multiplier be capped when allowFontScaling is set to true?
// Possible values include the following:
// null/undefined (default) - inherit from parent/global default
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

// Event called when context menu is triggered, either by
// right mouse button click or context menu key
onContextMenu: (e: MouseEvent) => void = undefined;

// Can the link be included in a text selection?
selectable: boolean = false;

// See below for supported styles
style: LinkStyleRuleSet | LinkStyleRuleSet[] = [];

// ID that can be used to identify the instantiated element for testing purposes.
testId: string = undefined;

// Text for a tooltip
title: string = undefined;

// URL to follow for hyperlink
url: string;
```

## Styles

[**Text Styles**](/reactxp/docs/styles.html#text-style-attributes)

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
```
