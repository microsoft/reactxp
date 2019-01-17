---
id: components/webview
title: WebView
layout: docs
category: Components
permalink: docs/components/webview.html
next: apis/alert
---

This component displays HTML contents in an embedded browser control.

To limit the functionality of the browser control, specify one or more sandbox options. For detailed definitions of sandbox flags, refer to the [HTML documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe).


## Types
``` javascript
enum WebViewSandboxMode {
    None = 0,
    AllowForms = 1 << 0,
    AllowModals = 1 << 1,
    AllowOrientationLock = 1 << 2,
    AllowPointerLock = 1 << 3,
    AllowPopups = 1 << 4,
    AllowPopupsToEscapeSandbox = 1 << 5,
    AllowPresentation = 1 << 6,
    AllowSameOrigin = 1 << 7,
    AllowScripts = 1 << 8,
    AllowTopNavigation = 1 << 9,

    // Control https mixed content behavior, never by default
    AllowMixedContentAlways = 1 << 10,
    AllowMixedContentCompatibilityMode = 1 << 11
}

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

interface WebViewSource {
    html: string;
    baseUrl?: string; // Native only
}
```

## Props
``` javascript
// Allow javascript code to call storage methods?
domStorageEnabled: boolean = true; // Native only

// JavaScript code that is injected into the control and executed
injectedJavaScript: string = undefined; // Native only

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

// Called when a message is posted from within a WebView
onMessage: (e: WebViewMessageEvent) => void = undefined;

// Called when the navigation state changes
onNavigationStateChange: (navigationState: WebViewNavigationState) => void;

// Flags that restrict behaviors within the control
sandbox: WebViewSandboxMode = None;

// Zooms the page contents to fit the available space; deprecated on
// iOS in RN 0.57
scalesPageToFit: boolean = false; // Native only

// HTML to display in webview (if url is not specified)
source: WebViewSource = undefined;

// Start loading immediately or wait for reload?
startInLoadingState: boolean = true; // Native only

// See below for supported styles
style: WebViewStyleRuleSet | WebViewStyleRuleSet[] = [];

// ID that can be used to identify the instantiated element for testing purposes.
testId: string = undefined;

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
// the app and the JavaScript code running within the web control. On native
// platforms, the targetOrigin is ignored.
postMessage(message: string, targetOrigin?: string = '*'): void;

// Force the page to reload
reload();
```

