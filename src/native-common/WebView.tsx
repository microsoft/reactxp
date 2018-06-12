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
        let styles = [_styles.webViewDefault, this.props.style];
        let source: any = this.props.source;
        if (this.props.url) {
            source = {
                uri: this.props.url,
                headers: this.props.headers
            };
        }

        return (
            <RN.WebView
                ref={ this._onMount }
                style={ styles as RN.StyleProp<RN.ViewStyle> }
                onNavigationStateChange={ this.props.onNavigationStateChange }
                onShouldStartLoadWithRequest={ this.props.onShouldStartLoadWithRequest }
                source={ source }
                onLoad={ this.props.onLoad }
                startInLoadingState={ this.props.startInLoadingState }
                javaScriptEnabled={ this.props.javaScriptEnabled }
                injectedJavaScript={ this.props.injectedJavaScript }
                domStorageEnabled={ this.props.domStorageEnabled }
                scalesPageToFit={ this.props.scalesPageToFit }
                onError={ this.props.onError }
                onLoadStart={ this.props.onLoadStart }
                onMessage={ this.props.onMessage ? this._onMessage : undefined }
            />
        );
    }

    protected _onMount = (component: any) => {
        this._mountedComponent = component;
    }

    protected _onMessage = (e: RN.NativeSyntheticEvent<any>) => {
        if (this.props.onMessage) {
            // Clone the original event because RN reuses events.
            let event: RX.Types.WebViewMessageEvent = _.clone(e) as any;

            // Add the data element.
            event.data = (e.nativeEvent as any).data;
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
