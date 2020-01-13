/*
 * Types.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Type definitions to support the plugin.
 */

import { Component as ReactComponent } from 'react';
import { Types as RXTypes } from 'reactxp';

export interface WebViewNavigationState {
    canGoBack: boolean;
    canGoForward: boolean;
    loading: boolean;
    url: string;
    title: string;
    readonly navigationType: 'click' | 'formsubmit' | 'backforward' | 'reload' | 'formresubmit' | 'other';
}

export interface WebViewErrorState extends WebViewNavigationState {
    description: string;
    domain: string;
    code: string;
}

export enum WebViewSandboxMode {
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
    AllowMixedContentAlways = 1 << 10,
    AllowMixedContentCompatibilityMode = 1 << 11
}

export interface WebViewSource {
    html: string;
    baseUrl?: string;
}

export interface WebViewShouldStartLoadEvent {
    url: string;
}

export interface WebViewNavigationEvent extends RXTypes.SyntheticEvent {
    nativeEvent: WebViewNavigationState;
}

export interface WebViewErrorEvent extends RXTypes.SyntheticEvent {
    nativeEvent: WebViewErrorState;
}

export interface WebViewMessageEvent extends RXTypes.SyntheticEvent {
    data: string;
    origin: string;
}

export interface WebViewProps extends RXTypes.CommonStyledProps<RXTypes.ViewStyleRuleSet, WebView> {
    url?: string;
    source?: WebViewSource;
    headers?: Headers;
    onLoad?: (e: RXTypes.SyntheticEvent) => void;
    onNavigationStateChange?: (navigationState: WebViewNavigationState) => void;
    scalesPageToFit?: boolean;
    injectedJavaScript?: string;
    javaScriptEnabled?: boolean;
    mediaPlaybackRequiresUserAction?: boolean;
    allowsInlineMediaPlayback?: boolean;

    // Native only
    startInLoadingState?: boolean;
    domStorageEnabled?: boolean;
    onShouldStartLoadWithRequest?: (shouldStartLoadEvent: WebViewShouldStartLoadEvent) => boolean;
    onLoadStart?: (e: RXTypes.SyntheticEvent) => void;
    onError?: (e: RXTypes.SyntheticEvent) => void;
    onMessage?: (e: WebViewMessageEvent) => void;

    // Web only; overrides javaScriptEnabled if used
    sandbox?: WebViewSandboxMode;
}

export abstract class WebView extends ReactComponent<WebViewProps, RXTypes.Stateless> {
    abstract postMessage(message: string, targetOrigin?: string): void;
    abstract reload(): void;
    abstract goBack(): void;
    abstract goForward(): void;
}
