/*
* Tests the RX.Clipboard APIs in an interactive manner.
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

interface ClipboardViewState {
    copyIteration?: number;
    pastedText?: string;
}

const _copyString = 'Copied text ';

class ClipboardView extends RX.Component<RX.CommonProps, ClipboardViewState> {
    private _presencesChangedEvent: RX.Types.SubscriptionToken;

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            copyIteration: 1,
            pastedText: ''
        };
    }

    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.textContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Press the button to copy the following text to the clipboard. Switch to another app and paste to verify.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer }>
                    <RX.Text style={ _styles.labelText }>
                        { _copyString + this.state.copyIteration }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button }
                    onPress={ () => this._doCopy() }
                >
                    <RX.Text style={ _styles.buttonText }>
                        { 'Copy to Clipboard' }
                    </RX.Text>
                </RX.Button>

                <RX.View style={ _styles.textContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Press the button to paste the text contents of the clipboard.' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button }
                    onPress={ () => this._doPaste() }
                >
                    <RX.Text style={ _styles.buttonText }>
                        { 'Paste from Clipboard' }
                    </RX.Text>
                </RX.Button>
                <RX.View style={ _styles.labelContainer }>
                    <RX.Text style={ _styles.labelText }>
                        { this.state.pastedText }
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
    }

    private _doCopy() {
        RX.Clipboard.setText(_copyString + this.state.copyIteration);

        this.setState({
            copyIteration: this.state.copyIteration + 1
        });
    }

    private _doPaste() {
        RX.Clipboard.getText().then(text => {
            this.setState({
                pastedText: text
            });
        }).catch(err => {
            this.setState({
                pastedText: '(Received error when pasting: ' + err + ')'
            });
        });
    }
}

class ClipboardTest implements Test {
    getPath(): string {
        return 'APIs/Clipboard';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <ClipboardView
                ref={ onMount }
            />
        );
    }
}

export default new ClipboardTest();
