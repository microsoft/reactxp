---
id: accessibility
title: Accessibility
layout: docs
category: Overview
permalink: docs/accessibility.html
next: extensions
---

ReactXP exposes a common way to implement accessibility features across platforms.

A screen reader is an assistive technology available for visually-impaired users. It allows users to navigate through an application by focusing actionable components and announcing the purpose of those components.

ReactXP components [View](components/view), [Button](components/button), [GestureView](components/gestureview) and [TextInput](components/textinput) implement a common set of accessibility-related props described below. 

Additional [Accessibility APIs](apis/accessibility) are provided for programmatically invoking the screen reader to announce events.

Accessibility traits override the default screen reader behaviors where appropriate. For example, the default behavior for [Button](components/button) is to append the text "Button" at the end of the label. In most cases, the default traits provide the desired behavior, but it is sometimes useful to provide additional information to the screen reader.

## Types
``` javascript
export enum ImportantForAccessibility {
    // Platform decides which views are important for accessibility and brings
    // the screen reader focus on those views
    Auto,

    // Groups all subviews under the view, allowing the screen reader to focus
    // just this view; if the accessibilityLabel is specified, it is announced; 
    // otherwise, the labels of its children are used
    Yes,

    // Tells the screen reader that it can focus the subviews of this view
    No,

    // Hides the view and its subviews from the screen reader
    NoHideDescendants
}
```

## Props
``` javascript
// Array of strings that will be added as custom actions on iOS
accessibilityActions?: string[] = undefined;

// Label that is read by the screen reader
accessibilityLabel?: string = undefined;

// Overrides or augments default screen reader behavior
accessibilityTraits?: AccessibilityTrait | AccessibilityTrait[] = undefined;

// Screen reader focus behavior
importantForAccessibility?: ImportantForAccessibility = Auto;

// Callback function invoked for accessibility action events
onAccessibilityAction?: (e: SyntheticEvent) => void;

// Keyboard tab order
tabIndex?: number = undefined; // web only
```



