/*
 * This file demonstrates a basic ReactXP app.
 */

import React from 'react';
import RX from 'reactxp';

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

export default class MainPanel extends RX.Component{
    constructor(props) {
        super(props);
        this._translationValue = RX.Animated.createValue(-100);
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
            <RX.View useSafeInsets={ true }>
                <RX.ScrollView style={ styles.scroll }>
                    <RX.View style={ styles.container }>
                        <RX.Animated.Text style={ [styles.helloWorld, this._animatedStyle] }>
                            Hello World
                        </RX.Animated.Text>
                        <RX.Text style={ styles.welcome }>
                            Welcome to ReactXP
                        </RX.Text>
                        <RX.Text style={ styles.instructions }>
                            Edit App.js to get started
                        </RX.Text>
                        <RX.Link style={ styles.docLink } url={ 'https://microsoft.github.io/reactxp/docs' }>
                            View ReactXP documentation
                        </RX.Link>

                        <RX.Button style={ styles.roundButton } onPress={ this.props.onPressNavigate }>
                            <RX.Text style={ styles.buttonText }>
                                See More Examples
                            </RX.Text>
                        </RX.Button>
                    </RX.View>
                </RX.ScrollView>
            </RX.View>
        );
    }
}