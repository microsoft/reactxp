---
id: apis/profiling
title: Profiling
layout: docs
category: Interfaces
permalink: docs/apis/profiling.html
next: apis/statusbar
---

This interface provides profiling utilities for ReactXP that can help tune the performance of your app.

## Methods

``` javascript
// Starts a profiling session, discarding any previously-collected data
start(): void;

// Stops a profiling session
stop(): void;

// Prints the results of the last completed profiling session
printResults(config: Types.ProfilingLoggingConfig): void;

// Installs a watchdog to detect when the UI thread is starved because
// of excessive activity JS or native activity. Output of watchdog
// is logged to the console.
installWatchdog(): void;
```


