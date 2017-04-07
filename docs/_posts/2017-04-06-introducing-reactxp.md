---
title: Introducing ReactXP
author: erictraut
---

The Skype team at Microsoft are happy to announce that we are open sourcing ReactXP, a library that we developed for cross-platform development. It builds upon React JS and React Native, allowing you to create apps that span both web and native with a single code base.  



### History of ReactXP

Skype runs on many platforms --- desktops, laptops, mobile phones, tablets, browsers, and even TVs and cars. Historically, the UI for each Skype client was written from scratch in the "native" language of each platform (Objective C on iOS, Java on Android, HTML and javascript on the web, etc.). About a year ago, we embarked on an effort to reinvent Skype. We decided that we needed to take a fresh approach to client development - one that would maximize our engineering efficiency and agility. We wanted to move away from implementing each new feature multiple times in different code bases. We wanted to minimize duplication of effort. We explored a number of available options. Web wrappers like Cordova (PhoneGap) didn't provide the performance or "native feel" we were looking for. Xamarin, which is a great solution for cross-platform mobile development, didn't help us on the web. We ultimately decided to build our new client on top of React JS and React Native. ReactXP was our attempt to unify the behaviors and interfaces across React JS and the various React Native implementations. (We initially referred to it as ReactX, hence the references to this term within the sources.)

The Skype team also made many contributions to the React Native code base to fix bugs, improve performance, and eliminate behavioral differences between React JS and React Native. The biggest contribution was a major rework of the React Native layout engine. The original implementation loosely followed the W3C flexbox standard, but it differed from the standard in some important ways. The updated layout engine now reliably produces the same layout as all compliant web browsers.



### ReactXP Design Philosophy

ReactXP was designed to be a thin, lightweight cross-platform abstraction layer on top of React and React Native. It implements a dozen or so foundational components that can be used to build more complex components. It also implements a collection of API namespaces that are required by most applications.

ReactXP currently supports the following platforms: web (React JS), iOS (React Native), Android (React Native) and Windows UWP (React Native). Windows UWP is still a work in progress, and some components and APIs are not yet complete.

The ReactXP "core" contains only general-purpose functionality. More specialized cross-platform functionality can be delivered in the form of ReactXP extensions. The Skype team has developed about twenty such extensions, and we plan to open source some of these over time. Extensions allow us to expand ReactXP without increasing its footprint or complexity.

When we were deciding which props and style attributes to expose in ReactXP, we tried to stick with those that could be implemented uniformly on all supported platforms. For example, we don't expose any HTML-specific props or CSS-specific attributes that are not also supported in React Native. In a few cases, we decided to expose select platform-specific props or style attributes and documented them as being "no ops" on other platforms, but this was done only when we could find no other viable workaround.



### Future of ReactXP

The Skype team will continue to maintain and build upon ReactXP. Other teams within Microsoft are also starting to use it and make contributions. Today we are opening it to the broader open source community. We hope that others will find it useful, and we welcome feedback and contributions.

We plan to snap a new version of ReactXP approximately monthly, roughly aligned to React Native releases. 

