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
1. Higher-level components that contain no platform-specific code but build upon the lower-level primitives to provide new (typically more complex) functionality.
2. Additional APIs or "primitive" components that have separate implementations for each of the supported platforms.

Extensions are published as separate npm packages. They typically start with the prefix "reactxp-".


## Higher-level ReactXP Components

Using a higher-level component is just like using any other component in React. Because these components are built on cross-platform ReactXP primitives, they also work in a cross-platform manner.


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

An implementation should be provided for each of the supported platforms. Web, iOS and Android are required. React Native for MacOS and Windows are still under development and are currently considered optional, but they may become required in the future. The main implementation file for each platform is named ```index.[platform].js```. For the web, the platform is omitted (that is, the file is named ```index.js```). These implementation files must live at the top level of the extension's published directory, but it is typical for them to simply import code from a ```dist``` directory.

Many ReactXP apps are written in TypeScript, so it's highly recommended that all ReactXP extensions provide a type definition file that defines the cross-platform interface to the extension. The extension's ```package.json``` should refer to this type file. For example: ```"types": "dist/MyExtension.d.ts"```. If you are implementing the extension in TypeScript, the compiler can be used to ensure that the implementation for each platform matches the public interface.


## Sample Extensions

Refer to the "Extensions" section of the documentation for a full list of available ReactXP extensions. Some of these are in separate git repositories, and others are in the [extensions](https://github.com/Microsoft/reactxp/tree/master/extensions) directory of the reactxp repository. The [reactxp-video](https://github.com/Microsoft/reactxp/tree/master/extensions/video) extension is a good example of a complete extension that involves native code for each of the supported platforms. To build any of these sample extensions:

1. Clone the repository.
2. Switch to the top-level directory of the extension (e.g. ```reactxp/extensions/video```).
3. Install the dependent npm packages: ```npm install```.
4. Build the code: ```npm run build```.

The resulting code will be found in the ```dist``` directory.

