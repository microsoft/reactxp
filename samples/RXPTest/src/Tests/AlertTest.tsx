/*
* Tests the RX.Alert APIs in an interactive manner.
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
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    labelText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
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
    }),
    buttonPanel: RX.Styles.createViewStyle({
        flexDirection: 'row'
    }),
    alertBody: RX.Styles.createViewStyle({
        backgroundColor: '#333',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 8
    }),
    alertTitleText: RX.Styles.createTextStyle({
        fontSize: 24,
        fontStyle: 'italic',
        color: '#eee'
    }),
    alertMessageText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: '#eee'
    }),
    alertButton: RX.Styles.createButtonStyle({
        backgroundColor: '#ff8',
        borderRadius: 8
    }),
    alertButtonHover: RX.Styles.createButtonStyle({
        backgroundColor: '#dd8'
    }),
    alertButtonText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: 'black'
    }),
    alertCancelButton: RX.Styles.createButtonStyle({
        backgroundColor: '#f88',
        borderRadius: 8
    }),
    alertCancelButtonHover: RX.Styles.createButtonStyle({
        backgroundColor: '#fcc'
    }),
    alertCancelButtonText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        fontWeight: 'bold',
        color: 'white'
    })
};

interface AlertViewState {
    lastOption?: string;
}

class AlertView extends RX.Component<RX.CommonProps, AlertViewState> {
    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            lastOption: ''
        };
    }

    render() {
        return (
            <RX.View style={_styles.container}>
                <RX.View style={_styles.textContainer} key={'explanation1'}>
                    <RX.Text style={_styles.explainText}>
                        {'Press the button to display an alert.'}
                    </RX.Text>
                </RX.View>
                <RX.View style={_styles.buttonPanel}>
                    <RX.Button
                        style={_styles.button}
                        onPress={() => this._showAlert(false, false)}
                    >
                        <RX.Text style={_styles.buttonText}>
                            {'Alert (Default)'}
                        </RX.Text>
                    </RX.Button>
                    <RX.Button
                        style={_styles.button}
                        onPress={() => this._showAlert(false, true)}
                    >
                        <RX.Text style={_styles.buttonText}>
                            {'Alert (Default - preventDismissOnPress)'}
                        </RX.Text>
                    </RX.Button>
                    <RX.Button
                        style={_styles.button}
                        onPress={() => this._showAlert(true, false)}
                    >
                        <RX.Text style={_styles.buttonText}>
                            {'Alert (Custom)'}
                        </RX.Text>
                    </RX.Button>
                </RX.View>
                <RX.View style={_styles.textContainer}>
                    <RX.Text style={_styles.labelText}>
                        {this.state.lastOption && 'You chose: ' + this.state.lastOption}
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
    }

    private _showAlert(custom: boolean, preventDismissOnPress: boolean) {
        const theme = {
            bodyStyle: _styles.alertBody,
            titleTextStyle: _styles.alertTitleText,
            messageTextStyle: _styles.alertMessageText,
            buttonStyle: _styles.alertButton,
            buttonHoverStyle: _styles.alertButtonHover,
            buttonTextStyle: _styles.alertButtonText,
            cancelButtonStyle: _styles.alertCancelButton,
            cancelButtonHoverStyle: _styles.alertCancelButtonHover,
            cancelButtonTextStyle: _styles.alertCancelButtonText,
        };

        RX.Alert.show('Default Alert', 'Which option would you like to choose?',
            [
                { text: 'Option 1', onPress: () => this._setLastOption('Option 1'), style: 'default' },
                { text: 'Option 2', onPress: () => this._setLastOption('Option 2') },
                { text: 'Option 3', onPress: () => this._setLastOption('Option 3') },
                { text: 'Destructive', onPress: () => this._setLastOption('Destructive'), style: 'destructive' },
                { text: 'Cancel', onPress: () => this._setLastOption('Cancel'), style: 'cancel' }
            ],
            {
                preventDismissOnPress,
                theme: custom ? theme : undefined
            }
        );
    }

    private _setLastOption(option: string) {
        this.setState({ lastOption: option });
    }
}

class AlertTest implements Test {
    getPath(): string {
        return 'APIs/Alert';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <AlertView
                ref={onMount}
            />
        );
    }
}

export default new AlertTest();
