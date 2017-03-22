---
id: apis/storage
title: Storage
layout: docs
category: Interfaces
permalink: docs/apis/storage.html
next: apis/userinterface
---

This interface provides a simple key-based local storage mechanism.

## Methods
``` javascript
// Clears all local storage keys
clear(): SyncTasks.Promise<void>;

// Returns an item by key
getItem(key: string): SyncTasks.Promise<string>;

// Deletes an item by key
removeItem(key: string): SyncTasks.Promise<void>;

// Sets or replaces the value of an item by key
setItem(key: string, value: string): SyncTasks.Promise<void>;
```

