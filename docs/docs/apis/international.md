---
id: apis/international
title: International
layout: docs
category: Interfaces
permalink: docs/apis/international.html
next: apis/linking
---

This interface provides interfaces related to globalization (g11n) and internationalization (i18n).

Some languages read right to left. In such cases, it's preferable for the UI to be "mirrored". Buttons that are on the left side of the screen in left-to-right languages are flipped to the right side of the screen for right-to-left languages. This mirroring is mostly automatic, but some code changes may be required --- for exmaple, to flip icons or images that depend on placement. For more details about React Native's support for right-to-left languages, see this helpful [blog article](https://facebook.github.io/react-native/blog/2016/08/19/right-to-left-support-for-react-native-apps.html).

## Methods
``` javascript
// By default, right-to-left mirroring is enabled based on the
// OS or browser settings. This method allows the app to disable
// right-to-left mirroring.
allowRTL(allow: boolean): void;

// This method overrides the right-to-left setting of the system
// or browser, forcing right-to-left mirroring behavior if true.
forceRTL(force: boolean): void;

// Indicates whether the app is currently running in right-to-left mode.
isRTL(): boolean;
```
