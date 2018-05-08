/*
* A visual container for an individual test. It includes
* UI elements for executing the test and for reporting status.
*/

import RX = require('reactxp');

import * as CommonStyles from './CommonStyles';
import { AutoExecutableTest, TestResult, TestType } from './Test';
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
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: CommonStyles.headerBorderColor
    }),
    headerSpacer: RX.Styles.createViewStyle({
        paddingTop: 20
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
    titleText: RX.Styles.createTextStyle({
        flex: -1,
        fontSize: CommonStyles.buttonFontSize,
        marginHorizontal: 12
    }),
    resultContainer: RX.Styles.createViewStyle({
        height: 100,
        alignSelf: 'stretch',
        borderBottomWidth: 1,
        borderColor: '#ddd'
    }),
    resultScrollView: RX.Styles.createScrollViewStyle({
        flex: 1,
        alignSelf: 'stretch'
    }),
    resultItem: RX.Styles.createViewStyle({
        marginHorizontal: 12,
        marginTop: 8
    }),
    notRunText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    errorText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.errorTextColor
    }),
    successText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.successTextColor
    }),
    fullScreenContainer: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch'
    })
};

export interface TestContainerProps extends RX.CommonProps {
    test: string;
    prevResult?: TestResult;
    autoRun: boolean;
    onBack: () => void;
}

export interface TestContainerState {
    mountedComponent?: any;
    isTestRunning?: boolean;
    result?: TestResult;
}

export class TestContainer extends RX.Component<TestContainerProps, TestContainerState> {
    constructor(props: TestContainerProps) {
        super(props);

        this.state = {
            mountedComponent: undefined,
            isTestRunning: false
        };
    }

    componentDidUpdate(prevProps: TestContainerProps, prevState: TestContainerState) {
        if (this.props.autoRun) {
            if (!prevState.isTestRunning && !this.state.isTestRunning) {
                this._executeTest();
            }
        }
    }

    render() {
        let test = TestRegistry.getTest(this.props.test);
        let testType = test.getTestType();

        let testResults: JSX.Element;
        let result = this.state.result || this.props.prevResult;
        let resultText: JSX.Element[] = [];
        if (!result) {
            resultText.push(
                <RX.View style={ _styles.resultItem } key='notrun'>
                    <RX.Text style={ _styles.notRunText }>
                        { this.state.isTestRunning ? 'Test is running' : 'Test not run' }
                    </RX.Text>
                </RX.View>
            );
        } else {
            result.errors.forEach((error, index) => {
                resultText.push(
                    <RX.View style={ _styles.resultItem } key={ 'error' + index }>
                        <RX.Text style={ _styles.errorText }>
                            { error }
                        </RX.Text>
                    </RX.View>
                );
            });

            if (resultText.length === 0) {
                resultText.push(
                    <RX.View style={ _styles.resultItem } key={ 'success' }>
                        <RX.Text style={ _styles.successText }>
                            { 'Test succeeded' }
                        </RX.Text>
                    </RX.View>
                );
            }
        }

        // Include results if it's not a render-only test.
        let optionalResultSection: JSX.Element;
        if (testType === TestType.AutoExecutable) {
            optionalResultSection = (
                <RX.View style={ _styles.resultContainer }>
                    <RX.ScrollView style={ _styles.resultScrollView }>
                        { resultText }
                    </RX.ScrollView>
                </RX.View>
            );
        }

        let rightButton: JSX.Element;
        if (testType === TestType.Interactive) {
            rightButton = (
                <RX.Button
                    style={ _styles.button }
                    onPress={ this._onCompleteInteractiveTest }
                >
                    <RX.Text style={ _styles.buttonText }>
                        { 'Validate' }
                    </RX.Text>
                </RX.Button>
            );
        } else {
            rightButton = (
                <RX.Button
                    style={ _styles.button }
                    onPress={ this._onRunTest }
                    disabled={ this.state.isTestRunning || testType !== TestType.AutoExecutable }
                >
                    <RX.Text style={ _styles.buttonText }>
                        { 'Run' }
                    </RX.Text>
                </RX.Button>
            );
        }

        let renderedTest = test.render(this._onMountTestUI);

        let testContainer: JSX.Element;
        if (test.useFullScreenContainer) {
            testContainer = (
                <RX.View style={ _styles.fullScreenContainer }>
                    { renderedTest }
                </RX.View>
            );
        } else {
            testContainer = (
                <RX.ScrollView>
                    <RX.View>
                    { renderedTest }
                    </RX.View>
                </RX.ScrollView>
            );
        }

        return (
            <RX.View useSafeInsets={ true } style={ _styles.container }>
                <RX.View style={ [_styles.header, RX.StatusBar.isOverlay() && _styles.headerSpacer] }>
                    <RX.Button
                        style={ _styles.button }
                        onPress={ this._onBack }
                        disabled={ this.state.isTestRunning }
                    >
                        <RX.Text style={ _styles.buttonText }>
                            { 'Back' }
                        </RX.Text>
                    </RX.Button>
                    <RX.Text style={ _styles.titleText } numberOfLines={ 1 }>
                        { TestRegistry.formatPath(test.getPath()) }
                    </RX.Text>
                    { rightButton }
                </RX.View>
                { optionalResultSection }
                { testContainer }
            </RX.View>
        );
    }

    private _onBack = () => {
        this.props.onBack();
    }

    private _onRunTest = () => {
        this._executeTest();
    }

    private _executeTest() {
        this.setState({ isTestRunning: true });

        let test = TestRegistry.getTest(this.props.test);
        let testType = test.getTestType();

        if (testType === TestType.AutoExecutable) {
            (test as AutoExecutableTest).execute(this.state.mountedComponent, result => {
                // Record the results.
                TestRegistry.setResult(this.props.test, result);

                this.setState({ isTestRunning: false, result });

                // Automatically go back.
                if (this.props.autoRun) {
                    this.props.onBack();
                }
            });
        } else {
            let result = new TestResult();
            if (testType === TestType.Interactive) {
                result.userValidated = false;
                TestRegistry.setResult(this.props.test, result);
            } else {
                // For render-only tests, always report success.
                TestRegistry.setResult(this.props.test, result);
            }

            // Automatically go back.
            if (this.props.autoRun) {
                this.props.onBack();
            }
        }
    }

    private _onCompleteInteractiveTest = () => {
        // This should be called only if the test type is interactive.
        let result = new TestResult();
        result.userValidated = true;
        TestRegistry.setResult(this.props.test, result);

        this.props.onBack();
    }

    private _onMountTestUI = (component: any) => {
        // Record the mounted component. This will trigger
        // the test to run if the autoRun prop is set.
        if (component) {
            this.setState({ mountedComponent: component });
        }
    }
}
