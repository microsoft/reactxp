/*
* Tests the functionality of a WebView component using manual
* user validation.
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
    test1CanGoBack?: boolean;
    test1CanGoForward?: boolean;
    test1EventHistory?: string[];
}

class WebViewView extends RX.Component<RX.CommonProps, WebViewViewState> {
    private _webViewTest1: RX.WebView;

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            test1CanGoBack: false,
            test1CanGoForward: false,
            test1EventHistory: []
        };
    }

    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'The web view below displays the RX.WebView documentation. ' +
                          'Click on links and use the "Back" and "Forward" buttons to navigate. ' +
                          'The gray area below the web view displays the event stream (most recent ' +
                          'event first). You should see a "Load start" and "Load" event. ' +
                          'The "Message" button will cause a message box to appear in the view (web only).' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.webViewContainer }>
                    <RX.WebView
                        style={ _styles.webView }
                        url={ 'https://microsoft.github.io/reactxp/docs/components/webview.html' }
                        ref={ (comp: RX.WebView) => { this._webViewTest1 = comp; } }
                        onNavigationStateChange={ this._onNavChangeTest1 }
                        onLoadStart={ this._onLoadStartTest1 }
                        onLoad={ this._onLoadTest1 }
                        onError={ this._onErrorTest1 }
                    />
                </RX.View>
                <RX.View style={ _styles.buttonBank }>
                    <RX.Button
                        style={ _styles.button }
                        onPress={ this._onBackTest1 }
                        disabled={ !this.state.test1CanGoBack }
                    >
                        <RX.Text style={ _styles.buttonText }>
                            { 'Back' }
                        </RX.Text>
                    </RX.Button>
                    <RX.Button
                        style={ _styles.button }
                        onPress={ this._onForwardTest1 }
                        disabled={ !this.state.test1CanGoForward }
                    >
                        <RX.Text style={ _styles.buttonText }>
                            { 'Forward' }
                        </RX.Text>
                    </RX.Button>
                    <RX.Button
                        style={ _styles.button }
                        onPress={ this._onReloadTest1 }
                    >
                        <RX.Text style={ _styles.buttonText }>
                            { 'Reload' }
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

    private _onNavChangeTest1 = (navState: RX.Types.WebViewNavigationState) => {
        this._appendHistoryTest1('Nav state changed');

        this.setState({
            test1CanGoBack: navState.canGoBack,
            test1CanGoForward: navState.canGoForward
        });
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

    private _onBackTest1 = () => {
        this._webViewTest1.goBack();
    }

    private _onForwardTest1 = () => {
        this._webViewTest1.goForward();
    }

    private _onReloadTest1 = () => {
        this._webViewTest1.reload();
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
// domStorageEnabled
// sandbox
// scalesPageToFit
// startInLoadingState

class WebViewBasicTest implements Test {
    getPath(): string {
        return 'Components/WebView/Basic';
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

export default new WebViewBasicTest();
