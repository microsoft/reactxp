---
id: apis/userpresence
title: UserPresence
layout: docs
category: Interfaces
permalink: docs/apis/userpresence.html
next: extensions/database
---

This interface provides information about whether the user is currently present. The technique for detecting presence differs by platform. On mobile platforms, the user is assumed to be present as long as the app is in the foreground. On web platforms, the user is assumed to be present if the window is in the foreground, the tab is foremost, and some mouse or keyboard activity has been seen within the window within the past minute.

# Methods
``` javascript
// Indicates whether the user is currently present
// On web platforms, it indicates whether the user has focused on the app and interacted with the app in the last 60 seconds
isUserPresent(): boolean;
```

## Events
``` javascript
// Triggered when the user presence changes
userPresenceChangedEvent: SubscribableEvent<
    (isPresent: boolean) => void>();
```

