/*
* Tests the RX.Input APIs.
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
    aiContainer: RX.Styles.createViewStyle({
        margin: 20
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
        color: 'black'
    })
};

interface InputState {
    backButtonCount?: number;

    keyDownCount?: number;
    lastKeyDownKey?: string;
    lastKeyDownModifiers?: string;

    keyUpCount?: number;
    lastKeyUpKey?: string;
    lastKeyUpModifiers?: string;
}

class InputView extends RX.Component<RX.CommonProps, InputState> {
    private _backButtonEvent: RX.Types.SubscriptionToken;
    private _keyDownEvent: RX.Types.SubscriptionToken;
    private _keyUpEvent: RX.Types.SubscriptionToken;

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            backButtonCount: 0,
            keyDownCount: 0,
            lastKeyDownKey: '',
            lastKeyDownModifiers: '',
            keyUpCount: 0,
            lastKeyUpKey: '',
            lastKeyUpModifiers: ''
        };
    }

    componentDidMount() {
        this._backButtonEvent = RX.Input.backButtonEvent.subscribe(() => {
            this.setState({
                backButtonCount: this.state.backButtonCount + 1
            });
            return true;
        });

        this._keyDownEvent = RX.Input.keyDownEvent.subscribe(e => {
            this.setState({
                keyDownCount: this.state.keyDownCount + 1,
                lastKeyDownKey: 'Key = "' + e.key + '", Code = ' + e.keyCode,
                lastKeyDownModifiers: 'Ctrl = ' + e.ctrlKey + ', Alt = ' + e.altKey +
                    ', Shift = ' + e.shiftKey

            });
            return true;
        });

        this._keyUpEvent = RX.Input.keyUpEvent.subscribe(e => {
            this.setState({
                keyUpCount: this.state.keyUpCount + 1,
                lastKeyUpKey: 'Key = "' + e.key + '", Code = ' + e.keyCode,
                lastKeyUpModifiers: 'Ctrl = ' + e.ctrlKey + ', Alt = ' + e.altKey +
                    ', Shift = ' + e.shiftKey

            });
            return true;
        });

    }

    componentWillUnmount() {
        this._backButtonEvent.unsubscribe();
        this._keyDownEvent.unsubscribe();
        this._keyUpEvent.unsubscribe();
    }

    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.textContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Pressing the back button (Android only) should increment the count below.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.textContainer } key={ 'back' }>
                    <RX.Text style={ _styles.labelText }>
                        { 'Back button events: ' + this.state.backButtonCount }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Pressing a keyboard button (keyboard-based platforms only) should increment the counts below.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.textContainer } key={ 'keyDown' }>
                    <RX.Text style={ _styles.labelText }>
                        { 'Key down events: ' + this.state.keyDownCount }
                    </RX.Text>
                    <RX.Text style={ _styles.labelText }>
                        { 'Last key: ' + this.state.lastKeyDownKey }
                    </RX.Text>
                    <RX.Text style={ _styles.labelText }>
                        { 'Last modifiers: ' + this.state.lastKeyDownModifiers }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.textContainer } key={ 'keyUp' }>
                    <RX.Text style={ _styles.labelText }>
                        { 'Key up events: ' + this.state.keyUpCount }
                    </RX.Text>
                    <RX.Text style={ _styles.labelText }>
                        { 'Last key: ' + this.state.lastKeyUpKey }
                    </RX.Text>
                    <RX.Text style={ _styles.labelText }>
                        { 'Last modifiers: ' + this.state.lastKeyUpModifiers }
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
    }
}

class InputTest implements Test {
    getPath(): string {
        return 'APIs/Input';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <InputView
                ref={ onMount }
            />
        );
    }
}

export default new InputTest();
