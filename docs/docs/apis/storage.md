---
id: apis/storage
title: Storage
layout: docs
category: Interfaces
permalink: docs/apis/storage.html
next: apis/userinterface
---

This interface provides a simple key-based local storage mechanism. If you need more powerful options to persist data and work with them, consider using ReactXP's [Database Extension](/reactxp/docs/extensions/database).

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

