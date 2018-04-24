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
// See UserInterface.setFocusArbitrator() method and arbitrateFocus property of
// View for more details.

// When the application is in keyboard navigation mode
// (UserInterface.isNavigatingWithKeyboard() is true) and a View with
// restrictFocusWithin property is mounted, ReactXP claims to focus first focusable
// component inside that View. This id will be passed as accessibilityId of the
// relevant FocusCandidate and you can account for it implementing FocusArbitrator.
FirstFocusableId: string;

// In general, using autoFocus property of the components which support it should
// be enough, however sometimes we want to schedule something to be focused when an
// already mounted component is being updated. At the same time, some new component
// with autoFocus property specified might be mounting. Use requestFocus() method
// to get all the candidates to focus into the same queue. And your application
// will be able to decide what should actually be focused using FocusArbitrator.
requestFocus(id: string, component: React.Component<any, any>, focus: () => void): void;
```
