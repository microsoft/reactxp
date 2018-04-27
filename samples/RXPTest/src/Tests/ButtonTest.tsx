/*
* Tests the functionality of a Button component rendering
* that requires user interaction.
*/

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
    button1: RX.Styles.createButtonStyle({
        backgroundColor: '#ddd',
        borderWidth: 1,
        margin: 20,
        padding: 12,
        borderRadius: 8,
        borderColor: 'black'
    }),
    button1Hover: RX.Styles.createButtonStyle({
        backgroundColor: '#666'
    }),
    button1Text: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: 'black'
    }),
    button1TextHover: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: 'white'
    }),
    button2: RX.Styles.createButtonStyle({
        backgroundColor: '#ddd',
        borderWidth: 1,
        margin: 20,
        padding: 12,
        borderRadius: 8,
        borderColor: 'black'
    }),
    button2Text: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: 'black'
    }),
    explainTextContainer: RX.Styles.createViewStyle({
        margin: 12
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    }),
    buttonWithLabelContainer: RX.Styles.createViewStyle({
        flexDirection: 'row'
    }),
    buttonLabelContainer: RX.Styles.createViewStyle({
        flexDirection: 'column',
        margin: 20
    }),
    labelText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: 'black'
    })
};

interface ButtonViewState {
    button1Hover?: boolean;

    button4PressInCount?: number;
    button4PressOutCount?: number;
    button4PressCount?: number;

    button5PressCount?: number;
    button5LongPressCount?: number;
}

class ButtonView extends RX.Component<RX.CommonProps, ButtonViewState> {
    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            button1Hover: false,
            button4PressInCount: 0,
            button4PressOutCount: 0,
            button4PressCount: 0,
            button5PressCount: 0,
            button5LongPressCount: 0
        };
    }

    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.explainTextContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This button should change in appearance when the mouse pointer is above ' +
                          'it (valid only on mouse-based platforms).' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ [_styles.button1, this.state.button1Hover && _styles.button1Hover] }
                    onHoverStart={ () => { this.setState({ button1Hover: true }); } }
                    onHoverEnd={ () => { this.setState({ button1Hover: false }); } }
                    onPress={ () => {
                        // no-op
                    } }
                >
                    <RX.Text style={ [_styles.button1Text, this.state.button1Hover && _styles.button1TextHover] }>
                        { 'Button With Hover' }
                    </RX.Text>
                </RX.Button>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This button should be disabled and respond to no clicks, presses, or hovers. ' +
                          'The mouse pointer should not turn into a pointer.' +
                          'The opacity of the disabled button should be its default value of 0.5' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button2 }
                    disabled={ true }
                    onPress={ () => {
                        // no-op
                    } }
                >
                    <RX.Text style={ _styles.button2Text }>
                        { 'Disabled Button' }
                    </RX.Text>
                </RX.Button>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation3' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This button should be disabled and respond to no clicks, presses, or hovers. ' +
                          'The mouse pointer should not turn into a pointer.' +
                          'The opacity of the disabled button should be 0.3' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button2 }
                    disabled={ true }
                    disabledOpacity={ 0.3 }
                    onPress={ () => {
                        // no-op
                    } }
                >
                    <RX.Text style={ _styles.button2Text }>
                        { 'Disabled Button' }
                    </RX.Text>
                </RX.Button>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation4' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This button have a tooltip when hovering over it (mouse-based platforms only).' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button2 }
                    title={ 'Do you see this tooltip?' }
                    onPress={ () => {
                        // no-op
                    } }
                >
                    <RX.Text style={ _styles.button2Text }>
                        { 'Button with tooltip' }
                    </RX.Text>
                </RX.Button>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation5' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This button should receive pressIn, pressOut and press events when you click or tap on it.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.buttonWithLabelContainer }>
                    <RX.Button
                        style={ _styles.button2 }
                        onPressIn={ () => this.setState({ button4PressInCount: this.state.button4PressInCount + 1 }) }
                        onPressOut={ () => this.setState({ button4PressOutCount: this.state.button4PressOutCount + 1 }) }
                        onPress={ () => this.setState({ button4PressCount: this.state.button4PressCount + 1 }) }
                    >
                        <RX.Text style={ _styles.button2Text }>
                            { 'Button with press' }
                        </RX.Text>
                    </RX.Button>
                    <RX.View style={ _styles.buttonLabelContainer }>
                        <RX.Text style={ _styles.labelText } key={ 'pressIn' }>
                            { 'PressIn count: ' + this.state.button4PressInCount }
                        </RX.Text>
                        <RX.Text style={ _styles.labelText } key={ 'pressOut' }>
                            { 'PressOut count: ' + this.state.button4PressOutCount }
                        </RX.Text>
                        <RX.Text style={ _styles.labelText } key={ 'press' }>
                            { 'Press count: ' + this.state.button4PressCount }
                        </RX.Text>
                    </RX.View>
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation6' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This button should differentiate between press and long-press actions. ' +
                          'Click or tap and hold for more than one second for a long press.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.buttonWithLabelContainer }>
                    <RX.Button
                        style={ _styles.button2 }
                        delayLongPress={ 1000 }
                        onPress={ () => this.setState({ button5PressCount: this.state.button5PressCount + 1 }) }
                        onLongPress={ () => this.setState({ button5LongPressCount: this.state.button5LongPressCount + 1 }) }
                    >
                        <RX.Text style={ _styles.button2Text }>
                            { 'Button with long press' }
                        </RX.Text>
                    </RX.Button>
                    <RX.View style={ _styles.buttonLabelContainer }>
                        <RX.Text style={ _styles.labelText } key={ 'press' }>
                            { 'Press count: ' + this.state.button5PressCount }
                        </RX.Text>
                        <RX.Text style={ _styles.labelText } key={ 'longpress' }>
                            { 'Long press count: ' + this.state.button5LongPressCount }
                        </RX.Text>
                    </RX.View>
                </RX.View>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation7' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This button should change opacity to 25% when pressing (touch-based platforms only). ' +
                          'The underlay color should appear red.' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button2 }
                    activeOpacity={ 0.25 }
                    underlayColor={ 'red' }
                    disableTouchOpacityAnimation={ false }
                    onPress={ () => {
                        // no-op
                    } }
                >
                    <RX.Text style={ _styles.button2Text }>
                        { 'Button with opacity' }
                    </RX.Text>
                </RX.Button>

                <RX.View style={ _styles.explainTextContainer } key={ 'explanation8' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'This button should not exhibit any opacity animation when pressed (touch-based platforms only).' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button2 }
                    disableTouchOpacityAnimation={ true }
                    onPress={ () => {
                        // no-op
                    } }
                >
                    <RX.Text style={ _styles.button2Text }>
                        { 'Button with no opacity' }
                    </RX.Text>
                </RX.Button>

            </RX.View>
        );
    }
}

class ButtonTest implements Test {
    getPath(): string {
        return 'Components/Button';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <ButtonView ref={ onMount }/>
        );
    }
}

export default new ButtonTest();
