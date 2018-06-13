/*
* Tests the RX.App APIs in an interactive manner.
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
    historyText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: 'black'
    })
};

interface AppState {
    activationState?: RX.Types.AppActivationState;
    activationHistory?: string;

    focusState?: boolean;
    focusHistory?: string;

    memoryWarningCount?: number;
}

class AppView extends RX.Component<RX.CommonProps, AppState> {
    private _appActivationEvent: RX.Types.SubscriptionToken;
    private _appFocusChangedEvent: RX.Types.SubscriptionToken;
    private _memoryWarningEvent: RX.Types.SubscriptionToken;

    constructor(props: RX.CommonProps) {
        super(props);

        let curState = RX.App.getActivationState();
        let focusState = RX.App.isAppFocused();

        this.state = {
            activationState: curState,
            activationHistory: this._activationStateToString(curState),
            focusState,
            focusHistory: this._focusStateToString(focusState),
            memoryWarningCount: 0
        };
    }

    componentDidMount() {
        this._appActivationEvent = RX.App.activationStateChangedEvent.subscribe(state => {
            this.setState({
                activationState: state,
                activationHistory: this.state.activationHistory + '\n' + this._activationStateToString(state)
            });
        });

        this._appFocusChangedEvent = RX.App.appFocusChangedEvent.subscribe(state => {
            this.setState({
                focusState: state,
                focusHistory: this.state.focusHistory + '\n' + this._focusStateToString(state)
            });
        });

        this._memoryWarningEvent = RX.App.memoryWarningEvent.subscribe(() => {
            this.setState({ memoryWarningCount: this.state.memoryWarningCount + 1 });
        });
    }

    componentWillUnmount() {
        this._appActivationEvent.unsubscribe();
        this._memoryWarningEvent.unsubscribe();
    }

    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.textContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Current app activation state:' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer }>
                    <RX.Text style={ _styles.labelText }>
                        { this._activationStateToString(this.state.activationState) }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Move app into background and foreground to change the state. The history is recorded here.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer }>
                    <RX.Text style={ _styles.historyText }>
                        { this.state.activationHistory }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation3' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Current app focus state:' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer }>
                    <RX.Text style={ _styles.labelText }>
                        { this._focusStateToString(this.state.focusState) }
                    </RX.Text>
                </RX.View>

                 <RX.View style={ _styles.textContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Move app focus in and out of the app. The history is recorded here.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer }>
                    <RX.Text style={ _styles.historyText }>
                        { this.state.focusHistory }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation3' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Launch other apps to create memory pressure.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer }>
                    <RX.Text style={ _styles.historyText }>
                        { 'Memory warning events received: ' + this.state.memoryWarningCount }
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
    }

    private _activationStateToString(state: RX.Types.AppActivationState): string {
        return RX.Types.AppActivationState[state];
    }

     private _focusStateToString(state: boolean): string {
         return state ? 'Focused' : 'Blurred';
     }
}

class AppTest implements Test {
    getPath(): string {
        return 'APIs/App';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <AppView
                ref={ onMount }
            />
        );
    }
}

export default new AppTest();
