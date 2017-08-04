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
```

## Methods
``` javascript
// Specifies the "main view" of the app, which is rendered on the full
// screen beneath any open modals or popups
setMainView(element: React.ReactElement<any>): void;

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
// of mobile devices); the dimensions can also be obtained for any
// view (including your app's top-level view) using the onLayout
// callback
measureWindow(): Types.Dimensions;

// Indicates the "size multiplier" for text increase or decrease, which
// can be adjusted by users on some platforms; defaults to 1.0
getContentSizeMultiplier(): SyncTasks.Promise<number>;

// Indicates the default maximum "size multiplier" for text increase.
// Defaults to 0 which indicates there is no max.
// Note: Older versions of React Native don’t support this interface.
getMaxContentSizeMultiplier(): SyncTasks.Promise<number>;

// Sets the default maximum "size multiplier" for text increase.
// Values must be 0 or >=1. The default is 0 which indicates that
// there is no max.
// Note: Older versions of React Native don’t support this interface.
setMaxContentSizeMultiplier(maxContentSizeMultiplier: number): void;

// Dismisses the on-screen keyboard (applies to mobile only)
dismissKeyboard(): void;

// Enables native -> script touch event latency diagnostic events.
// When latency greater than latencyThresholdMs is observed, the
// touchLatencyEvent will fire. (applies to mobile only)
enableTouchLatencyEvents(latencyThresholdMs: number): void;

// Returns true if the application is in the keyboard navigation state,
// when the user is using Tab key to navigate through the focusable
// elements. (applies to web only)
isNavigatingWithKeyboard(): boolean;
```

## Events
``` javascript
// Triggered when the content size multiplier changes while the
// app is running
contentSizeMultiplierChangedEvent: SubscribableEvent<
    (multiplier: number) => void>();

// Triggered when enableTouchLatencyEvents has been called and
// native -> script touch latency exceeding the threshold has
// been observed. (applies to mobile only)
touchLatencyEvent: SubscribableEvent<
    (observedLatencyMs: number) => void>();

// Triggered when the keyboard navigation state is changed.
// (applies to web only)
keyboardNavigationEvent: SubscribableEvent<
    (isNavigatingWithKeyboard: boolean) => void>();
```

