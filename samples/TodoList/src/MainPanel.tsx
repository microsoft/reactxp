/**
* MainPanel.tsx
* Copyright: Microsoft 2017
*
* Display first screen of the Todo application.
*/

import RX = require('reactxp');
import TodoStyles = require('./TodoStyles');

interface MainPanelProps {
    onPressNavigate: () => void;
}

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
            <RX.ScrollView style={ TodoStyles.styles.scroll }>
                <RX.View style={ TodoStyles.styles.container }>
                    <RX.Animated.Text style={ [TodoStyles.styles.todoListHeader, this._animatedStyle] }>
                        Todo List
                    </RX.Animated.Text>
                    <RX.Text style={ TodoStyles.styles.welcome }>
                        Welcome to ReactXP
                    </RX.Text>
                    <RX.Text style={ TodoStyles.styles.instructions }>
                        Edit App.tsx to get started
                    </RX.Text>
                    <RX.Link style={ TodoStyles.styles.docLink } url={ 'https://microsoft.github.io/reactxp/docs' }>
                        View ReactXP documentation
                    </RX.Link>

                    <RX.Button style={ TodoStyles.styles.roundButton } onPress={ this._onPressNavigate }>
                        <RX.Text style={ TodoStyles.styles.buttonText }>
                            View the Todo List
                        </RX.Text>
                    </RX.Button>
                </RX.View>
            </RX.ScrollView>
        );
    }

    private _onPressNavigate = () => {
        this.props.onPressNavigate();
    }
}

export = MainPanel;
