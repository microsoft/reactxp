/**
 * WebView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * A control that allows the display of an independent web page.
 */

import * as React from 'react';
import * as RN from 'react-native';
import { WebView as RNWebView } from 'react-native-webview';
import {
    WebViewMessageEvent as RNWebViewMessageEvent,
    WebViewSourceHtml as RNWebViewSourceHtml,
    WebViewSourceUri as RNWebViewSourceUri,
} from 'react-native-webview/lib/WebViewTypes';

import * as RX from 'reactxp';

import * as Types from '../common/Types';

const _styles = {
    webViewDefault: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
    }),
};

type MixedContentMode = 'never' | 'always' | 'compatibility' | undefined;

export class WebView extends React.Component<Types.WebViewProps, RX.Types.Stateless> implements Types.WebView {
    private _mountedComponent: RNWebView | undefined;

    render() {
        const styles = [_styles.webViewDefault, this.props.style] as RN.StyleProp<RN.ViewStyle>;
        const source = this._buildSource();
        const injectedJavascript = this._buildInjectedJavascript();

        return (
            <RNWebView
                ref={ this._onMount }
                style={ styles }
                source={ source }
                startInLoadingState={ this.props.startInLoadingState }
                javaScriptEnabled={ this.props.javaScriptEnabled }
                allowsInlineMediaPlayback={ this.props.allowsInlineMediaPlayback }
                mediaPlaybackRequiresUserAction={ this.props.mediaPlaybackRequiresUserAction }
                injectedJavaScript={ injectedJavascript }
                domStorageEnabled={ this.props.domStorageEnabled }
                scalesPageToFit={ this.props.scalesPageToFit }
                onNavigationStateChange={ this.props.onNavigationStateChange }
                onShouldStartLoadWithRequest={ this.props.onShouldStartLoadWithRequest }
                onLoadStart={ this.props.onLoadStart }
                onLoad={ this.props.onLoad }
                onError={ this.props.onError }
                onMessage={ this.props.onMessage ? this._onMessage : undefined }
                testID={ this.props.testId }
                mixedContentMode={ this._sandboxToMixedContentMode(this.props.sandbox) }
            />
        );
    }

    private _sandboxToMixedContentMode(sandbox?: Types.WebViewSandboxMode): MixedContentMode {
        if (sandbox) {
            if (sandbox & Types.WebViewSandboxMode.AllowMixedContentAlways) {
                return 'always';
            }

            if (sandbox & Types.WebViewSandboxMode.AllowMixedContentCompatibilityMode) {
                return 'compatibility';
            }
        }
        return 'never';
    }

    protected _onMount = (component: RNWebView | null) => {
        this._mountedComponent = component || undefined;
    };

    protected _onMessage = (e: RNWebViewMessageEvent) => {
        if (this.props.onMessage) {
            const event: Types.WebViewMessageEvent = {
                defaultPrevented: e.defaultPrevented,
                nativeEvent: e.nativeEvent,
                cancelable: e.cancelable,
                timeStamp: e.timeStamp,
                bubbles: e.bubbles,
                origin: '*',
                data: e.nativeEvent.data,
                stopPropagation: () => e.stopPropagation(),
                preventDefault: () => e.preventDefault(),
            };

            this.props.onMessage(event);
        }
    };

    private _buildSource(): RNWebViewSourceUri | RNWebViewSourceHtml | undefined {
        const { headers, source, url } = this.props;

        if (url) {
            return { headers, uri: url };
        }

        if (source) {
            return source;
        }

        return undefined;
    }

    private _buildInjectedJavascript(): string {
        // Keep compatibility with old code that uses window.postMessage. For more information,
        // see https://github.com/react-native-community/react-native-webview/releases/tag/v5.0.0
        let injectedJavascript = `
            // WebView -> Native
            (function() {
                if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                    window.postMessage = function(data) {
                        window.ReactNativeWebView.postMessage(data);
                    };
                }
            })();

            // Native -> WebView
            (function() {
                window.postMessageFromReactXP = function(message) {
                    var event;
                    try {
                        event = new MessageEvent('message', { data: message });
                    } catch (e) {
                        event = document.createEvent('MessageEvent');
                        event.initMessageEvent('message', true, true, data.data, data.origin, data.lastEventId, data.source);
                    }
                    document.dispatchEvent(event);
                };
            })();`;

        if (this.props.injectedJavaScript !== undefined) {
            injectedJavascript += this.props.injectedJavaScript;
        }

        // End the injectedJavascript with 'true;' or else you'll sometimes get silent failures
        injectedJavascript += ';true;';

        return injectedJavascript;
    }

    postMessage(message: string, targetOrigin = '*') {
        if (this._mountedComponent) {
            this._mountedComponent.injectJavaScript(`window.postMessageFromReactXP('${message}');`);
        }
    }

    reload() {
        if (this._mountedComponent) {
            this._mountedComponent.reload();
        }
    }

    goBack() {
        if (this._mountedComponent) {
            this._mountedComponent.goBack();
        }
    }

    goForward() {
        if (this._mountedComponent) {
            this._mountedComponent.goForward();
        }
    }
}

export default WebView;
