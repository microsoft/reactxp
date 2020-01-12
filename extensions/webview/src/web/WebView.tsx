/**
 * WebView.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * A control that allows the display of an independent web page.
 */

import * as React from 'react';
import * as RX from 'reactxp';

import * as Types from '../common/Types';

const _styles = {
    webViewDefault: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        borderStyle: 'none',
    }),
    webViewContainer: RX.Styles.createViewStyle({
        flexDirection: 'column',
        flex: 1,
        alignSelf: 'stretch',
    }),
};

export interface WebViewState {
    postComplete?: boolean;
    webFormIdentifier?: string;
    webFrameIdentifier?: string;
}

interface WebViewMessageEventInternal extends Types.WebViewMessageEvent {
    __propagationStopped: boolean;
}

export class WebView extends React.Component<Types.WebViewProps, WebViewState> implements Types.WebView {
    private static _webFrameNumber = 1;
    private static _onMessageReceived: RX.Types.SubscribableEvent<(e: WebViewMessageEventInternal) => void>;
    private static _messageListenerInstalled = false;

    private _mountedComponent: HTMLIFrameElement | null = null;
    private _onMessageReceivedToken: RX.Types.SubscriptionToken | undefined;

    constructor(props: Types.WebViewProps) {
        super(props);

        this.state = {
            postComplete: false,
            webFormIdentifier: `form${WebView._webFrameNumber}`,
            webFrameIdentifier: `frame${WebView._webFrameNumber}`,
        };

        WebView._webFrameNumber++;
    }

    componentDidMount() {
        this._postRender();

        const customContents = this._getCustomHtml(this.props);
        if (customContents) {
            this._setContents(customContents);
        }
    }

    componentDidUpdate(prevProps: Types.WebViewProps, prevState: WebViewState) {
        this._postRender();

        const oldCustomContents = this._getCustomHtml(prevProps);
        const newCustomContents = this._getCustomHtml(this.props);

        if (newCustomContents) {
            if (oldCustomContents !== newCustomContents) {
                this._setContents(newCustomContents);
            }
        }
    }

    componentWillUnmount() {
        if (this._onMessageReceivedToken) {
            this._onMessageReceivedToken.unsubscribe();
            this._onMessageReceivedToken = undefined;
        }
    }

    private _getCustomHtml(props: Types.WebViewProps): string | undefined {
        if (props.url || !props.source) {
            return undefined;
        }

        return props.source.html;
    }

    private _setContents(html: string) {
        const iframeDOM = this._mountedComponent;
        if (iframeDOM && iframeDOM.contentWindow) {
            try {
                // Some older browsers don't support this, so
                // be prepared to catch an exception.
                (iframeDOM as any).srcdoc = html;
            } catch {
                // Swallow exceptions
            }
        }
    }

    private _installMessageListener() {
        // Don't install global message listener twice.
        if (!WebView._messageListenerInstalled) {
            // Set up the global event.
            WebView._onMessageReceived = new RX.Types.SubscribableEvent<(e: WebViewMessageEventInternal) => void>(true);

            window.addEventListener('message', (e: MessageEvent) => {
                const event: WebViewMessageEventInternal = {
                    data: e.data,
                    origin: e.origin,
                    nativeEvent: e,
                    bubbles: e.bubbles,
                    cancelable: e.cancelable,
                    defaultPrevented: e.defaultPrevented,
                    __propagationStopped: false,
                    stopPropagation: () => {
                        e.stopPropagation();
                        event.__propagationStopped = true;
                    },
                    preventDefault: () => {
                        e.preventDefault();
                    },
                    timeStamp: e.timeStamp,
                };

                WebView._onMessageReceived.fire(event);
            });

            WebView._messageListenerInstalled = true;
        }

        // Subscribe to the global event if we haven't already done so.
        if (!this._onMessageReceivedToken) {
            this._onMessageReceivedToken = WebView._onMessageReceived.subscribe(e => {
                if (this.props.onMessage) {
                    this.props.onMessage(e);

                    // Stop the event from propagating further.
                    return e.__propagationStopped;
                }

                return false;
            });
        }
    }

    private _postRender() {
        // If the caller wants to receive posted messages
        // from the web view, we need to install a global
        // message handler.
        if (this.props.onMessage) {
            this._installMessageListener();
        }

        if (!this.state.postComplete) {
            this.setState({
                postComplete: true,
            });
        }
    }

    render() {
        const styles = RX.Styles.combine([_styles.webViewDefault, this.props.style]) as React.CSSProperties;
        const sandbox = this.props.sandbox !== undefined
            ? this.props.sandbox
            : (this.props.javaScriptEnabled ? Types.WebViewSandboxMode.AllowScripts : Types.WebViewSandboxMode.None);

        // width 100% is needed for Edge - it doesn't grow iframe. Resize needs to be done with wrapper
        return (
            <RX.View style={ _styles.webViewContainer }>
                <iframe
                    ref={ this._onMount }
                    name={ this.state.webFrameIdentifier }
                    id={ this.state.webFrameIdentifier }
                    style={ styles }
                    src={ this.props.url }
                    onLoad={ this._onLoad }
                    sandbox={ this._sandboxToStringValue(sandbox) }
                    width={ '100%' }
                    data-test-id={ this.props.testId }
                />
            </RX.View>
        );
    }

    protected _onMount = (component: HTMLIFrameElement | null) => {
        this._mountedComponent = component;
    };

    private _onLoad = (e: RX.Types.SyntheticEvent) => {
        if (this.props.onLoad) {
            this.props.onLoad(e);
        }
    };

    private _sandboxToStringValue = (sandbox: Types.WebViewSandboxMode) => {
        const values: string[] = [];

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

    postMessage(message: string, targetOrigin = '*') {
        const iframeDOM = this._mountedComponent;
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.postMessage(message, targetOrigin);
        }
    }

    reload() {
        const iframeDOM = this._mountedComponent;
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.location.reload(true);
        }
    }

    goBack() {
        const iframeDOM = this._mountedComponent;
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.history.back();
        }
    }

    goForward() {
        const iframeDOM = this._mountedComponent;
        if (iframeDOM && iframeDOM.contentWindow) {
            iframeDOM.contentWindow.history.forward();
        }
    }
}

export default WebView;
