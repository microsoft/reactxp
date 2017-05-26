---
id: apis/input
title: Input
layout: docs
category: Interfaces
permalink: docs/apis/input.html
next: apis/international
---

This interface provides events that are triggered when specific user input events occur.

## Events
``` javascript
// Triggered when the hardware back button is pressed (Android only).
// Events are triggered in the reverse order in which they were registered.
// Pass true to stop propagation.
backButtonEvent: SubscribableEvent<() => boolean>();

// Triggered when a hardware key up/down event occurs. Events are triggered 
// in the reverse order in which they were registered. Pass true to stop
// propagation.
keyDownEvent: SubscribableEvent<(e: Types.KeyboardEvent) => boolean>();
keyUpEvent: SubscribableEvent<(e: Types.KeyboardEvent) => boolean>();
```
