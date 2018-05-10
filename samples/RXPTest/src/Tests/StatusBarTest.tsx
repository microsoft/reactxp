/*
* Tests the RX.StatusBar APIs in an interactive manner.
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
    }),
    buttonBank: RX.Styles.createViewStyle({
        flexDirection: 'row'
    })
};

interface StatusBarViewState {
    isStatusBarHidden?: boolean;
    barStyle?: 'default' | 'light-content' | 'dark-content';
    isNetworkVisible?: boolean;
    backgroundColorIndex?: number;
    isTranslucent?: boolean;
}

class StatusBarView extends RX.Component<RX.CommonProps, StatusBarViewState> {
    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            isStatusBarHidden: false,
            barStyle: 'default',
            isNetworkVisible: true,
            backgroundColorIndex: 0,
            isTranslucent: false
        };
    }

    componentWillUnmount() {
        // Reset the status bar state.
        RX.StatusBar.setHidden(false, 'fade');
        RX.StatusBar.setBarStyle('default', true);
        RX.StatusBar.setNetworkActivityIndicatorVisible(true);
        RX.StatusBar.setBackgroundColor('black', true);
        RX.StatusBar.setTranslucent(false);
    }

    render() {
        let styles = ['default', 'light-content', 'dark-content'];
        let styleButtons = styles.map(style => {
            return (
                <RX.Button
                    key={ style }
                    style={ _styles.button }
                    onPress={ () => this._setStatusBarStyle(style as any) }
                    disabled={ this.state.barStyle === style }
                >
                    <RX.Text style={ _styles.buttonText }>
                        { style }
                    </RX.Text>
                </RX.Button>
            );
        });

        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.textContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Is the status bar an "overlay" type (as on iOS)?' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.labelContainer } key={ 'platform' }>
                    <RX.Text style={ _styles.labelText }>
                        { RX.StatusBar.isOverlay() ? 'Overlay' : 'Not Overlay' }
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Press button to hide and show the status bar.' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button }
                    onPress={ () => this._toggleStatusBar('fade') }
                >
                    <RX.Text style={ _styles.buttonText }>
                        { this.state.isStatusBarHidden ? 'Show (Fade)' : 'Hide (Fade)' }
                    </RX.Text>
                </RX.Button>
                <RX.Button
                    style={ _styles.button }
                    onPress={ () => this._toggleStatusBar('slide') }
                >
                    <RX.Text style={ _styles.buttonText }>
                        { this.state.isStatusBarHidden ? 'Show (Slide)' : 'Hide (Slide)' }
                    </RX.Text>
                </RX.Button>

                <RX.View style={ _styles.textContainer } key={ 'explanation4' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Press buttons to change the status bar style.' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ _styles.buttonBank }>
                    { styleButtons }
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation5' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Press button to toggle the network activity indicator (iOS only).' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button }
                    onPress={ () => this._toggleNetworkIndicator() }
                >
                    <RX.Text style={ _styles.buttonText }>
                        { this.state.isNetworkVisible ? 'Hide Network Indicator' : 'Show Network Indicator' }
                    </RX.Text>
                </RX.Button>

                <RX.View style={ _styles.textContainer } key={ 'explanation6' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Press button to change the background color of the status bar (Android only).' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button }
                    onPress={ () => this._changeBackgroundColor() }
                >
                    <RX.Text style={ _styles.buttonText }>
                        { 'Change Background Color' }
                    </RX.Text>
                </RX.Button>

                <RX.View style={ _styles.textContainer } key={ 'explanation7' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Press button to toggle between transluscent and opaque (Android only).' }
                    </RX.Text>
                </RX.View>
                <RX.Button
                    style={ _styles.button }
                    onPress={ () => this._toggleTranslucent() }
                >
                    <RX.Text style={ _styles.buttonText }>
                        { 'Make ' + (this.state.isTranslucent ? 'Opaque' : 'Translucent') }
                    </RX.Text>
                </RX.Button>

            </RX.View>
        );
    }

    private _toggleStatusBar(effect: 'fade' | 'slide') {
        RX.StatusBar.setHidden(!this.state.isStatusBarHidden, effect);

        this.setState({
            isStatusBarHidden: !this.state.isStatusBarHidden
        });
    }

    private _setStatusBarStyle(style: 'default' | 'light-content' | 'dark-content') {
        RX.StatusBar.setBarStyle(style, true);

        this.setState({
            barStyle: style
        });
    }

    private _toggleNetworkIndicator() {
        RX.StatusBar.setNetworkActivityIndicatorVisible(!this.state.isNetworkVisible);

        this.setState({
            isNetworkVisible: !this.state.isNetworkVisible
        });
    }

    private _changeBackgroundColor() {
        let colors = ['black', 'white', 'green', 'blue', 'red'];
        let newIndex = (this.state.backgroundColorIndex + 1) % colors.length;

        RX.StatusBar.setBackgroundColor(colors[newIndex], true);

        this.setState({
            backgroundColorIndex: newIndex
        });
    }

    private _toggleTranslucent() {
        RX.StatusBar.setTranslucent(!this.state.isTranslucent);

        this.setState({
            isTranslucent: !this.state.isTranslucent
        });
    }
}

class StatusBarTest implements Test {
    getPath(): string {
        return 'APIs/StatusBar';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <StatusBarView
                ref={ onMount }
            />
        );
    }
}

export default new StatusBarTest();
