---
id: apis/network
title: Network
layout: docs
category: Interfaces
permalink: docs/apis/network.html
next: apis/platform
---

This interface provides information about network connectivity.

## Methods
``` javascript
// Returns a promise that specifies whether the device currently 
// has network connectivity
isConnected(): SyncTasks.Promise<boolean>;
```

## Events
``` javascript
// Triggered when the connectivity changes
connectivityChangedEvent: SubscribableEvent<(isConnected: boolean) => void>;
```
