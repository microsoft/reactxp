---
id: apis/app
title: App
layout: docs
category: Interfaces
permalink: docs/apis/app.html
next: apis/clipboard
---

This interface provides core methods associated with the application. It also exposes events for low-memory conditions and activity state changes.

## Types
``` javascript
// Indicates whether the app is active or inactive
enum AppActivationState {
    // App is active and in foreground
    Active = 1,

    // App is active and in background
    Background = 2,

    // App is inactive (not actively running)
    Inactive = 3,

    // iOS specific activation state for extensions implemented 
    // with react-native
    Extension = 4
}
```

## Methods
``` javascript
// Initializes the app. This should be one of the first calls made.
// Specifies whether app is running in "debug" mode, typically with 
// asserts and unminified code. Also specifies whether in "development"
// mode, which can indicate that additional logging or fewer security
// checks are appropriate.
initialize(debug: boolean, development: boolean): void;

// Indicates whether the app was initialized in debug and/or
// development mode
isDebugMode(): boolean;
isDevelopmentMode(): boolean;

// Returns the current activitation state for the app
getActivationState(): AppActivationState;
```

## Events
``` javascript
// Triggered when the activation state changes
activationStateChangedEvent: SubscribableEvent<
    (state: AppActivationState) => void>;

// Triggered when a low-memory warning occurs
memoryWarningEvent: SubscribableEvent<() => void>;
```
