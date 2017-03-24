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
// of mobile devices)
measureWindow(): Types.Dimensions;

// Indicates the "size multiplier" for text increase or decrease, which
// can be adjusted by users on some platforms; defaults to 1.0
getContentSizeMultiplier(): SyncTasks.Promise<number>;

// Dismisses the on-screen keyboard (applies to mobile only)
dismissKeyboard(): void;
```

## Events
``` javascript
// Triggered when the content size multiplier changes while the
// app is running
contentSizeMultiplierChangedEvent: SubscribableEvent<
    (multiplier: number) => void>();
```

