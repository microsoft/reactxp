---
id: components/webview
title: WebView
layout: docs
category: Components
permalink: docs/components/webview.html
next: apis/alert
---

This component displays HTML contents in an embedded browser control.

## Classes
``` javascript
interface WebViewNavigationState {
    canGoBack: boolean;
    canGoForward: boolean;
    loading: boolean;
    url: string;
    title: string;
}

interface WebViewErrorState {
    description: string;
    domain: string;
    code: string;
}
```

## Props
``` javascript
// Allow javascript code to call storage methods?
domStorageEnabled: boolean = true; // Native only

// JavaScript code that is injected into the control and executed
injectedJavaScript: string = undefined;

// Is JavaScript executed within the control?
javaScriptEnabled: boolean = true;

// HTTP headers to include when fetching the URL.
headers: { [headerName: string]: string } = undefined;

// Called when an error occurs that prevents the contents from loading
onError: (e: SyntheticEvent) => void = undefined; // Native only

// Called when the contents successfully load
onLoad: (e: SyntheticEvent) => void = undefined;

// Called when the contents start to load
onLoadStart: (e: SyntheticEvent) => void = undefined; // Native only

// Called when the navigation state changes
onNavigationStateChange: (navigationState: WebViewNavigationState) => void;

// Flags that restrict behaviors within the control
sandbox: WebViewSandboxMode = None; // Web only

// Zooms the page contents to fit the available space
scalesPageToFit: boolean = false;

// Start loading immediately or wait for reload?
startInLoadingState: boolean = true; // Native only

// See below for supported styles
style: WebViewStyleRuleSet | WebViewStyleRuleSet[] = [];

// URL to HTML content
url: string = undefined;
```

## Styles
No specialized styles

## Methods
``` javascript
// Navigate back and forward
goBack();
goForward();

// Posts a message to the web control, allowing for communication between
// the app and the JavaScript code running within the web control
// Available only on web
postMessage(message: string, targetOrigin?: string = '*'): void;

// Force the page to reload
reload();
```




