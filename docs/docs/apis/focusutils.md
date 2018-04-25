---
id: apis/focusutils
title: FocusUtils
layout: docs
category: Interfaces
permalink: docs/apis/focusutils.html
next: apis/input
---

This interface provides methods related to managing the focus.

## Types
``` javascript
// When multiple components with autoFocus=true are mounting at the same time,
// the application can specify a callback which will choose one from those multiple.
// To set this callback use View's arbitrateFocus property and/or
// FocusUtils.setDefaultFocusArbitrator() method.
type FocusArbitrator = (candidates: FocusCandidate[]) => FocusCandidate | undefined;

// FocusArbitrator function will be called with an array of FocusCandidate.
class FocusCandidate {
    // An instance of the component which wants to be focused.
    component: React.Component<any, any>;

    // A function to call to focus the component.
    focus: () => void;

    // Due to asynchronous nature of the focus arbitrator, we need a flag to find
    // out that the component is still mounted and ready to be focused.
    isAvailable: () => boolean;

    // Returns component.props.accessibilityId (if specified).
    getAccessibilityId: () => string | undefined;

    // If the candidate is inside the View with arbitrateFocus property specified,
    // returns accessibilityId of that View.
    getParentAccessibilityId: () => string | undefined;
}
```

## Methods
``` javascript
// By default we are applying the following accessibility requirement.
// When the application is in the keyboard navigation mode
// (UserInterface.isNavigatingWithKeyboard() is true) and a View with
// restrictFocusWithin property is mounted, ReactXP focuses first focusable
// component inside that View. This requirement is stronger than autoFocus
// property. For example, if you have a modal dialog, inside this dialog
// there is TextInput with autoFocus=true and there is also one button before
// this TextInput, in the keyboard navigation mode this button will be focused
// despite the fact that TextInput below the button has autoFocus=true. When
// you are navigating with mouse the TextInput will be focused normally.
// If your application for some reason doesn't need to follow this requirement,
// or you handle this requirement yourself, use setFocusFirstEnabled(false)
// to disable it.
setFocusFirstEnabled(enabled: boolean): void;

// View has arbitrateFocus property to provide the callback which will resolve
// the situtation when several components inside that View have autoFocus=true.
// setDefaultFocusArbitrator() allows you to specify the default callback to
// resolve multiple autoFocus=true situations. When both arbitrateFocus and
// default arbitrator are set, the one from View's arbitrateFocus has the priority.
setDefaultFocusArbitrator(arbitrator: Types.FocusArbitrator | undefined): void;

// In general, using autoFocus property of the components which support it should
// be enough, however sometimes we want to focus an already mounted component in
// componentDidUpdate(). At the same time, during the same render cycle, some new
// component with autoFocus=true might have mounted. If you use requestFocus() method
// in componentDidUpdate(), then the canditates array in the focus arbitrator callback
// call will include both new component with autoFocus=true and an already mounted
// component you used requestFocus() for. And your application will be able to
// decide which one you want to be focued.
//
// `component` argument should be an instance of the component to focus.
//
// `focus()` is a callback which will be called to actually perform the focusing,
// usually it's component's focus() method, but you can wrap component.focus() to be,
// for example, called after a delay or after an animation. You can also use
// requestFocus() for a higher order component which might provide other that
// component.focus() way of focusing it.
//
// `isAvailable()` is a callback which will be called to determine that the component
// is still mounted. You can also use this callback to do the platform-dependent
// focusing. For example, you want a component to be focused on web, but to not be
// focused on mobile.
requestFocus(component: React.Component<any, any>, focus: () => void, isAvailable: () => boolean): void;
```
