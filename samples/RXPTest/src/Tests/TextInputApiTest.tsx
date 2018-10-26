/*
* Tests the functionality of a TextInput component that can be
* auto-validated.
*/

import _ = require('lodash');
import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { AutoExecutableTest, TestResult, TestType } from '../Test';

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
    textInput1: RX.Styles.createTextInputStyle({
        marginHorizontal: 12,
        alignSelf: 'stretch',
        borderWidth: 1,
        fontSize: CommonStyles.generalFontSize,
        padding: 4,
        borderColor: '#999'
    })
};

interface TextInputViewState {
    testInput?: string;
}

const _testValue1 = 'A long test value for the text input box';

class TextInputView extends RX.Component<RX.CommonProps, TextInputViewState> {
    private _isMounted = false;
    private _textInput1Ref: RX.TextInput | undefined;
    private _testResult: TestResult | undefined;
    private _testCompletion: ((result: TestResult) => void) | undefined;
    private _nextTestStage: number | undefined;

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            testInput: ''
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Tests various aspects of the TextInput component that can be automatically validated.' }
                    </RX.Text>
                </RX.View>
                <RX.TextInput
                    ref={ (comp: any) => { this._textInput1Ref = comp; } }
                    style={ _styles.textInput1 }
                    value={ this.state.testInput }
                    onChangeText={ val => this.setState({ testInput: val }) }
                    testId={ 'textInput1' }
                />
            </RX.View>
        );
    }

    private _executeNextStage() {
        const testStages: (() => void)[] = [() => {
            // Stage 0
            // Test focus API.
            this._textInput1Ref!.focus();
        }, () => {
            // Stage 1
            // Verify focus results.
            if (!this._textInput1Ref!.isFocused()) {
                this._testResult!.errors.push('Expected text input to be focused');
            }

            // Test blur API.
            this._textInput1Ref!.blur();
        }, () => {
            // Verify blur results.
            if (this._textInput1Ref!.isFocused()) {
                this._testResult!.errors.push('Expected text input to be blurred');
            }

            // Test setValue API.
            this._textInput1Ref!.focus();
            this._textInput1Ref!.setValue(_testValue1);
        }, () => {
            // Verify the results of setValue.
            if (this.state.testInput !== _testValue1) {
                this._testResult!.errors.push('Call to setValue did not work as expected');
            }

            // Test selectRange API.
            this._textInput1Ref!.selectRange(2, 7);
        }, () => {
            // Verify the results of selectRange API.
            let selectionRange = this._textInput1Ref!.getSelectionRange();
            if (selectionRange.start !== 2 || selectionRange.end !== 7) {
                this._testResult!.errors.push('Call to selectRange did not work as expected');
            }

            // Test selectAll API.
            this._textInput1Ref!.selectAll();
        }, () => {
            // Verify the results of selectAll API.
            let selectionRange = this._textInput1Ref!.getSelectionRange();
            if (selectionRange.start !== 0 || selectionRange.end !== _testValue1.length) {
                this._testResult!.errors.push('Call to selectAll did not work as expected');
            }

            // Test selectAll API.
            this._textInput1Ref!.selectAll();
        }];

        // Are we done?
        if (this._nextTestStage! >= testStages.length) {
            this._testCompletion!(this._testResult!);
        } else {
            // Run the next stage after a brief delay.
            _.delay(() => {
                testStages[this._nextTestStage!]();
                this._nextTestStage!++;
                this._executeNextStage();
            }, 200);
        }
    }

    execute(complete: (result: TestResult) => void): void {
        this._nextTestStage = 0;
        this._testResult = new TestResult();
        this._testCompletion = complete;

        if (RX.Platform.getType() === 'windows') {
            this._testResult!.errors.push('Test disabled and failed by default due to RNW 0.57.0-rc.0 crashing bug');
            this._testCompletion!(this._testResult!);
            return;
        }

        // Kick off the first stage.
        this._executeNextStage();
    }
}

class TextInputApiTest implements AutoExecutableTest {
    getPath(): string {
        return 'Components/TextInput/APIs';
    }

    getTestType(): TestType {
        return TestType.AutoExecutable;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <TextInputView ref={ onMount }/>
        );
    }

    execute(component: any, complete: (result: TestResult) => void): void {
        let textInputView = component as TextInputView;

        textInputView.execute(complete);
    }
}

export default new TextInputApiTest();
