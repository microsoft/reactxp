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
import {
    WebView as RNWebView,
    WebViewProps as RNWebViewProps
} from 'react-native-webview';
import {
    WebViewMessageEvent as RNWebViewMessageEvent,
    WebViewSourceHtml as RNWebViewSourceHtml,
    WebViewSourceUri as RNWebViewSourceUri
} from 'react-native-webview/lib/WebViewTypes';

import * as RX from '../common/Interfaces';

import Styles from './Styles';

const _styles = {
    webViewDefault: Styles.createWebViewStyle({
        flex: 1,
        alignSelf: 'stretch'
    })
};

type MixedContentMode = 'never' | 'always' | 'compatibility' | undefined;

export class WebView extends React.Component<RX.Types.WebViewProps, RX.Types.Stateless> implements RX.WebView {
    private _mountedComponent: RNWebView | undefined;

    render() {
        const styles = [_styles.webViewDefault, this.props.style] as RN.StyleProp<RN.ViewStyle>;
        const source = this._buildSource();

        // Force use of webkit on iOS (applies to RN 0.57 and newer only).
        const extendedProps: RNWebViewProps = {
            useWebKit: true
        };

        // Keep compatibility with old code that uses window.postMessage. For more information,
        // see https://github.com/react-native-community/react-native-webview/releases/tag/v5.0.0
        const injectedJavascript = `
        // WebView -> Native
        (function() {
            window.postMessage = function(data) {
                window.ReactNativeWebView.postMessage(data);
            };
        })();

        // Native -> WebView
        function postMessageFromReactXP(message) {
            var event;
            try {
                event = new MessageEvent('message', { data: message });
            } catch (e) {
                event = document.createEvent('MessageEvent');
                event.initMessageEvent('message', true, true, data.data, data.origin, data.lastEventId, data.source);
            }
            document.dispatchEvent(event);
        };`;

        return (
            <RNWebView
                ref={ this._onMount }
                style={ styles }
                source={ source }
                startInLoadingState={ this.props.startInLoadingState }
                javaScriptEnabled={ this.props.javaScriptEnabled }
                allowsInlineMediaPlayback={ this.props.allowsInlineMediaPlayback }
                mediaPlaybackRequiresUserAction={ this.props.mediaPlaybackRequiresUserAction }
                injectedJavaScript={ injectedJavascript + this.props.injectedJavaScript }
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
                { ...extendedProps }
            />
        );
    }

    private _sandboxToMixedContentMode(sandbox?: RX.Types.WebViewSandboxMode): MixedContentMode {
        if (!!sandbox) {
            if (sandbox & RX.Types.WebViewSandboxMode.AllowMixedContentAlways) {
                return 'always';
            }

            if (sandbox & RX.Types.WebViewSandboxMode.AllowMixedContentCompatibilityMode) {
                return 'compatibility';
            }
        }
        return 'never';
    }

    protected _onMount = (component: RNWebView | null) => {
        this._mountedComponent = component || undefined;
    }

    protected _onMessage = (e: RNWebViewMessageEvent) => {
        if (this.props.onMessage) {
            const event: RX.Types.WebViewMessageEvent = {
                defaultPrevented: e.defaultPrevented,
                nativeEvent: e.nativeEvent,
                cancelable: e.cancelable,
                timeStamp: e.timeStamp,
                bubbles: e.bubbles,
                origin: '*',
                data: e.nativeEvent.data,
                stopPropagation: () => e.stopPropagation(),
                preventDefault: () => e.preventDefault()
            };

            this.props.onMessage(event);
        }
    }

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

    postMessage(message: string, targetOrigin = '*') {
        if (this._mountedComponent) {
            this._mountedComponent.injectJavaScript(`postMessageFromReactXP('${message}');`);
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
