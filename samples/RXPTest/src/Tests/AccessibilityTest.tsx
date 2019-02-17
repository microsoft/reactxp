/*
* Tests the RX.Accessibility APIs in an interactive manner.
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

interface AccessibilityState {
    isHighContrastEnabled?: boolean;
    isScreenReaderEnabled?: boolean;
}

class AccessibilityView extends RX.Component<RX.CommonProps, AccessibilityState> {
    private _highContrastEvent: RX.Types.SubscriptionToken | undefined;
    private _screenReaderEvent: RX.Types.SubscriptionToken | undefined;

    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            isHighContrastEnabled: RX.Accessibility.isHighContrastEnabled(),
            isScreenReaderEnabled: RX.Accessibility.isScreenReaderEnabled()
        };
    }

    componentDidMount() {
        this._highContrastEvent = RX.Accessibility.highContrastChangedEvent.subscribe(isEnabled => {
            this.setState({ isHighContrastEnabled: isEnabled });
        });

        this._screenReaderEvent = RX.Accessibility.screenReaderChangedEvent.subscribe(isEnabled => {
            this.setState({ isScreenReaderEnabled: isEnabled });
        });
    }

    componentWillUnmount() {
        if (this._highContrastEvent) {
            this._highContrastEvent.unsubscribe();
        }

        if (this._screenReaderEvent) {
            this._screenReaderEvent.unsubscribe();
        }
    }

    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.textContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Is the screen reader enabled?' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer }>
                    <RX.Text style={ _styles.labelText }>
                        { this.state.isScreenReaderEnabled ? 'Screen Reader On' : 'Screen Reader Off' }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Is high-contrast mode enabled?' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer }>
                    <RX.Text style={ _styles.labelText }>
                        { this.state.isHighContrastEnabled ? 'High Contrast On' : 'High Contrast Off' }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation3' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Press button to send "Hello" to the screen reader.' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button }
                    onPress={ () => this._sendTextToScreenReader('Hello') }
                >
                    <RX.Text style={ _styles.buttonText }>
                        { 'Send "Hello" to Screen Reader' }
                    </RX.Text>
                </RX.Button>

                <RX.View style={ _styles.textContainer } key={ 'explanation4' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Validate that the screen reader reads "5, Mock Slider, Slider" when focus is on "Mock Slider" text below.' }
                    </RX.Text>
                    <RX.View
                        ariaValueNow={ 5 }
                        accessibilityTraits={ RX.Types.AccessibilityTrait.Adjustable }
                        accessibilityLabel={ 'Mock Slider' }
                        tabIndex={ 0 }>
                        <RX.Text>
                            { 'Mock Slider' }
                        </RX.Text>
                    </RX.View>
                </RX.View>
            </RX.View>
        );
    }

    private _sendTextToScreenReader(text: string) {
        RX.Accessibility.announceForAccessibility(text);
    }
}

class AccessibilityTest implements Test {
    getPath(): string {
        return 'APIs/Accessibility';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <AccessibilityView
                ref={ onMount }
            />
        );
    }
}

export default new AccessibilityTest();
