/**
* WebView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* A control that allows the display of an independent web page.
*/

import _ = require('./lodashMini');
import React = require('react');
import RN = require('react-native');

import RX = require('../common/Interfaces');
import Styles from './Styles';
import Types = require('../common/Types');

const _styles = {
    webViewDefault: Styles.createWebViewStyle({
        flex: 1,
        alignSelf: 'stretch'
    })
};

export class WebView extends React.Component<Types.WebViewProps, Types.Stateless> implements RX.WebView {
    private _mountedComponent: any;

    render() {
        const styles = [_styles.webViewDefault, this.props.style] as RN.StyleProp<RN.ViewStyle>;
        const source = this._buildSource();

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
            />
        );
    }

    protected _onMount = (component: any) => {
        this._mountedComponent = component;
    }

    protected _onMessage = (e: RN.NativeSyntheticEvent<RN.WebViewMessageEventData>) => {
        if (this.props.onMessage) {
            // Clone the original event because RN reuses events.
            let event: RX.Types.WebViewMessageEvent = _.clone(e) as any;

            // Add the data element.
            event.data = e.nativeEvent.data;
            event.origin = '*';

            event.stopPropagation = () => {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
            };

            event.preventDefault = () => {
                if (e.preventDefault) {
                    e.preventDefault();
                }
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
