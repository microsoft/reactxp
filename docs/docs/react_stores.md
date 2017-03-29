---
id: react_stores
title: Stores & Services
layout: docs
category: Overview
permalink: docs/react_stores.html
next: styles
---

## Stores

React is concerned only with the view layer of your app. It doesn't dictate the data model layer. However, it is common within React apps to refer to the data sources as _stores_. There are many ways that stores can be used, but most of them employ some form of subscription model whereby components register with a store, indicating that they are interested in all or part of the store's data. When the data within a store changes, it notifies all components that have expressed an interest in the change. Components can then update their internal state accordingly, triggering a re-render if appropriate.

## Flux

One popular model for stores and store updates is called _Flux_. It was designed by Facebook engineers for use with React. There are several good tutorials about Flux online. [Here](https://drewdevault.com/2015/07/20/A-practical-understanding-of-Flux.html) is one that we recommend. It is worth noting that Flux is a programming pattern -- a set of principles, not a framework or collection of APIs. You may choose to adopt all or some of the Flux principles.

## ReSub

The Skype team initially adopted the Flux principles, but we found it to be cumbersome. It requires the introduction of a bunch of new classes (dispatchers, action creators, and dispatch events), and program flow becomes difficult to follow and debug. Over time, we abandoned Flux and created a simpler model for stores. It leverages a new language feature in TypeScript (annotations) to automatically create subscriptions between components and stores. This eliminates most of the code involved in subscribing and unsubscribing. This pattern, which we refer to as [ReSub](https://github.com/Microsoft/ReSub), is independent of ReactXP, but they work well together.

