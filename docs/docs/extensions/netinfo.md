---
id: extensions/netinfo
title: NetInfo
layout: docs
category: Extensions
permalink: docs/extensions/navigator.html
next: extensions/restclient
---

This interface provides information about network connectivity.

## Types
``` javascript
enum DeviceNetworkType {
    Unknown,
    None,
    Wifi,
    Mobile2G,
    Mobile3G,
    Mobile4G
}
```

## Methods
``` javascript
// Returns a promise that specifies whether the device currently
// has network connectivity
isConnected(): SyncTasks.Promise<boolean>;

// Returns the type of network
getType(): SyncTasks.Promise<DeviceNetworkType>;
```

## Events
``` javascript
// Triggered when the connectivity changes
connectivityChangedEvent: SubscribableEvent<(isConnected: boolean) => void>;
```

## Sample Usage

``` javascript
private isConnected: boolean;

constructor() {
    // Query the initial connectivity state.
    this.isConnected = false;
    RXNetInfo.isConnected().then(isConnected => {
        this.isConnected = isConnected;
    });

    RXNetInfo.connectivityChangedEvent.subscribe(isConnected => {
        // Update the connectivity state.
        this.isConnected = isConnected;
    });
}
```

## Other Notes

On Android, the following permission must be added to make use of the network interfaces.

``` xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```
