---
id: using-reactxp
title: Using ReactXP
layout: docs
category: Overview
permalink: docs/using-reactxp.html
next: faq
---

## Tips for Web

ReactXP assumes that your main web page will have a DOM element container called "app-container". The root view of the app will be rendered within this container. Typically, this DOM element will be a &lt;div&gt; that covers the entire page.

React Native's layout engine assumes "border-box" box sizing rules, whereas browsers default to "content-box". To match layout behavior, override the default box-sizing value using CSS.

```
  <style>
    * {
      box-sizing: border-box;
    }
  </style>
```

## Tips for Native

The main module is assumed to be called "RXApp", and it must be registered as such by the native code. Refer to the sample app for how to register the module in Android and iOS.


