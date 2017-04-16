/*
* This file demonstrates a basic ReactXP app.
*/

import RX = require('reactxp');

import ToggleSwitch from './ToggleSwitch';

interface AppState {
    toggleValue?: boolean;
}

const styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff'
    }),
    helloWorld: RX.Styles.createTextStyle({
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 28
    }),
    welcome: RX.Styles.createTextStyle({
        fontSize: 32,
        marginBottom: 12
    }),
    instructions: RX.Styles.createTextStyle({
        fontSize: 16,
        color: '#aaa',
        marginBottom: 40
    }),
    docLink: RX.Styles.createLinkStyle({
        fontSize: 16,
        color: 'blue',
        marginBottom: 40
    }),
    toggleTitle: RX.Styles.createTextStyle({
        fontSize: 16,
        color: 'black'
    })
};

class App extends RX.Component<null, AppState> {
    private _translationValue: RX.Animated.Value;
    private _animatedStyle: RX.Types.AnimatedTextStyleRuleSet;

    constructor() {
        super();

        this._translationValue = new RX.Animated.Value(-100);
        this._animatedStyle = RX.Styles.createAnimatedTextStyle({
            transform: [
                {
                    translateY: this._translationValue
                }
            ]
        });

        this.state = {
            toggleValue: true
        };
    }

    componentDidMount() {
        let animation = RX.Animated.timing(this._translationValue, {
              toValue: 0,
              easing: RX.Animated.Easing.OutBack(),
              duration: 500
            }
        );

        animation.start();
    }

    render(): JSX.Element | null {
        return (
            <RX.View style={ styles.container }>
                <RX.Animated.Text style={ [styles.helloWorld, this._animatedStyle] }>
                    Hello World
                </RX.Animated.Text>
                <RX.Text style={ styles.welcome }>
                    Welcome to ReactXP
                </RX.Text>
                <RX.Text style={ styles.instructions }>
                    Edit App.tsx to get started
                </RX.Text>
                <RX.Link style={ styles.docLink } url={ 'https://microsoft.github.io/reactxp/docs' }>
                    View ReactXP documentation
                </RX.Link>

                <RX.Text style={ styles.toggleTitle }>
                    Here is a simple control built using ReactXP
                </RX.Text>
                <ToggleSwitch
                    value={ this.state.toggleValue }
                    onChange={ this._onChangeToggle }
                />
            </RX.View>
        );
    }

    // Note that we define this as a variable rather than a normal method. Using this
    // method, we prebind the method to this component instance. This prebinding ensures
    // that each time we pass the variable as a prop in the render function, it will
    // not change. We want to avoid unnecessary prop changes because this will trigger
    // extra work within React's virtual DOM diffing mechanism.
    private _onChangeToggle = (newValue: boolean) => {
        this.setState({ toggleValue: newValue });
    }
}

export = App;
