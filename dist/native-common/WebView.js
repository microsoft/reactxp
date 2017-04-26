/**
* WebView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* A control that allows the display of an independent web page.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var RN = require("react-native");
var RX = require("../common/Interfaces");
var Styles_1 = require("./Styles");
var _styles = {
    webViewDefault: Styles_1.default.createWebViewStyle({
        flex: 1,
        alignSelf: 'stretch'
    })
};
var WEBVIEW_REF = 'webview';
var WebView = (function (_super) {
    __extends(WebView, _super);
    function WebView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebView.prototype.render = function () {
        var styles = Styles_1.default.combine(_styles.webViewDefault, this.props.style);
        return (React.createElement(RN.WebView, { ref: WEBVIEW_REF, style: styles, onNavigationStateChange: this.props.onNavigationStateChange, onShouldStartLoadWithRequest: this.props.onShouldStartLoadWithRequest, source: { uri: this.props.url, headers: this.props.headers }, onLoad: this.props.onLoad, startInLoadingState: this.props.startInLoadingState, javaScriptEnabled: this.props.javaScriptEnabled, injectedJavaScript: this.props.injectedJavaScript, domStorageEnabled: this.props.domStorageEnabled, scalesPageToFit: this.props.scalesPageToFit, onError: this.props.onError, onLoadStart: this.props.onLoadStart }));
    };
    WebView.prototype.reload = function () {
        var webView = this.refs[WEBVIEW_REF];
        if (webView) {
            webView.reload();
        }
    };
    WebView.prototype.goBack = function () {
        var webView = this.refs[WEBVIEW_REF];
        if (webView) {
            webView.goBack();
        }
    };
    WebView.prototype.goForward = function () {
        var webView = this.refs[WEBVIEW_REF];
        if (webView) {
            webView.goForward();
        }
    };
    return WebView;
}(RX.WebView));
exports.WebView = WebView;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WebView;
