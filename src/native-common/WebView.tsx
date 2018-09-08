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
import * as RX from '../common/Interfaces';
import Types = require('../common/Types');

import Styles from './Styles';

const _styles = {
    webViewDefault: Styles.createWebViewStyle({
        flex: 1,
        alignSelf: 'stretch'
    })
};

type MixedContentMode = 'never' | 'always' | 'compatibility' | undefined;

export class WebView extends React.Component<RX.Types.WebViewProps, RX.Types.Stateless> implements RX.WebView {
    private _mountedComponent: RN.WebView | null = null;

    render() {
        const styles = [_styles.webViewDefault, this.props.style] as RN.StyleProp<RN.ViewStyle>;
        const source = this._buildSource();

        // Force use of webkit on iOS (applies to RN 0.57 and newer only).
        let extendedProps: RN.ExtendedWebViewProps = {
            useWebKit: true
        };

        return (
            <RN.WebView
                ref={ this._onMount }
                style={ styles }
                source={ source }
                startInLoadingState={ this.props.startInLoadingState }
                javaScriptEnabled={ this.props.javaScriptEnabled }
                injectedJavaScript={ this.props.injectedJavaScript }
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

    private _sandboxToMixedContentMode(sandbox?: Types.WebViewSandboxMode): MixedContentMode {
        if (!!sandbox) {
            if (sandbox & Types.WebViewSandboxMode.AllowMixedContentAlways) {
                return 'always';
            }

            if (sandbox & Types.WebViewSandboxMode.AllowMixedContentCompatibilityMode) {
                return 'compatibility';
            }
        }
        return 'never';
    }

    protected _onMount = (component: RN.WebView) => {
        this._mountedComponent = component;
    }

    protected _onMessage = (e: RN.NativeSyntheticEvent<RN.WebViewMessageEventData>) => {
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
                preventDefault: () => e.preventDefault(),
            };

            this.props.onMessage(event);
        }
    }

    private _buildSource(): RN.WebViewUriSource | RN.WebViewHtmlSource | undefined {
        const { headers, source, url } = this.props;

        if (url) {
            return { headers, uri: url };
        }

        if (source) {
            return source;
        }

        return undefined;
    }

    postMessage(message: string, targetOrigin: string = '*') {
        if (this._mountedComponent) {
            this._mountedComponent.postMessage(message);
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
