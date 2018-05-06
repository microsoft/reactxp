---
id: apis/clipboard
title: Clipboard
layout: docs
category: Interfaces
permalink: docs/apis/clipboard.html
next: apis/input
---

This interface provides access to the system's clipboard.

## Methods
``` javascript
// Retrieves the text from the clipboard (not supported on web)
getText(): SyncTasks.Promise<string>;

// Places the specified text on the clipboard
setText(text: string): void;
```
