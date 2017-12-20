/*
* A view that includes a list of all tests, allowing the user to
* select or deselect particular tests and run them.
*/

import _ = require('lodash');
import RX = require('reactxp');

import * as CommonStyles from './CommonStyles';
import { Test, TestResult } from './Test';
import TestRegistry from './TestRegistry';

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch'
    }),
    header: RX.Styles.createViewStyle({
        alignSelf: 'stretch',
        flex: 0,
        backgroundColor: CommonStyles.headerBackgroundColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }),
    button: RX.Styles.createButtonStyle({
        flex: 0,
        margin: 8,
        height: 28,
        backgroundColor: CommonStyles.buttonBackgroundColor,
        borderRadius: CommonStyles.buttonBorderRadius,
        borderWidth: CommonStyles.buttonBorderWidth,
        borderColor: CommonStyles.buttonBorderColor
    }),
    buttonText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.buttonFontSize,
        marginHorizontal: 12,
        color: CommonStyles.buttonTextColor
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        marginHorizontal: 12,
        color: CommonStyles.explainTextColor
    }),
    scrollView: RX.Styles.createScrollViewStyle({
        flex: 1,
        alignSelf: 'stretch'
    }),
    itemContainer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        alignSelf: 'stretch',
        height: 32,
        alignItems: 'center',
        cursor: 'pointer'
    }),
    resultContainer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 120,
        marginHorizontal: 12
    }),
    itemText: RX.Styles.createTextStyle({
        flex: 1,
        fontSize: CommonStyles.generalFontSize,
        marginHorizontal: 12
    }),
    notRunText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    errorText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.errorTextColor
    }),
    warningText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.warningTextColor
    }),
    successText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.successTextColor
    })
};

export interface TestListViewProps extends RX.CommonProps {
    onSelectTest: (path: string) => void;
    onRunAll: () => void;
}

export interface TestListViewState {
    results?: {[path: string]: TestResult };
}

export class TestListView extends RX.Component<TestListViewProps, TestListViewState> {
    constructor(props: TestListViewProps) {
        super(props);

        this.state = {
            results: {}
        }
    }

    render() {
        let tests = TestRegistry.getAllTests();
        
        let testListItems: JSX.Element[] = _.map(tests, (test, path) => {
            let testPath = test.getPath();
            let result = TestRegistry.getResult(testPath);
            let resultText: JSX.Element;
            if (!result) {
                resultText = (
                    <RX.Text style={ _styles.notRunText } numberOfLines={ 1 }>
                        { 'not run' }
                    </RX.Text>
                );
            } else if (result.errors.length > 0) {
                resultText = (
                    <RX.Text style={ _styles.errorText } numberOfLines={ 1 }>
                        { result.errors.length + (result.errors.length > 1 ? ' errors' : ' error') }
                    </RX.Text>
                );
            } else if (result.warnings.length > 0) {
                resultText = (
                    <RX.Text style={ _styles.warningText } numberOfLines={ 1 }>
                        { result.warnings.length + (result.warnings.length > 1 ? ' warnings' : ' warning') }
                    </RX.Text>
                );
            } else {
                resultText = (
                    <RX.Text style={ _styles.successText } numberOfLines={ 1 }>
                        { 'success' }
                    </RX.Text>
                );
            }

            return (
                <RX.View
                    style={ _styles.itemContainer }
                    key={ path }
                    onPress={ () => this._onPressItem(testPath) }
                >
                    <RX.Text style={ _styles.itemText } numberOfLines={ 1 }>
                        { TestRegistry.formatPath(test.getPath()) }
                    </RX.Text>
                    <RX.View style={ _styles.resultContainer }>
                        { resultText }
                    </RX.View>
                </RX.View>
            );
        });

        return (
            <RX.View style={ _styles.container }>
                <RX.View style={ _styles.header }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Select test to run' }
                    </RX.Text>
                    <RX.Button style={ _styles.button } onPress={ this._runAll }>
                        <RX.Text style={ _styles.buttonText }>
                            { 'Run All' }
                        </RX.Text>
                    </RX.Button>
                </RX.View>
                <RX.View>
                    <RX.ScrollView style={ _styles.scrollView }>
                        { testListItems }
                    </RX.ScrollView>
                </RX.View>
            </RX.View>
        );
    }

    private _onPressItem(path: string) {
        this.props.onSelectTest(path);
    }

    private _runAll = (e: RX.Types.SyntheticEvent) => {
        this.props.onRunAll();
    }
}
