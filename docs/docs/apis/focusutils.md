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
// keyboard which is not always the desired behaviour and you might want to delay
// the focus.

// To tackle above we have a concept of smart automatic focus.
// See Types.AutoFocus, Types.FocusArbitrator and Types.FocusCandidate definitions.

// When the application is in keyboard navigation mode
// (RX.UserInterface.isNavigatingWithKeyboard() is true) and a View with
// restrictFocusWithin property is mounted, ReactXP claims to focus first focusable
// component inside that View. This is an id to that component's AutoFocusValue.id,
// you can use that id inside your FocusArbitrator to choose the proper component
// to focus.
FirstFocusableId: string;

// Sometimes several just mounted components have the autoFocus property value set.
// This method allows you specify a callback which will be called every time the actual
// focusing should be done. You can choose and focus what actually needs to be focused
// from all the candidates passed to the callback.
setFocusArbitrator(arbitrator: Types.FocusArbitrator): void;

// In general, using autoFocus property of the components which support it should
// be enough, however sometimes we want to schedule something to be focused when an
// already mounted component is being updated. At the same time, some new component
// with autoFocus property specified might be mounting. Use requestFocus() method
// to get all the candidates to focus into the same queue. And your application
// will be able to decide what should actually be focused using FocusArbitrator above.
requestFocus(id: string, component: React.Component<any, any>, focus: () => void): void;
```
