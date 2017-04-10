---
id: faq
title: Frequently Asked Questions
layout: docs
category: Overview
permalink: docs/faq.html
next: react_concepts
---

### What platforms does ReactXP support?

ReactXP currently supports the following platforms:
* iOS (React Native)
* Android (React Native)
* Web (React)
* Windows 10 -- UWP (React Native) - in progress

Other platforms such as Windows 7 & 8, MacOS, and Linux can be targeted using a web wrapper solution like [Electron](https://electron.atom.io/).


### What browsers does ReactXP support?

We've tested ReactXP with recent versions of the following browsers:
* Chrome (Windows and Mac)
* Internet Explorer (9 and newer)
* Edge
* Firefox

Other HTML5 browsers should theoretically work as well.


### Can I use ReactXP without TypeScript?

Yes, you can write your application's code in JavaScript or any language that compiles to JavaScript (TypeScript, Flow, etc.). ReactXP is implemented in TypeScript, and the distribution includes TypeScript type definitions for the ReactXP interface.


### How does ReactXP relate to React Native?

ReactXP builds upon React Native. ReactXP's components and APIs are inspired by React Native --- and in most cases are the same as React Native. ReactXP generally exposes APIs, props, style attributes, and animation interfaces that are common to the React Native implementations on iOS and Android (as well as the nascent implementation on Windows). It also implements these same APIs, props, style attributes, and animation interfaces on the web.

ReactXP is neither a proper subset nor a proper superset of React Native. It doesn't expose every component provided by React Native. In particular, it doesn't expose any components that are platform-specific (such as PickerIOS or MapView). It also exposes some components and APIs that are not implemented in React Native, such as [GestureView](components/gestureview.html) and [UserPresence](apis/userpresence.html).

Apps that use ReactXP can directly access React Native components and APIs. They can also directly access React DOM elements on the web. But such code will need to include build-time or run-time conditionals to avoid using these components or APIs on platforms where they don't apply. 

All components and APIs exposed through ReactXP are implemented for all supported platforms. In some cases, API calls are no-ops, but they are guaranteed to be implemented. For example, Input.backButtonEvent is a no-op on iOS and the web, and StatusBar APIs are no-ops on the web. Apps that use only ReactXP abstractions can generally avoid per-platform conditional checks.


### How does ReactXP differ from React Native for Web?

[React Native for Web](https://github.com/necolas/react-native-web) is an open-sourced library developed by engineers at Twitter. We started implementing ReactXP before React Native for Web was available.

The goals behind these two efforts are similar, but the approaches differ. ReactXP is a layer that sits on top of React Native and React, whereas React Native for Web is a parallel implementation of React Native --- a sibling to React Native for iOS and Android.

ReactXP generally exposes only those props, style attributes, and APIs that are available across all platforms. If you write to ReactXP's abstraction, you can have high confidence that it will run on all supported platforms in the same manner. The same can be achieved with React Native for Web/iOS/Android, but you need to be more careful about which components, props, and APIs you use.

One of our goals in writing ReactXP was to enable developers to write and debug code in whatever platform environment they felt most comfortable while having confidence that the resulting code would run the same on other platforms.


### How does ReactXP differ from Xamarin?

[Xamarin](https://www.xamarin.com/) is a cross-platform solution that allows developers to create apps on iOS, Android and Windows Phone using a single code base. Xamarin apps are written in C# and XAML, allowing .NET developers to leverage their skills and experience. Xamarin apps can be more efficient than React Native apps, which are limited by JavaScript performance and the overhead of the React Native bridge. Xamarin was acquired by Microsoft in early 2016 and is supported by a dedicated team of engineers. It offers a comprehensive development solution including tools for coding, debugging, performance analysis, builds, automated testing, and distribution.

ReactXP, unlike Xamarin, provides a way to create mobile apps _and_ web apps using the same source base. ReactXP (like React and React Native) allow experienced web developers to make use of their existing skills and knowledge. ReactXP was developed by the Skype team at Microsoft in support of their development needs. ReactXP builds upon the work of Facebook and the broader React open source community.

Both Xamarin and ReactXP are great solutions, but they solve somewhat different problems.

