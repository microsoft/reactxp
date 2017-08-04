/**
* WebView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* A control that allows the display of an independent web page.
*/

import React = require('react');
import ReactDOM = require('react-dom');

import RX = require('../common/Interfaces');
import Styles from './Styles';
import Types = require('../common/Types');
import { View } from './View';

let _styles = {
    webViewDefault: Styles.createWebViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        borderStyle: 'none'
    }),
    webViewContainer: Styles.createViewStyle({
        flexDirection: 'column',
        flex: 1,
        alignSelf: 'stretch'
    })
};

export interface WebViewState {
    postComplete?: boolean;
    webFormIdentifier?: string;
    webFrameIdentifier?: string;
}

export class WebView extends RX.ViewBase<Types.WebViewProps, WebViewState> {
    private static _webFrameNumber = 1;

    constructor(props: Types.WebViewProps) {
        super(props);

        this.state = {
            postComplete: false,
            webFormIdentifier: `form${WebView._webFrameNumber}`,
            webFrameIdentifier: `frame${WebView._webFrameNumber}`
        };

        WebView._webFrameNumber++;
    }

    componentDidMount() {
        this._postRender();
    }

    componentDidUpdate(prevProps: Types.WebViewProps, prevState: WebViewState) {
        this._postRender();
    }

    private _postRender() {
        if (!this.state.postComplete) {
            this.setState({
                postComplete: true
            });
        }
    }

    render() {
        let styles = Styles.combine([_styles.webViewDefault, this.props.style]);
        let sandbox = this.props.sandbox !== undefined
            ? this.props.sandbox
            : (this.props.javaScriptEnabled ? Types.WebViewSandboxMode.AllowScripts : Types.WebViewSandboxMode.None);

        // width 100% is needed for Edge - it doesn't grow iframe. Resize needs to be done with wrapper
        return (
            <View style={ _styles.webViewContainer }>
                <iframe
                    ref='iframe'
                    name={ this.state.webFrameIdentifier }
                    id={ this.state.webFrameIdentifier }
                    style={ styles }
                    src={ this.props.url }
                    onLoad={ this._onLoad }
                    sandbox={ this._sandboxToStringValue(sandbox) }
                    width='100%'
                />
            </View>
        );
    }

    private _onLoad = (e: Types.SyntheticEvent) => {
        if (this.props.onLoad) {
            this.props.onLoad(e);
        }
    }

    private _sandboxToStringValue = (sandbox: Types.WebViewSandboxMode) => {
        let values: string[] = [];

        if (sandbox & Types.WebViewSandboxMode.AllowForms) {
            values.push('allow-forms');
        }
        if (sandbox & Types.WebViewSandboxMode.AllowModals) {
            values.push('allow-modals');
        }
        if (sandbox & Types.WebViewSandboxMode.AllowOrientationLock) {
            values.push('allow-orientation-lock');
        }
        if (sandbox & Types.WebViewSandboxMode.AllowPointerLock) {
            values.push('allow-pointer-lock');
        }
        if (sandbox & Types.WebViewSandboxMode.AllowPopups) {
            values.push('allow-popups');
        }
        if (sandbox & Types.WebViewSandboxMode.AllowPopupsToEscapeSandbox) {
            values.push('allow-popups-to-escape-sandbox');
        }
        if (sandbox & Types.WebViewSandboxMode.AllowPresentation) {
            values.push('allow-presentation');
        }
        if (sandbox & Types.WebViewSandboxMode.AllowSameOrigin) {
            values.push('allow-same-origin');
        }
        if (sandbox & Types.WebViewSandboxMode.AllowScripts) {
            values.push('allow-scripts');
        }
        if (sandbox & Types.WebViewSandboxMode.AllowTopNavigation) {
            values.push('allow-top-navigation');
        }

        return values.join(' ');
    }

    postMessage(message: string, targetOrigin: string = '*') {
        const iframeDOM = ReactDOM.findDOMNode<HTMLFrameElement>(this.refs['iframe']);
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.postMessage(message, targetOrigin);
        }
    }

    reload() {
        const iframeDOM = ReactDOM.findDOMNode<HTMLFrameElement>(this.refs['iframe']);
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.location.reload(true);
        }
    }

    goBack() {
        const iframeDOM = ReactDOM.findDOMNode<HTMLFrameElement>(this.refs['iframe']);
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.history.back();
        }
    }

    goForward() {
        const iframeDOM = ReactDOM.findDOMNode<HTMLFrameElement>(this.refs['iframe']);
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.history.forward();
        }
    }
}

export default WebView;
