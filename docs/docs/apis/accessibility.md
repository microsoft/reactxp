---
id: apis/accessibility
title: Accessibility
layout: docs
category: Interfaces
permalink: docs/apis/accessibility.html
next: apis/alert
---

This interface provides methods and events related to accessibility.

Sometimes it's important to announce state changes in the app (for example, an incoming message) so visually-impaired users are aware that something changed on the screen. Multiple announcements can be queued.

## Events
``` javascript
// Triggered when a new announcement is ready for the screen reader.
newAnnouncementReadyEvent: SubscribableEvent<(announcement: string) => void>;
```

## Methods
``` javascript
// Sends the specified string to the screen reader.
announceForAccessibility(announcement: string): void;

// Indicates whether a screen reader is currently enabled.
isScreenReaderEnabled(): boolean;

// Inidicates whether the OS-level "high-contrast" setting is enabled.
isHighContrastEnabled(): boolean;
```
