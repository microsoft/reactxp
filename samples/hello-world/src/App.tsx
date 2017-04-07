/*
* This file demonstrates a basic ReactXP app.
*/

import RX = require('reactxp');

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
        color: 'blue'
    })
};

class App extends RX.Component<null, null> {
    private _translationValue: RX.Animated.Value;
    private _scaleValue: RX.Animated.Value;
    private _animatedStyle: RX.Types.AnimatedTextStyleRuleSet;

    constructor() {
        super();

        this._translationValue = new RX.Animated.Value(-100);
        this._scaleValue = new RX.Animated.Value(0.5);
        this._animatedStyle = RX.Styles.createAnimatedTextStyle({
            transform: [
                {
                    translateY: this._translationValue
                },
                {
                    scale: this._scaleValue
                }
            ]
        });
    }

    componentDidMount() {
        let animation = RX.Animated.parallel([
            RX.Animated.timing(this._translationValue, {
                toValue: 0,
                easing: RX.Animated.Easing.OutBack(),
                duration: 500
            }),
            RX.Animated.timing(this._scaleValue, {
                toValue: 1,
                easing: RX.Animated.Easing.InOut(),
                duration: 500
            })
        ]);

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
            </RX.View>
        );
    }
}

export = App;
