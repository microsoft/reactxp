/*
* Tests the RX.International APIs in an interactive manner.
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
    })
};

interface InternationalState {
    isRtlAllowed?: boolean;
    isRtlForced?: boolean;
}

class InternationalView extends RX.Component<RX.CommonProps, InternationalState> {
    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            isRtlAllowed: true,
            isRtlForced: false
        };
    }

    componentWillUnmount() {
        // Restore default values.
        if (!this.state.isRtlAllowed) {
            RX.International.allowRTL(true);
        }

        if (this.state.isRtlForced) {
            RX.International.forceRTL(false);
        }
    }

    render() {
        return (
            <RX.View style={ _styles.container }>
                <RX.View style={ _styles.textContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Is the app currently running in left-to-right (LTR) or right-to-left (RTL) mode?' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer }>
                    <RX.Text style={ _styles.labelText }>
                        { RX.International.isRTL() ? 'RTL' : 'LTR' }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Is RTL allowed? This change won\'t be visible because it must be set at app start time.' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button }
                    onPress={ this._toggleAllowRtl }
                >
                    <RX.Text style={ _styles.buttonText }>
                        { this.state.isRtlAllowed ? 'Prevent RTL' : 'Allow RTL' }
                    </RX.Text>
                </RX.Button>

                <RX.View style={ _styles.textContainer } key={ 'explanation3' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Force the use of RTL? This change won\'t be visible because it must be set at app start time.' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button }
                    onPress={ this._toggleForceRtl }
                >
                    <RX.Text style={ _styles.buttonText }>
                        { this.state.isRtlForced ? 'Don\'t Force RTL' : 'Force RTL' }
                    </RX.Text>
                </RX.Button>
            </RX.View>
        );
    }

    private _toggleAllowRtl = () => {
        RX.International.allowRTL(!this.state.isRtlAllowed);
        this.setState({ isRtlAllowed: !this.state.isRtlAllowed });
    }

    private _toggleForceRtl = () => {
        RX.International.forceRTL(!this.state.isRtlForced);
        this.setState({ isRtlForced: !this.state.isRtlForced });
    }
}

class InternationalTest implements Test {
    getPath(): string {
        return 'APIs/International';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <InternationalView
                ref={ onMount }
            />
        );
    }
}

export default new InternationalTest();
