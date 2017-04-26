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
var ReactDOM = require("react-dom");
var RX = require("../common/Interfaces");
var Styles_1 = require("./Styles");
var Types = require("../common/Types");
var View_1 = require("./View");
var _styles = {
    webViewDefault: Styles_1.default.createWebViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        borderStyle: 'none'
    }),
    webViewContainer: Styles_1.default.createViewStyle({
        flexDirection: 'column',
        flex: 1,
        alignSelf: 'stretch'
    })
};
var WebView = (function (_super) {
    __extends(WebView, _super);
    function WebView(props) {
        var _this = _super.call(this, props) || this;
        _this._onLoad = function (e) {
            if (_this.props.onLoad) {
                _this.props.onLoad(e);
            }
        };
        _this._sandboxToStringValue = function (sandbox) {
            var values = [];
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
        };
        _this.state = {
            postComplete: false,
            webFormIdentifier: "form" + WebView._webFrameNumber,
            webFrameIdentifier: "frame" + WebView._webFrameNumber
        };
        WebView._webFrameNumber++;
        return _this;
    }
    WebView.prototype.componentDidMount = function () {
        this._postRender();
    };
    WebView.prototype.componentDidUpdate = function (prevProps, prevState) {
        this._postRender();
    };
    WebView.prototype._postRender = function () {
        if (!this.state.postComplete) {
            this.setState({
                postComplete: true
            });
        }
    };
    WebView.prototype.render = function () {
        var styles = Styles_1.default.combine(_styles.webViewDefault, this.props.style);
        var sandbox = this.props.sandbox !== undefined
            ? this.props.sandbox
            : (this.props.javaScriptEnabled ? Types.WebViewSandboxMode.AllowScripts : Types.WebViewSandboxMode.None);
        // width 100% is needed for Edge - it doesn't grow iframe. Resize needs to be done with wrapper
        return (React.createElement(View_1.View, { style: _styles.webViewContainer },
            React.createElement("iframe", { ref: 'iframe', name: this.state.webFrameIdentifier, id: this.state.webFrameIdentifier, style: styles, src: this.props.url, onLoad: this._onLoad, sandbox: this._sandboxToStringValue(sandbox), width: '100%' })));
    };
    WebView.prototype.postMessage = function (message, targetOrigin) {
        if (targetOrigin === void 0) { targetOrigin = '*'; }
        var iframeDOM = ReactDOM.findDOMNode(this.refs['iframe']);
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.postMessage(message, targetOrigin);
        }
    };
    WebView.prototype.reload = function () {
        var iframeDOM = ReactDOM.findDOMNode(this.refs['iframe']);
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.location.reload(true);
        }
    };
    WebView.prototype.goBack = function () {
        var iframeDOM = ReactDOM.findDOMNode(this.refs['iframe']);
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.history.back();
        }
    };
    WebView.prototype.goForward = function () {
        var iframeDOM = ReactDOM.findDOMNode(this.refs['iframe']);
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.history.forward();
        }
    };
    return WebView;
}(RX.WebView));
WebView._webFrameNumber = 1;
exports.WebView = WebView;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WebView;
