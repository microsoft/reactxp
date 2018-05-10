/*
* Tests the RX.UserPresence APIs in an interactive manner.
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
    })
};

interface UserPresenceViewState {
    isUserPresent?: boolean;
}

class UserPresenceView extends RX.Component<RX.CommonProps, UserPresenceViewState> {
    private _presencesChangedEvent: RX.Types.SubscriptionToken;

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            isUserPresent: RX.UserPresence.isUserPresent()
        };
    }

    componentDidMount() {
        this._presencesChangedEvent = RX.UserPresence.userPresenceChangedEvent.subscribe(isPresent => {
            this.setState({
                isUserPresent: isPresent
            });
        });
    }

    componentWillUnmount() {
        this._presencesChangedEvent.unsubscribe();
    }

    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.textContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Is the user currently present? Depending on the platform, placing the app in ' +
                          'the background or leaving it idle may change this state.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer } key={ 'platform' }>
                    <RX.Text style={ _styles.labelText }>
                        { this.state.isUserPresent ? 'Present' : 'Away' }
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
    }
}

class UserPresenceTest implements Test {
    getPath(): string {
        return 'APIs/UserPresence';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <UserPresenceView
                ref={ onMount }
            />
        );
    }
}

export default new UserPresenceTest();
