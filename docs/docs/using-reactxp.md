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

## Tips for Native

The main module is assumed to be called "RXApp", and it must be registered as such by the native code. Refer to the sample app for how to register the module in Android and iOS.

## TypeScript Support

ReactXP is written in TypeScript and includes TypeScript type definition (".d.ts") files for the library.

## TSLint Support

ReactXP includes several [tslint](https://www.npmjs.com/package/tslint) custom rules that can be used in your project.

To use these rules, modify your tslint.json file to point to the rules within the reactxp dist directory, as follows.

```
    "rulesDirectory": [
        "./node_modules/reactxp/dist/tslint"
    ]
```

The following tslint rules are provided:

### grouped-import
This rule enforces that all ambient (non-relative) module imports are grouped together and are above the group of relative imports.

### incorrect-this-props
This rule checks for common errors in referencing ```this.props``` within methods that pass ```props``` as an input parameter.

### no-unreferenced-styles
This rule detects and reports any unreferenced entries within a ```_styles``` array.
