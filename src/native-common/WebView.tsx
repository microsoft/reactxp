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

export class WebView extends RX.ViewBase<Types.WebViewProps, {}> implements RX.WebView {
    private _mountedComponent: RN.WebView|null = null;

    render() {
        let styles = [_styles.webViewDefault, this.props.style];

        return (
            <RN.WebView
                ref={ this._onMount }
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

    protected _onMount = (component: RN.ReactNativeBaseComponent<any, any>|null) => {
        this._mountedComponent = component as RN.WebView;
    }

    postMessage(message: string, targetOrigin: string = '*') {
        // Not Implemented...
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
