/*
* A visual container for an individual test. It includes
* UI elements for executing the test and for reporting status.
*/

import RX = require('reactxp');

import * as CommonStyles from './CommonStyles';
import { TestResult } from './Test';
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
    warningText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.warningTextColor
    }),
    successText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.successTextColor
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
            if (!this.state.isTestRunning) {
                this._executeTest();
            }
        }
    }

    render() {
        let test = TestRegistry.getTest(this.props.test);

        let testResults: JSX.Element;
        let result = this.state.result || this.props.prevResult;
        let resultText: JSX.Element[] = [];
        if (!result) {
            resultText.push(
                <RX.View style={ _styles.resultItem } key='notrun'>
                    <RX.Text style={ _styles.notRunText }>
                        { 'Test not run' }
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
                )
            });
        
            result.warnings.forEach((warning, index) => {
                resultText.push(
                    <RX.View style={ _styles.resultItem } key={ 'warn' + index }>
                        <RX.Text style={ _styles.warningText }>
                            { warning }
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

        return (
            <RX.View style={ _styles.container }>
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
                    <RX.Text style={ _styles.titleText }>
                        { TestRegistry.formatPath(test.getPath()) }
                    </RX.Text>
                    <RX.Button
                        style={ _styles.button }
                        onPress={ this._onRun }
                        disabled={ this.state.isTestRunning }
                    >
                        <RX.Text style={ _styles.buttonText }>
                            { 'Run' }
                        </RX.Text>
                    </RX.Button>
                </RX.View>
                <RX.View style={ _styles.resultContainer }>
                    <RX.ScrollView style={ _styles.resultScrollView }>
                        { resultText }
                    </RX.ScrollView>
                </RX.View>
                <RX.View>
                    { test.render(this._onMountTestUI) }
                </RX.View>
            </RX.View>
        );
    }

    private _onBack = () => {
        this.props.onBack();
    }

    private _onRun = () => {
        this._executeTest();
    }

    private _executeTest() {
        this.setState({ isTestRunning: true });

        let test = TestRegistry.getTest(this.props.test);
        test.execute(this.state.mountedComponent, result => {
            // Record the results.
            TestRegistry.setResult(this.props.test, result);

            this.setState({ isTestRunning: false, result });

            // Automatically go back if we're auto-running.
            if (this.props.autoRun) {
                this.props.onBack();
            }
        });
    }

    private _onMountTestUI = (component: any) => {
        // Record the mounted component. This will trigger
        // the test to run if the autoRun prop is set.
        this.setState({ mountedComponent: component });
    }
}
