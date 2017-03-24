---
id: apis/location
title: Location
layout: docs
category: Interfaces
permalink: docs/apis/location.html
next: apis/modal
---

This interface provides access to geolocation data.

## Types
``` javascript
enum LocationErrorType {
    // User has not granted the app access to location data
    PermissionDenied,
    
    // Geolocation information is not currently available
    PositionUnavailable,

    // Geolocation request has timed out
    Timeout
}

interface PositionOptions {
    // Enable high-accuracy mode; consumes more battery
    enableHighAccuracy?: boolean;

    // Number of milliseconds before timeout
    timeout?: number;

    // Max age (in milliseconds) before cached location is invalidated
    maximumAge?: number;
}

// ID for a pending "watch" request
type LocationWatchId = number;

// Delegates that are invoked when call succeeds or fails
type LocationSuccessCallback = (position: Position) => void;
type LocationFailureCallback = (error: LocationErrorType) => void;

```

## Methods
``` javascript
// Indicates whether geolocation services are available on this platform
isAvailable(): boolean;

// Returns the current location
getCurrentPosition(options?: PositionOptions): SyncTasks.Promise<Position>;

// Requests a callback when the position changes; useful for geofencing
watchPosition(successCallback: LocationSuccessCallback, 
    errorCallback?: LocationFailureCallback,
    options?: PositionOptions): SyncTasks.Promise<LocationWatchId>;

// Clears a location watch request
clearWatch(watchID: LocationWatchId): void;
```
