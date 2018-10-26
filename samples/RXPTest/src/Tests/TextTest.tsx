/*
* Tests the functionality of a Text component with
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
        alignSelf: 'stretch',        
        marginHorizontal: 36,
        marginVertical: 12
    }),
    test1Text: RX.Styles.createTextStyle({
        fontSize: 24,
        color: '#006'
    }),
    test1Sub2Text: RX.Styles.createTextStyle({
        fontSize: 12,
        color: 'black',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'dotted',
        textDecorationColor: 'green'
    }),
    test1Sub3Text: RX.Styles.createTextStyle({
        fontWeight: 'bold',
        fontStyle: 'italic',
        letterSpacing: 2,
        textDecorationLine: 'underline',
        textDecorationStyle: 'double',
        textDecorationColor: 'red'
    }),
    test2Text: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize
    }),
    test7Text: RX.Styles.createTextStyle({
        fontSize: 16
    }),
    test9Text: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        shadowColor: 'red',
        shadowOffset: { width: 1, height: 4 },
        shadowRadius: 5
    }),
    inlineImageContainer: RX.Styles.createViewStyle({
        height: 24,
        width: 20,
        marginHorizontal: 8
    }),
    inlineImageContainerOffset: RX.Styles.createViewStyle({
        marginBottom: -8
    }),
    inlineImage: RX.Styles.createImageStyle({
        height: 24,
        width: 20
    }),
    test8Text: RX.Styles.createTextStyle({
        fontSize: 16,
        lineHeight: 48,
        textDecorationLine: 'underline'
    }),
    selectTextContainer: RX.Styles.createViewStyle({
        margin: 12,
        flexDirection: 'row',
        alignItems: 'center'
    }),
    testSelectText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize
    }),
    selectTextButton: RX.Styles.createButtonStyle({
        backgroundColor: '#ddd',
        borderWidth: 1,
        margin: 20,
        padding: 12,
        borderRadius: 8,
        borderColor: 'black'
    }),
    testWarnText: RX.Styles.createTextStyle({
        color: 'red'
    })
};

interface TextViewState {
    test5ColorIndex: number;
    selectedText: string;
}

const _dynamicColors = ['black', 'red', 'green', 'blue'];

class TextView extends RX.Component<RX.CommonProps, TextViewState> {
    private _selectionText: RX.Text | undefined;

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            test5ColorIndex: 0,
            selectedText: ''
        };
    }

    render() {
        let test5Style = RX.Styles.createTextStyle({
            color: _dynamicColors[this.state.test5ColorIndex]
        }, false);

        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Text components can be nested and inherit some of their style properties from their parent. ' +
                          'This is an example of three sub-strings displayed together. ' +
                          'The second substring has a green dotted strike-through, and the third ' +
                          'substring has 2x spacing and a red double underline.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.Text
                        style={ _styles.test1Text }
                        importantForAccessibility={ RX.Types.ImportantForAccessibility.Yes }
                        id={ 'test1' }
                        allowFontScaling={ false }
                        testId={ 'text1' }
                    >
                        <RX.Text>
                            { 'Substring 1 ' }
                        </RX.Text>
                        <RX.Text style={ _styles.test1Sub2Text }>
                            { 'substring 2 ' }
                        </RX.Text>
                        <RX.Text style={ _styles.test1Sub3Text }>
                            { 'substring 3 ' }
                        </RX.Text>
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Text can wrap to cover multiple lines or constrained to a specified ' +
                          'number of lines (and truncated if necessary).' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.Text style={ _styles.test2Text }>
                        { 'A really long string that will wrap to multiple lines if necessary ' +
                          'but only if there is insufficient space. ' +
                          'A really long string that will wrap to multiple lines if necessary ' +
                          'but only if there is insufficient space.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.Text style={ _styles.test2Text } numberOfLines={ 2 }>
                    { 'A really long string that will wrap to two lines if necessary ' +
                          'but only if there is insufficient space. ' +
                          'A really long string that will wrap to two lines if necessary ' +
                          'but only if there is insufficient space. ' }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation3' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Truncation can be done at the head, middle or tail.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.Text style={ _styles.test2Text } numberOfLines={ 1 } ellipsizeMode={ 'head' }>
                        { 'A really long string that will trunctate to one line if necessary ' +
                        'but only if there is insufficient space. (Head truncation)' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.Text style={ _styles.test2Text } numberOfLines={ 1 } ellipsizeMode={ 'middle' }>
                        { '(Middle truncation) A really long string that will trunctate to one line if necessary ' +
                        'but only if there is insufficient space.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.Text style={ _styles.test2Text } numberOfLines={ 1 } ellipsizeMode={ 'tail' }>
                        { '(Tail truncation) A really long string that will trunctate to one line if necessary ' +
                        'but only if there is insufficient space.' }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation4' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'By default, text is not selectable (on mouse-based systems).' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.Text style={ _styles.test2Text }>
                        { 'This text is not selectable' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.Text style={ _styles.test2Text } selectable={ true }>
                        { 'This text is selectable' }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation5' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Click or tap on the text below to change its color.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.Text
                        style={ [_styles.test2Text, test5Style] }
                        onPress={ this._onPressTest5 }
                    >
                        { 'Text with an onPress handler' }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation6' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'On some platforms (iOS and Android), text can be scaled according to user preferences.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.Text style={ _styles.test2Text } allowFontScaling={ false }>
                        { 'This text does not scale regardless of system settings' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.Text style={ _styles.test2Text }>
                        { 'This text scales based on system settings' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.Text style={ _styles.test2Text }  maxContentSizeMultiplier={ 1.2 }>
                        { 'This text scales up to 1.2x, no more' }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation7' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Fixed-size views can be inlined within a text block.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    { RX.Platform.getType() !== 'web' ? (
                        <RX.Text style={ _styles.testWarnText }>
                            { 'Test disabled due to broken RN 0.57 support of inline views' } 
                        </RX.Text>
                    ) : ( 
                        <RX.Text style={ _styles.test7Text }>
                            <RX.Text>
                                { 'Do you have a bright ' }
                            </RX.Text>
                            <RX.View style={ _styles.inlineImageContainer }>
                                <RX.Image
                                    source={ 'https://microsoft.github.io/reactxp/img/tests/bulb.jpg' }
                                    resizeMode={ 'contain' }
                                    style={ _styles.inlineImage }
                                />
                            </RX.View>
                            <RX.Text>
                                { ' to share?' }
                            </RX.Text>
                        </RX.Text>
                    )}
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation8' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Max line height can be adjusted for multi-line text blocks.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    { RX.Platform.getType() !== 'web' ? (
                        <RX.Text style={ _styles.testWarnText }>
                            { 'Test disabled due to broken RN 0.57 support of inline views' } 
                        </RX.Text>
                    ) : ( 
                        <RX.Text style={ _styles.test8Text }>
                            <RX.Text>
                                { 'This is a really long string with a ' }
                            </RX.Text>
                            <RX.View style={ [_styles.inlineImageContainer, _styles.inlineImageContainerOffset] }>
                                <RX.Image
                                    source={ 'https://microsoft.github.io/reactxp/img/tests/bulb.jpg' }
                                    resizeMode={ 'contain' }
                                    style={ _styles.inlineImage }
                                />
                            </RX.View>
                            <RX.Text>
                                { ' light bulb inlined within it. It is meant to demonstrate a' +
                                ' larger-than-normal line height.' }
                            </RX.Text>
                        </RX.Text>
                    )}
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation9' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Text shadows can be applied with the shadow style props.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.Text style={ _styles.test9Text }>
                        { 'Text with a red shadow.' }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.selectTextContainer }>
                    <RX.Text 
                        style={ _styles.testSelectText } 
                        selectable={ true }
                        ref={ (comp: any) => { this._selectionText = comp; } }
                        >
                        { 'Select from this text.' }
                    </RX.Text>
                    <RX.Button
                        style = { _styles.selectTextButton }
                        onPress={ this._onPressCopySelectedText }
                    >
                        <RX.Text>
                            { 'Copy selected.' }
                        </RX.Text>
                    </RX.Button>
                    <RX.Text style={ _styles.testSelectText }>
                        { 'Copied selected text:' }
                    </RX.Text>
                    <RX.Text style={ _styles.testSelectText }>
                        { this.state.selectedText }
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
    }

    private _onPressTest5 = () => {
        let newIndex = (this.state.test5ColorIndex + 1) % _dynamicColors.length;
        this.setState({ test5ColorIndex: newIndex });
    }

    private _onPressCopySelectedText = () => {
        if (this._selectionText) {
            var selectedText: string = '';
            // TODO Enable when ReactXP dependency is updated.
            // selectedText = this._selectionText.getSelectedText();
            this.setState({ selectedText: selectedText });
        }
    }
}

class TextTest implements Test {
    getPath(): string {
        return 'Components/Text';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <TextView ref={ onMount }/>
        );
    }
}

export default new TextTest();
