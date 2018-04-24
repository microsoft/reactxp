---
id: apis/userinterface
title: UserInterface
layout: docs
category: Interfaces
permalink: docs/apis/userinterface.html
next: apis/userpresence
---

This interface provides a variety of UI-related methods.

## Types
``` javascript
interface LayoutInfo {
    x: number;
    y: number;
    width: number;
    height: number;
}

// A callback signature. It is used in UserInterface.setFocusArbitrator() method and
// in arbitrateFocus property of View.
type FocusArbitrator = (candidates: FocusCandidate[]) => FocusCandidate | undefined;

interface FocusCandidate {
    // Optional accessibilityId might be specified in the properties of the component with
    // autoFocus=true or it can be to FocusUtils.FirstFocusableId (see
    // https://microsoft.github.io/reactxp/docs/apis/focusutils.html for more details).
    accessibilityId?: string;

    // If the candidate is inside the View with arbitrateFocus property specified, this
    // will be accessibilityId of that View.
    parentAccessibilityId?: string;

    // An instance of the component which wants to be focused.
    component: React.Component<any, any>;

    // A function to call to focus the component.
    focus: () => void;

    // Due to asynchronous nature of the focus arbitrator, we need a flag to find out
    // that the component is still mounted and ready to be focused.
    isAvailable: () => boolean;
}
```

## Methods
``` javascript
// Specifies the "main view" of the app, which is rendered on the full
// screen beneath any open modals or popups
setMainView(element: React.ReactElement<any>): void;

// Android & iOS only.
// Wrapper around RN.AppRegistry.registerComponent();
// IMPORTANT: Some APIs, e.g. Popup & Modal, require a string
// `reactxp_rootViewId` prop to be set on the component from the
// native-side.
registerRootView(viewKey: string, getComponentFunc: Function);

// Specifies whether custom scrollbars should be enabled (applies
// to web only)
useCustomScrollbars(enable: boolean): void;

// Indicates whether the screen is "high density" (e.g. retina displays)
isHighPixelDensityScreen(): boolean;

// Measure the location and dimensions of a mounted component relative
// to the window or one of its other containing views
measureLayoutRelativeToWindow(component: React.Component<any, any>):
    SyncTasks.Promise<LayoutInfo>;
measureLayoutRelativeToAncestor(component: React.Component<any, any>,
    ancestor: React.Component<any, any>): SyncTasks.Promise<LayoutInfo>;

// Measures the dimension of the full window (or screen, in the case
// of non-windowed platforms); the dimensions can also be obtained for any
// view (including your app's top-level view) using the onLayout
// callback
measureWindow(): Types.Dimensions;

// Indicates the "size multiplier" for text increase or decrease, which
// can be adjusted by users on some platforms; defaults to 1.0
getContentSizeMultiplier(): SyncTasks.Promise<number>;

// Sets the default maximum "size multiplier" for text increase.
// Values must be 0 or >=1. The default is 0 which indicates that
// there is no max.
// Note: Older versions of React Native don’t support this interface.
setMaxContentSizeMultiplier(maxContentSizeMultiplier: number): void;

// Dismisses the on-screen keyboard (on applicable platforms)
dismissKeyboard(): void;

// Enables native -> script touch event latency diagnostic events.
// When latency greater than latencyThresholdMs is observed, the
// touchLatencyEvent will fire (on applicable platforms).
enableTouchLatencyEvents(latencyThresholdMs: number): void;

// Returns true if the application is in the keyboard navigation state,
// when the user is using Tab key to navigate through the focusable
// elements (on applicalbe platforms).
isNavigatingWithKeyboard(): boolean;

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
// And sometimes several just mounted components have the autoFocus property set.
// This method allows you specify a callback which will be called every time the
// actual focusing should be done. This method sets a top-most callback, you can
// also narrow down the scope of the focus arbitrator callback (see View's
// arbitrateFocus property for more details).
// When no callback is specified the default logic is used: if present, focus a
// candidate with accessibilityId===FocusUtils.FirstFocusableId (see above),
// otherwise focus last candidate from the array.
setFocusArbitrator(arbitrator: FocusArbitrator | undefined): void
```

## Events
``` javascript
// Triggered when the content size multiplier changes while the
// app is running
contentSizeMultiplierChangedEvent: SubscribableEvent<
    (multiplier: number) => void>();

// Triggered when enableTouchLatencyEvents has been called and
// native -> script touch latency exceeding the threshold has
// been observed (on applicable platforms).
touchLatencyEvent: SubscribableEvent<
    (observedLatencyMs: number) => void>();

// Triggered when the keyboard navigation state is changed
// (on applicable platforms).
keyboardNavigationEvent: SubscribableEvent<
    (isNavigatingWithKeyboard: boolean) => void>();
```

