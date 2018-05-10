/*
* Tests the dynamic injection functionality of a WebView component.
*/

import _ = require('lodash');
import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { Test, TestResult, TestType } from '../Test';

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'column',
        alignItems: 'flex-start'
    }),
    explainTextContainer: RX.Styles.createViewStyle({
        margin: 12
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    webViewContainer: RX.Styles.createViewStyle({
        alignSelf: 'stretch',
        height: 200,
        margin: 12,
        borderWidth: 1,
        borderColor: '#ddd'
    }),
    webView: RX.Styles.createWebViewStyle({
    }),
    eventHistoryScrollView: RX.Styles.createScrollViewStyle({
        margin: 12,
        padding: 8,
        alignSelf: 'stretch',
        height: 100,
        backgroundColor: '#eee'
    }),
    eventHistoryText: RX.Styles.createTextStyle({
        fontSize: 12,
    }),
    buttonBank: RX.Styles.createViewStyle({
        flexDirection: 'row',
        marginHorizontal: 12,
        marginVertical: 4
    }),
    button: RX.Styles.createButtonStyle({
        backgroundColor: '#ddd',
        borderWidth: 1,
        minWidth: 75,
        marginLeft: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        borderColor: 'black',
        alignItems: 'center'
    }),
    buttonText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: 'black'
    })
};

interface WebViewViewState {
    htmlContent?: string;
    test1EventHistory?: string[];
}

class WebViewView extends RX.Component<RX.CommonProps, WebViewViewState> {
    private _webViewTest1: RX.WebView;

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            htmlContent: WebViewView._getHtmlContent(0),
            test1EventHistory: []
        };
    }

    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'The web view below is injected with custom HTML provided by the test. ' +
                          'It also has a message handler that can receive messages from outside the control.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.webViewContainer }>
                    <RX.WebView
                        sandbox={ RX.Types.WebViewSandboxMode.AllowScripts }
                        style={ _styles.webView }
                        source={ { html: this.state.htmlContent } }
                        ref={ (comp: RX.WebView) => { this._webViewTest1 = comp; } }
                        onNavigationStateChange={ this._onNavChangeTest1 }
                        onLoadStart={ this._onLoadStartTest1 }
                        onLoad={ this._onLoadTest1 }
                        onError={ this._onErrorTest1 }
                        onMessage={ this._onMessageReceived }
                    />
                </RX.View>
                <RX.View style={ _styles.buttonBank }>
                    <RX.Button
                        style={ _styles.button }
                        onPress={ this._onLoadContent1 }
                    >
                        <RX.Text style={ _styles.buttonText }>
                            { 'Page 1' }
                        </RX.Text>
                    </RX.Button>
                    <RX.Button
                        style={ _styles.button }
                        onPress={ this._onLoadContent2 }
                    >
                        <RX.Text style={ _styles.buttonText }>
                            { 'Page 2' }
                        </RX.Text>
                    </RX.Button>
                    <RX.Button
                        style={ _styles.button }
                        onPress={ this._onPostMessage }
                    >
                        <RX.Text style={ _styles.buttonText }>
                            { 'Post Message' }
                        </RX.Text>
                    </RX.Button>
                </RX.View>
                <RX.ScrollView style={ _styles.eventHistoryScrollView }>
                    <RX.Text style={ _styles.eventHistoryText }>
                        { this.state.test1EventHistory.length ?
                            this.state.test1EventHistory.join('\n') :
                            'Event history will appear here'
                        }
                    </RX.Text>
                </RX.ScrollView>
            </RX.View>
        );
    }

    private static _getHtmlContent(pageNumber: number): string {
        // Some browsers and web controls require that we install the event listener
        // on the window, others on the document. We'll install it on both here.
        const receiverScript = 'window.onload=function() {' +
            'function receiveMessage(e) { document.getElementById("msg").innerHTML = "Message Received: " + e.data; };' +
            'document.getElementById("sendButton").onclick=function() { window.parent.postMessage("Posted message ' +
            'from WebView!", "*"); };' +
            'document.addEventListener("message", receiveMessage);' +
            'window.addEventListener("message", receiveMessage);' +
        '}';

        let bodyContent = pageNumber ? `Page ${pageNumber.toString()} Content` : 'Tap buttons to load new HTML content.';

        const htmlContent = '<html><head><script>' + receiverScript +
            '</script></head><body style="font-size: 36px; background-color: #eef">' +
            bodyContent + '<div id="msg">Tap &ldquo;Post Message&rdquo; to send message to web view.</div>' +
            '<button id="sendButton" style="margin: 20px; font-size: 36px">Send Message</button>' +
            '</body></html>';

        return htmlContent;
    }

    private _onNavChangeTest1 = (navState: RX.Types.WebViewNavigationState) => {
        this._appendHistoryTest1('Nav state changed');
    }

    private _onLoadStartTest1 = (e: RX.Types.SyntheticEvent) => {
        this._appendHistoryTest1('Load start');
    }

    private _onLoadTest1 = (e: RX.Types.SyntheticEvent) => {
        this._appendHistoryTest1('Loaded');
    }

    private _onErrorTest1 = (e: RX.Types.SyntheticEvent) => {
        this._appendHistoryTest1('Error');
    }

    private _onMessageReceived = (e: RX.Types.WebViewMessageEvent) => {
        this._appendHistoryTest1('Received message: ' + e.data);
    }

    private _onLoadContent1 = () => {
        this.setState({ htmlContent: WebViewView._getHtmlContent(1) });
    }

    private _onLoadContent2 = () => {
        this.setState({ htmlContent: WebViewView._getHtmlContent(2) });
    }

    private _onPostMessage = () => {
        this._webViewTest1.postMessage('ReactXP Is Cool!');
    }

    private _appendHistoryTest1(newLine: string) {
        // Prepend it so we can always see the latest.
        // Limit to the last 20 items.
        let newHistory = [newLine].concat(_.slice(this.state.test1EventHistory, 0, 18));
        this.setState({
            test1EventHistory: newHistory
        });
    }
}

// TODO - need to test the following props and methods
// injectedJavaScript

class WebViewDynamicTest implements Test {
    getPath(): string {
        return 'Components/WebView/Dynamic';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <WebViewView ref={ onMount }/>
        );
    }
}

export default new WebViewDynamicTest();
