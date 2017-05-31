---
title: Performance Tuning
author: erictraut
---

Performance tuning is an important part of any app development effort. In this article, I'll talk about some of the tools and techniques we used to identify and address performance bottlenecks within the ReactXP-based Skype app.

One of the benefits of a cross-platform code base is that many performance improvements benefit all platforms.


### Measurement and Analysis

It has been said that you can't improve what you can't measure. This is especially true for performance tuning. We use a variety of tools to determine which code paths are performance-critical.

Regardless of the analysis tool, you may want to use the production build of the app when measuring performance. The React JavaScript code performs many expensive runtime checks when it executes in "dev mode", and this can significantly distort your measurements.

#### Chrome Performance Tools
The Chrome browser offers excellent tracing and visualization tools. Open the Developer Tools window, click on the Performance tab, and click on the "record" button. Once you're done recording, Chrome will display a detailed timeline with call hierarchies. Zoom in and out to determine where your time is going.

#### Systrace
React Native provides a way to enable and disable Systrace, a method-level trace recording facility. It records both native and JavaScript methods, so it provides a good overview of what's happening throughout the app. To use Systrace, build and deploy a dev build to your device. Shake the device to display the developer menu (or press command-D if you're running within the iOS simulator). Select "Start Systrace", then perform the action that you want to measure. When you stop Systrace, an HTML trace file will be created. You can visualize and interact with this trace in Chrome. Recent versions of Chrome deprecated a feature used in the Systrace code, so you will need to edit it as follows. Simply add the following line to the head section of the generated HTML file.

```
<script src="https://rawgit.com/MaxArt2501/object-observe/master/dist/object-observe.min.js"></script>
```

#### Console Logging
Primitive console logging is often an effective way to measure performance. Log entries can be emitted with millisecond-resolution timestamps. Simply call Date.now() to get the current time. Durations of performance-critical operations (such as app startup) can also be computed and output in the log.

#### Instrumentation
Once your app is deployed at scale, it's important to monitor performance of critical operations. To do this, we log instrumentation that is sent to our servers and aggregated across all users. We're then able to visualize the data over time, by platform, by device type, etc.


### Crossing the Bridge
React Native apps contain two separate execution environments --- JavaScript and Native. These environments are relatively independent. They each run on separate threads and have access to their own data. All communication between the two environments takes place over the React Native "bridge". You can think of the bridge as a bidirectional message queue. Messages are processed in the order in which they are placed on each of the queues.

Data is passed in a serialized form --- UTF16 text in JSON format. All I/O occurs in the native environment. This means any storage or networking request initiated by the JavaScript code must go across the bridge, and the resulting data must then be serialized and sent back across the bridge in the other direction. This works fine for small pieces of data, but it is expensive once the data sizes or the message counts grow. 

One way to mitigate this bottleneck is to avoid passing large pieces of data across the bridge. If it doesn't require processing within the JavaScript environment, leave it on the native side. It can be represented as a "handle" within the JavaScript code. This is how we handle all images, sounds, and complex animation definitions. 


### Cooperative Multitasking
JavaScript runs on a single thread. If your app's JavaScript code runs for long periods of time, it blocks execution of event handlers, message handlers, etc., and the app will feel non-responsive. If you need to do a long-running operation, you have several options:
1. Implement it as a native module and run it on a separate thread (applicable only to React Native).
2. Break the operation into smaller blocks and execute them as chained tasks.
3. Compute only the portion of the result that is needed at the time.


### Virtualization
When dealing with long lists of data that appear within a user interface, it is important to use some form of virtualization. A virtualized view renders only the visible contents. As the user scrolls through the list, newly-disclosed items are rendered. We looked at all of the available virtualized views, but we didn't find any that provided both the speed and flexibility that we needed, so we ended up writing our own implementation. Our [VirtualListView](https://microsoft.github.io/reactxp/docs/extensions/virtuallistview.html) went through six major iterations before we landed on a design and implementation that we were happy with.


### Launching Your Startup
App startup time is perhaps the biggest performance challenge with React Native apps. This is especially true on slower Android devices. We continue to struggle to reduce the startup times on such devices. Here are several tips that we learned along the way.

#### Defer Module Initialization
In TypeScript or JavaScript code, it's common practice to include a bunch of import statements at the top of each module. For example, here's what you'll find at the top of the App.tsx file in the hello-world sample.
```
import RX = require('reactxp');
import MainPanel = require('./MainPanel');
import SecondPanel = require('./SecondPanel');
```

Each of these "require" calls initializes the specified module the first time it's encountered. A reference to that module is then cached, so subequent calls to "require" the same module are almost free. At startup time, the first module requires several other modules, each of which requires several other modules, etc. This continues until the entire tree of module dependencies have been initialized. This all occurs before the first line of your first module executes. As the number of modules within your app increases, the initialization time increases. 

The way to fix this problem is through deferred initialization. Why pay the cost of initializing a module for some seldom-used UI panel at startup? Just defer its initialization until it is needed. To do this, we make use of a babel plugin created by Facebook called [inline-requires](https://github.com/facebook/fbjs/blob/master/packages/babel-preset-fbjs/plugins/inline-requires.js). Just download the script and create a ".babelrc" file that looks something like this:
```
{
   "presets": ["react-native"],
   "plugins": ["./build/inline-requires.js"]
}
```

What does this script do? It eliminates the require calls at the top of your modules. Whenever the imported variable is used within the file, it inserts a call to require. This means all modules are initialized immediately before their first use rather than at app startup time. For large apps, this can shave seconds from the app's startup time on slower devices.

#### Minification
For production builds, it's important to "minify" your JavaScript. This process eliminates extraneous whitespace and shortens variable and method names where possible. It reduces the size of your JavaScript bundle on disk and in memory and speeds up parsing of your code.


#### Native Module Initialization
React Native includes a number of built-in "native modules". These provide functionality that you can invoke from JavaScript. Many apps will not make use of all of the default native modules. Each native module can add tens of milliseconds to the app initialization time, so it's wasteful to initialize native modules that your app won't use. On Android, you can eliminate this overhead by creating a subclass of [MainReactPackage](https://github.com/facebook/react-native/blob/master/ReactAndroid/src/main/java/com/facebook/react/shell/MainReactPackage.java) that is specific to your app. Copy the createViewManagers() method into your subclass and comment out the view managers that you don't use. Then change the getPackages() method within your app's ReactInstanceHost class to instantiate your custom class rather than the normal MainReactPackage. This technique can shave 100ms or more off the startup time on slow Android devices.


### Additional Resources
For additional tips on performance tuning, refer to the [Performance](https://facebook.github.io/react-native/docs/performance.html) page on Facebook's React Native documentation site. [This blog](https://code.facebook.com/posts/895897210527114/) also contains useful tips.
