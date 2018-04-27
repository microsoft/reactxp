/*
* Tests the RX.Linking APIs in an interactive manner.
*/

import _ = require('lodash');
import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { Test, TestResult, TestType } from '../Test';

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'flex-start'
    }),
    textContainer: RX.Styles.createViewStyle({
        margin: 12
    }),
    labelContainer: RX.Styles.createViewStyle({
        alignSelf: 'center',
        margin: 8
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    labelText: RX.Styles.createTextStyle({
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    }),
    resultText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: 'black'
    }),
    buttonContainer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        alignItems: 'center'
    }),
    button: RX.Styles.createButtonStyle({
        backgroundColor: '#ddd',
        borderWidth: 1,
        margin: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderColor: 'black'
    }),
    buttonText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: 'black'
    })
};

interface LinkingState {
    initialUrl?: string;
    openValidUrlResult?: string;
    openInvalidUrlResult?: string;
    openSmsResult?: string;
    openEmailResult?: string;
}

class LinkingView extends RX.Component<RX.CommonProps, LinkingState> {
    private _isMounted = false;

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            initialUrl: undefined,
            openValidUrlResult: '',
            openInvalidUrlResult: '',
            openSmsResult: '',
            openEmailResult: ''
        };
    }

    componentDidMount() {
        this._isMounted = true;

        RX.Linking.getInitialUrl().then(url => {
            if (this._isMounted) {
                if (!url) {
                    this.setState({ initialUrl: '(blank URL)' });
                } else {
                    this.setState({ initialUrl: url });
                }
            }
        }).catch(err => {
            if (this._isMounted) {
                this.setState({ initialUrl: '(Received error: ' + err + ')' });
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <RX.View style={ _styles.container }>
                <RX.View style={ _styles.textContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Initial URL used to launch the app:' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer }>
                    <RX.Text style={ _styles.labelText }>
                        { this.state.initialUrl }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Open "https://microsoft.github.io/reactxp/" into the default browser' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.buttonContainer }>
                    <RX.Button
                        style={ _styles.button }
                        onPress={ this._openValidUrl }
                    >
                        <RX.Text style={ _styles.buttonText }>
                            { 'Open valid URL' }
                        </RX.Text>
                    </RX.Button>
                    <RX.Text style={ _styles.resultText }>
                        { this.state.openValidUrlResult }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation3' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Open "foo://reactxp" into the default browser' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.buttonContainer }>
                    <RX.Button
                        style={ _styles.button }
                        onPress={ this._openInvalidUrl }
                    >
                        <RX.Text style={ _styles.buttonText }>
                            { 'Open invalid URL' }
                        </RX.Text>
                    </RX.Button>
                    <RX.Text style={ _styles.resultText }>
                        { this.state.openInvalidUrlResult }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation4' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Open in default SMS app' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.buttonContainer }>
                    <RX.Button
                        style={ _styles.button }
                        onPress={ this._openSms }
                    >
                        <RX.Text style={ _styles.buttonText }>
                            { 'Launch SMS' }
                        </RX.Text>
                    </RX.Button>
                    <RX.Text style={ _styles.resultText }>
                        { this.state.openSmsResult }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation5' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Open in default email app' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.buttonContainer }>
                    <RX.Button
                        style={ _styles.button }
                        onPress={ this._openEmail }
                    >
                        <RX.Text style={ _styles.buttonText }>
                            { 'Launch Email' }
                        </RX.Text>
                    </RX.Button>
                    <RX.Text style={ _styles.resultText }>
                        { this.state.openEmailResult }
                    </RX.Text>
                </RX.View>

            </RX.View>
        );
    }

    private _openValidUrl = () => {
        RX.Linking.openUrl('https://microsoft.github.io/reactxp/').then(() => {
            if (this._isMounted) {
                this.setState({ openValidUrlResult: 'Succeeded' });
            }
        }).catch(err => {
            let linkErr = err as RX.Types.LinkingErrorInfo;
            if (this._isMounted) {
                this.setState( { openValidUrlResult: this._formatLinkingError(linkErr) } );
            }
        });
    }

    private _openInvalidUrl = () => {
        RX.Linking.openUrl('foo://reactxp').then(() => {
            if (this._isMounted) {
                this.setState({ openInvalidUrlResult: 'Succeeded' });
            }
        }).catch(err => {
            let linkErr = err as RX.Types.LinkingErrorInfo;
            if (this._isMounted) {
                this.setState( { openInvalidUrlResult: this._formatLinkingError(linkErr) } );
            }
        });
    }

    private _openSms = () => {
        let smsData: RX.Types.SmsInfo = {
            phoneNumber: '1-555-555-5555',
            body: 'You up?'
        };
        RX.Linking.launchSms(smsData).then(() => {
            if (this._isMounted) {
                this.setState({ openSmsResult: 'Succeeded' });
            }
        }).catch(err => {
            let linkErr = err as RX.Types.LinkingErrorInfo;
            if (this._isMounted) {
                this.setState( { openSmsResult: this._formatLinkingError(linkErr) } );
            }
        });
    }

    private _openEmail = () => {
        let emailInfo: RX.Types.EmailInfo = {
            to: ['reactxp@microsoft.com', 'a@foo.com', 'b@foo.com'],
            cc: ['d@foo.com', 'e@foo.com'],
            bcc: ['reactxp@microsoft.com'],
            subject: 'Test - please ignore',
            body: 'Nothing to see here'
        };
        RX.Linking.launchEmail(emailInfo).then(() => {
            if (this._isMounted) {
                this.setState({ openEmailResult: 'Succeeded' });
            }
        }).catch(err => {
            let linkErr = err as RX.Types.LinkingErrorInfo;
            if (this._isMounted) {
                this.setState( { openEmailResult: this._formatLinkingError(linkErr) } );
            }
        });
    }

    private _formatLinkingError(err: RX.Types.LinkingErrorInfo): string {
        let errString = 'Unknown';
        switch (err.code) {
            case RX.Types.LinkingErrorCode.NoAppFound:
                errString = 'No App Found';
                break;

            case RX.Types.LinkingErrorCode.UnexpectedFailure:
                errString = 'Unexpected Error';
                break;

            case RX.Types.LinkingErrorCode.Blocked:
                errString = 'Blocked';
                break;

            case RX.Types.LinkingErrorCode.InitialUrlNotFound:
                errString = 'Initial URL Not Found';
                break;
        }

        return 'Error: ' + errString;
    }
}

class LinkingTest implements Test {
    getPath(): string {
        return 'APIs/Linking';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <LinkingView
                ref={ onMount }
            />
        );
    }
}

export default new LinkingTest();
