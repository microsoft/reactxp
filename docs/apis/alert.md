---
id: apis/alert
title: Alert
layout: docs
category: Interfaces
permalink: docs/apis/alert.html
next: apis/app
---

This interface displays an OS-specific alert over the top of the current screen. The appearance of the alert is dictated by the underlying OS platform. Some platforms allow alerts to be displayed even when the app is not in the foreground.

There is no ability to customize the alert by embedding ReactXP views within it or using ReactXP styles.

## Types
``` javascript
interface AlertButtonSpec {
    // Button text
    text?: string;

    // Invoked when button is pressed
    onPress?: () => void;

    // Alert style to use (supported on some platforms)
    style?: 'default' | 'cancel' | 'destructive';
}
```

## Methods
``` javascript
// Displays an alert over the top of the current screen
show(title: string, message?: string, buttons? AlertButtonSpec[]): void;
```
