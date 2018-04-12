---
id: apis/focusutils
title: FocusUtils
layout: docs
category: Interfaces
permalink: docs/apis/focusutils.html
next: apis/input
---

This interface provides methods related to managing focusable components.

## Methods
``` javascript
// Allows to register a component for being automatically focused during the
// current mount cycle.
// The same method which is used internally to handle autoFocus property for
// the components which might support being focused (View, Button, etc.)

// Moving the focus manually from the application code might lead to a complex
// logic on the application level and to race conditions when several components
// want to be focused on mount at the same time. Those race conditions might
// result in an unreliable behaviour, especially for the screen reader users.
// For example, when some element inside the dialog is focused, the screen reader
// announces the dialog, but only when nothing inside the dialog was focused before,
// and if the focus is moved inside the dialog, the second focused element
// might interrupt the dialog announcement and the screen reader users won't be
// able to understand where they are.
// Another thing is that it is often required to have different autofocusing logic
// on different platforms. For example it is often ok to automatically focus the
// input field on desktop when something shows, but on mobile it will bring up the
// keyboard which is not always the desired behaviour.

// To tackle above we have this concept of smart automatic focus.
// See the Types.AutoFocus enum definition:

// export enum AutoFocus {
//     No = 0,
//     Yes = 1, // All platforms, any state of the keyboard navigation mode, default
//              // priority, no delay.

//     // We can target the keyboard navigation mode (if none of
//     // WhenNavigatingWithKeyboard and WhenNavigatingWithoutKeyboard are specified,
//     // both are assumed to be enabled).
//     WhenNavigatingWithKeyboard,
//     WhenNavigatingWithoutKeyboard,

//     // We can target the platform (if none of the platforms are specified, all
//     // platforms are assumed to be enabled).
//     Android,
//     IOS,
//     Web,
//     Windows,
//     Mac,

//     // Sometimes a common high level component has default autofocusable (for
//     // example, close button in a dialog), but the subcomponents want to be
//     // autofocused too (for example, some input inside a particular kind of dialog).
//     // We can specify the priority (Low for the close button, High for the
//     // input) without forking the logic on the application level (the input will
//     // win if present, otherwise the close button will be focused).
//     // Default priority is PriorityLow.
//     PriorityLow,
//     PriorityHigh,
//     PriorityHighest, // Highest priority is used internally and you shouldn't use
//                      // it unless you are really sure what you're up to.

//     // Sometimes it might be needed to delay the autofocusing a little (if no
//     // delay is specified, the component will be focused without the delay).
//     Delay100, // 100 ms
//     Delay500, // 500 ms
//     Delay1000 // 1000 ms
// }

// In general, using autoFocus property of the components which support it, should
// be enough, however sometimes we want to schedule something for automatic focus
// when an already mounted component is being updated.
autoFocus(value: Types.AutoFocus|Types.AutoFocus[], focus: () => void, isAvailable: () => boolean): boolean;
```
