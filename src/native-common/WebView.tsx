/**
* WebView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* A control that allows the display of an independent web page.
*/

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

const WEBVIEW_REF = 'webview';

export class WebView extends RX.ViewBase<Types.WebViewProps, {}> {
    render() {
        let styles = Styles.combine([_styles.webViewDefault, this.props.style]);

        return (
            <RN.WebView
                ref= { WEBVIEW_REF }
                style={ styles }
                onNavigationStateChange={ this.props.onNavigationStateChange }
                onShouldStartLoadWithRequest={ this.props.onShouldStartLoadWithRequest }
                source={ { uri: this.props.url, headers: this.props.headers } }
                onLoad={ this.props.onLoad }
                startInLoadingState={ this.props.startInLoadingState }
                javaScriptEnabled={ this.props.javaScriptEnabled }
                injectedJavaScript={ this.props.injectedJavaScript }
                domStorageEnabled={ this.props.domStorageEnabled }
                scalesPageToFit={ this.props.scalesPageToFit }
                onError={ this.props.onError }
                onLoadStart={ this.props.onLoadStart }
            />
        );
    }

    reload() {
        const webView : RN.WebView = this.refs[WEBVIEW_REF] as RN.WebView;
        if (webView) {
            webView.reload();
        }
    }

    goBack() {
        const webView : RN.WebView = this.refs[WEBVIEW_REF] as RN.WebView;
        if (webView) {
            webView.goBack();
        }
    }
    
    goForward() {
        const webView : RN.WebView = this.refs[WEBVIEW_REF] as RN.WebView;
        if (webView) {
            webView.goForward();
        }
    }
}

export default WebView;
