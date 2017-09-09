/*
* This file demonstrates a basic ReactXP app.
*/

import RX = require('reactxp');

interface MainPanelProps {
    onPressNavigate: () => void;
}

const styles = {
    scroll: RX.Styles.createScrollViewStyle({
        alignSelf: 'stretch',
        backgroundColor: '#f5fcff'
    }),
    container: RX.Styles.createViewStyle({
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center'
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
        marginBottom: 16
    }),
    docLink: RX.Styles.createLinkStyle({
        fontSize: 16,
        color: 'blue',
        marginBottom: 16
    }),
    roundButton: RX.Styles.createViewStyle({
        margin: 16,
        borderRadius: 16,
        backgroundColor: '#7d88a9'
    }),
    buttonText: RX.Styles.createTextStyle({
        fontSize: 16,
        marginVertical: 6,
        marginHorizontal: 12,
        color: 'white'
    })
};

const alertStyles = {
    overlay: RX.Styles.createViewStyle({
        backgroundColor: 'rgba(255, 0, 0, 0.5)'
    }),
    body: RX.Styles.createViewStyle({
        backgroundColor: '#f5fcff',
        width: 700
    }),
    titleText: RX.Styles.createTextStyle({
        fontSize: 20
    }),
    messageText: RX.Styles.createTextStyle({
        marginVertical: 12
    }),
    button: RX.Styles.createViewStyle({
        borderRadius: 0,
        backgroundColor: '#7d88a9',
        borderWidth: 0
    }),
    cancelButton: RX.Styles.createButtonStyle({
        backgroundColor: 'rgba(0, 255, 0, 0.7)',
        borderRadius: 25
    }),
    cancelButtonText: RX.Styles.createTextStyle({
        color: 'black'
    }),
    destructiveButton: RX.Styles.createButtonStyle({
        backgroundColor: '#7d88a9'
    })
};

class MainPanel extends RX.Component<MainPanelProps, null> {
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

    render() {
        return (
            <RX.ScrollView style={ styles.scroll }>
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
                    
                    <RX.Button style={ styles.roundButton } onPress={ this._onPressNavigate }>
                        <RX.Text style={ styles.buttonText }>
                            See More Examples
                        </RX.Text>
                    </RX.Button>
                    
                    <RX.Button style={ styles.roundButton } onPress={ this._onPressAlert }>
                        <RX.Text style={ styles.buttonText }>
                            See an Alert
                        </RX.Text>
                    </RX.Button>

                    <RX.Button style={ styles.roundButton } onPress={ this._onPressThemedAlert }>
                        <RX.Text style={ styles.buttonText }>
                            See a themed Alert
                        </RX.Text>
                    </RX.Button>
                </RX.View>
            </RX.ScrollView>
        );
    }
    
    private _onPressNavigate = () => {
        this.props.onPressNavigate();
    }
    
    private _onPressAlert = () => {
        RX.Alert.show('This is an Alert', 'Do you like it?', [
            { text: 'I like it!' },
            { style: 'destructive', text: 'I don\'t like it!' },
            { style: 'cancel', text: 'Close this' }
        ]);
    }
    
    private _onPressThemedAlert = () => {
        let theme: RX.Types.AlertModalTheme = {
            overlayStyle: alertStyles.overlay,
            bodyStyle: alertStyles.body,
            titleTextStyle: alertStyles.titleText,
            messageTextStyle: alertStyles.messageText,
            buttonStyle: alertStyles.button,
            buttonTextStyle: styles.buttonText,
            cancelButtonStyle: alertStyles.cancelButton,
            cancelButtonTextStyle: alertStyles.cancelButtonText,
            destructiveButtonStyle: alertStyles.destructiveButton
        };

        RX.Alert.show('This is a themed Alert', 'Do you like it as well?', [
            { text: 'I like it!' },
            { style: 'destructive', text: 'I don\'t like it!' },
            { style: 'cancel', text: 'Close this' }
        ], null, theme);
    }
}

export = MainPanel;
