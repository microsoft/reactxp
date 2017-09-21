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

interface AlertModalTheme {
    // Modal background style
    bodyStyle?: StyleRuleSet<ViewStyle>;
    
    // Style for title text
    titleTextStyle?: StyleRuleSet<TextStyle>;
    
    // Style for message text
    messageTextStyle?: StyleRuleSet<TextStyle>;
    
    // Style for button control
    buttonStyle?: StyleRuleSet<ButtonStyle>;
    
    // Style applied when hovering over button
    buttonHoverStyle?: StyleRuleSet<ButtonStyle>;

    // Style for button text
    buttonTextStyle?: StyleRuleSet<TextStyle>;
    
    // Override style for cancel button
    cancelButtonStyle?: StyleRuleSet<ButtonStyle>;
    
    // Override style for cancel button hover state
    cancelButtonHoverStyle?: StyleRuleSet<ButtonStyle>;

    // Override style for cancel button
    cancelButtonTextStyle?: StyleRuleSet<TextStyle>;;
}

interface AlertOptions {
    // Optional icon (web only)
    icon?: string;

    // Optional theme (web only)
    theme?: AlertModalTheme;
}

```

## Methods
``` javascript
// Displays an alert over the top of the current screen. Theming support is
// provided for web only and is ignored on other platforms.
show(title: string, message?: string, buttons? AlertButtonSpec[], options?: AlertOptions): void;
```
