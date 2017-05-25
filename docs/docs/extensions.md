---
id: extensions
title: Extensions
layout: docs
category: Overview
permalink: docs/extensions.html
next: components/activityindicator
---

The ReactXP library is designed to be as lightweight as possible, including only those cross-platform APIs and "primitive" components that are required by almost every app. Functionality that is needed less commonly is provided in the form of optional extensions.

There are two distinct types of extensions.
1. Additional APIs or "primitive" components that have separate implementations for each of the supported platforms.
2. Higher-level components that contain no platform-specific code but build upon the lower-level primitives to provide new (typically more complex) functionality.

Extensions are published as separate npm packages. They typically start with the prefix "reactxp-".


## Primitive ReactXP Extensions

To use a primitive extension in your app, add it to your package.json like any other npm module. Then import it at the top of the code module where you want to consume it.

Here is an example of how to use a hypothetical extension that provides video playback capabilities in a cross-platform manner.

``` typescript
import RXVideoPlayer from 'reactxp-videoplayer';

class MyVideoPanel extends RX.Component<null, null> {
    render() {
        return (
            <RXVideoPlayer
                source={ this.props.source }
                showControls={ true }
                onProgress={ this._onVideoProgress }
                onEnded={ this._onVideoEnded }
            />
        );
    }
}
```

### Implementing a new "Primitive"

A new "primitive" extension (either a component or an API namespace) must have a cross-platform interface and a platform-specific implementation of this interface for each of the platforms supported by ReactXP. In some cases, the implementation may be shared between platforms.


## Higher-level ReactXP Components

Using a higher-level component is just like using any other component in React. Because these components are built on cross-platform ReactXP primitives, they also work in a cross-platform manner.


