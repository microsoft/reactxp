---
id: apis/statusbar
title: StatusBar
layout: docs
category: Interfaces
permalink: docs/apis/statusbar.html
next: apis/storage
---

This interface provides control over the system status bar at the top of the screen on mobile platforms.

## Methods
``` javascript
// Indicates whether the status bar overlays the app's main view (e.g. on iOS)
isOverlay(): boolean;

// Hides or shows the status bar with an optional animation
setHidden(hidden: boolean, showHideTransition: 'fade' | 'slide'): void;

// Specifies the status bar visual style
setBarStyle(style: 'default' | 'light-content' | 'dark-content',
    animated: boolean): void;

// Specifies whether the network activity indicator is visible.
setNetworkActivityIndicatorVisible(value: boolean): void;

// Specifies the background color of the status bar (applies on Android only)
setBackgroundColor(color: string, animated: boolean): void;

// Specifies whether the status bar is transluscent or transparent
setTranslucent(translucent: boolean): void;
```
