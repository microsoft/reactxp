/*
* Tests the functionality of a TextInput component with
* the help of user validation.
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
    resultContainer: RX.Styles.createViewStyle({
        margin: 12,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    }),
    resultText: RX.Styles.createTextStyle({
        flex: -1,
        marginLeft: 12,
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    textInput1: RX.Styles.createTextInputStyle({
        flex: 1,
        maxWidth: 200,
        borderWidth: 1,
        fontSize: CommonStyles.generalFontSize,
        padding: 4,
        borderColor: '#999'
    }),
    textInput2: RX.Styles.createTextInputStyle({
        flex: 1,
        width: 200,
        borderWidth: 1,
        fontSize: CommonStyles.generalFontSize,
        color: 'green',
        padding: 4,
        borderColor: '#999'
    }),
    textInput3: RX.Styles.createTextInputStyle({
        margin: 12,
        width: 200,
        height: 100,
        borderWidth: 1,
        fontSize: CommonStyles.generalFontSize,
        padding: 4,
        borderColor: '#999'
    }),
    textInput7: RX.Styles.createTextInputStyle({
        flex: 1,
        maxWidth: 200,
        borderWidth: 1,
        fontSize: CommonStyles.generalFontSize,
        padding: 4,
        borderColor: '#999',
        shadowColor: 'red',
        shadowOffset: { width: 1, height: 4 },
        shadowRadius: 5
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
    placeholder: RX.Styles.createViewStyle({
        width: 1,
        height: 300
    }),
    button: RX.Styles.createButtonStyle({
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#666',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginTop: 4
    }),
    buttonText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: '#666'
    })
};

interface TextInputViewState {
    test1Input: string;
    test2Input: string;
    test6Input: string;
    test6EventHistory: string[];
    test7Input: string;
}

class TextInputView extends RX.Component<RX.CommonProps, TextInputViewState> {
    private _multilineTextInput: RX.TextInput | null = null;

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            test1Input: '',
            test2Input: '',
            test6Input: '',
            test6EventHistory: [],
            test7Input: ''
        };
    }

    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This is a single-line text input box. ' +
                          'The placeholder text is light blue. ' +
                          'Input is limited to 8 characters in length. ' +
                          'Text is centered. ' +
                          'Auto-correct is disabled. ' +
                          'Auto-focus is enabled. ' +
                          'The return key type (for on-screen keyboards) is "done". ' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.TextInput
                        style={ _styles.textInput1 }
                        placeholder={ 'Type here' }
                        placeholderTextColor={ 'blue' }
                        maxLength={ 10 }
                        returnKeyType={ 'done' }
                        value={ this.state.test1Input }
                        autoCorrect={ false }
                        accessibilityId={ 'TextInputViewTextInput' }
                        autoFocus={ true }
                        maxContentSizeMultiplier={ 1.5 }
                        onChangeText={ val => this.setState({ test1Input: val }) }
                    />
                    <RX.Text style={ _styles.resultText } numberOfLines={ 1 }>
                        { this.state.test1Input }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This is a multi-line text input box. ' +
                          'For on-screen keyboards, the return key should be "go", and the keyboard should use a light theme. ' +
                          'Text should be green. ' +
                          'It supports auto correct, auto capitalization (individual words), and spell checking. ' }
                    </RX.Text>
                    <RX.Text style={ _styles.explainText }>
                        { 'Press this button to set the focus to the multi-line text input box below. ' }
                    </RX.Text>
                    <RX.Button style={ _styles.button } onPress={ this._onPressFocus }>
                        <RX.Text style={ _styles.buttonText }>
                            { 'Focus' }
                        </RX.Text>
                    </RX.Button>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.TextInput
                        ref={ this._onMountTextInput }
                        style={ _styles.textInput2 }
                        placeholder={ 'Placeholder text' }
                        returnKeyType={ 'go' }
                        value={ this.state.test2Input }
                        onChangeText={ val => this.setState({ test2Input: val }) }
                        allowFontScaling={ false }
                        autoCorrect={ true }
                        autoCapitalize={ 'words' }
                        spellCheck={ true }
                        blurOnSubmit={ true }
                        editable={ true }
                        keyboardAppearance={ 'light' }
                        multiline={ true }
                    />
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation3' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This text input box uses the "defaultValue" to specify the initial value. ' +
                          'The keyboard type is "numeric". ' +
                          'The text is right-justified. ' +
                          'The return key type (for on-screen keyboards) is "send". ' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.TextInput
                        style={ _styles.textInput1 }
                        placeholder={ 'PIN' }
                        returnKeyType={ 'send' }
                        keyboardType={ 'numeric' }
                        defaultValue={ '1234' }
                        disableFullscreenUI={ true }
                    />
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation4' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This text input box is not editable. ' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.TextInput
                        style={ _styles.textInput1 }
                        placeholder={ 'Disabled' }
                        editable={ false }
                    />
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation5' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This text input box obscures the text (for password entry). ' +
                          'It uses an "email-address" keyboard type. ' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.TextInput
                        style={ _styles.textInput1 }
                        placeholder={ 'Enter password' }
                        secureTextEntry={ true }
                        keyboardType={ 'email-address' }
                    />
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation6' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This is a multi-line text input box. ' +
                          'It records and displays all events (displayed in reverse order). Try focus, blur, typing, ' +
                          'pasting, scrolling, changing selections, and submitting (hit return). ' }
                    </RX.Text>
                </RX.View>
                <RX.TextInput
                    style={ _styles.textInput3 }
                    autoCorrect={ false }
                    value={ this.state.test6Input }
                    onChangeText={ this._onChangeTextTest6 }
                    onKeyPress={ this._onKeyPressTest6 }
                    onBlur={ this._onBlurTest6 }
                    onFocus={ this._onFocusTest6 }
                    onPaste={ this._onPasteTest6 }
                    onScroll={ this._onScrollTest6 }
                    onSelectionChange={ this._onSelectionChangeTest6 }
                    onSubmitEditing={ this._onSubmitEditingTest6 }
                    multiline={ true }
                />
                <RX.View style={ _styles.eventHistoryScrollView }>
                    <RX.ScrollView>
                        <RX.Text style={ _styles.eventHistoryText }>
                            { this.state.test6EventHistory.length ?
                                this.state.test6EventHistory.join('\n') :
                                'Event history will appear here'
                            }
                        </RX.Text>
                    </RX.ScrollView>
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation7' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'The text entered in this input box will have a red shadow.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.TextInput
                        style={ _styles.textInput7 }
                        value={ this.state.test7Input }
                        onChangeText={ val => this.setState({ test7Input: val }) }
                    />
                    <RX.Text style={ _styles.resultText }>
                        { this.state.test1Input }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation8' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This text input box uses the "clearButtonMode" prop to hide the `X` that appears while typing. ' +
                          '(This is only relevant to iOS and UWP apps). ' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.TextInput
                        style={ _styles.textInput1 }
                        placeholder={ 'This box will not have the usual `X` delete button as you type.' }
                        clearButtonMode={ 'never' }
                    />
                </RX.View>

                <RX.View style={ _styles.placeholder }/>

            </RX.View>
        );
    }

    private _onMountTextInput = (elem: any) => {
        this._multilineTextInput = elem;
    }

    private _onPressFocus = (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation();
        if (this._multilineTextInput) {
            this._multilineTextInput.focus();
        }
    }

    private _onChangeTextTest6 = (value: string) => {
        this.setState({
            test6Input: value
        });

        this._appendHistoryTest6('onChangeText');
    }

    private _onKeyPressTest6 = (e: RX.Types.KeyboardEvent) => {
        let eventText = 'onKeyPress: ' + 'Key = "' + e.key + '", Code = ' + e.keyCode;
        this._appendHistoryTest6(eventText);
    }

    private _onPasteTest6 = (e: RX.Types.ClipboardEvent) => {
        this._appendHistoryTest6('onPaste');
    }

    private _onScrollTest6 = (newScrollLeft: number, newScrollTop: number) => {
        this._appendHistoryTest6('onSroll: (left=' + newScrollLeft +
            ', top=' + newScrollTop + ')');
    }

    private _onBlurTest6 = (e: RX.Types.FocusEvent) => {
        this._appendHistoryTest6(`onBlur: ${this._focusEventToString(e)}`);
    }

    private _onFocusTest6 = (e: RX.Types.FocusEvent) => {
        this._appendHistoryTest6(`onFocus: ${this._focusEventToString(e)}`);
    }

    private _focusEventToString = ({ bubbles, cancelable, defaultPrevented, timeStamp, nativeEvent }: RX.Types.FocusEvent) => {
        return JSON.stringify({ bubbles, cancelable, defaultPrevented, timeStamp, nativeEvent });
    }

    private _onSelectionChangeTest6 = (start: number, end: number) => {
        this._appendHistoryTest6('onSelectionChange: [' + start + ', ' + end + ']');
    }

    private _onSubmitEditingTest6 = () => {
        this._appendHistoryTest6('onSubmitEditing');
    }

    private _appendHistoryTest6(newLine: string) {
        // Prepend it so we can always see the latest.
        // Limit to the last 20 items.
        let newHistory = [newLine].concat(_.slice(this.state.test6EventHistory, 0, 18));
        this.setState({
            test6EventHistory: newHistory
        });
    }
}

class TextInputTest implements Test {
    getPath(): string {
        return 'Components/TextInput/Interactive';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <TextInputView ref={ onMount }/>
        );
    }
}

export default new TextInputTest();
