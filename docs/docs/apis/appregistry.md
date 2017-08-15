---
id: apis/appregistry
title: AppRegistry
layout: docs
category: Interfaces
permalink: docs/apis/appregistry.html
next: apis/clipboard
---

This interface provides react-native's [AppRegistry](https://facebook.github.io/react-native/docs/appregistry.html) functionality for ReactXP projects.  These are no-ops on Web.

## Methods
``` javascript
// Registers a new root component.
registerComponent(appKey: string, getComponentFunc: Function): any;
```