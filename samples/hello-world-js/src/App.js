/*
 * This file demonstrates a basic ReactXP app.
 */

import React from 'react';
import RX from 'reactxp';

import MainPanel from './MainPanel';
import SecondPanel from './SecondPanel';

let NavigationRouteId = {
    MainPanel: "MainPanel",
    SecondPanel: "SecondPanel"
};

const styles = {
    navCardStyle: RX.Styles.createViewStyle({
        backgroundColor: '#f5fcff'
    })
};

export default class App extends RX.Component {
    _navigator;

    constructor(props) {
        super(props);
        this._onNavigatorRef = this._onNavigatorRef.bind(this);
        this._renderScene = this._renderScene.bind(this);
        this._onPressNavigate = this._onPressNavigate.bind(this);
        this._onPressBack = this._onPressBack.bind(this);
    }

    componentDidMount() {
        this._navigator.immediatelyResetRouteStack([{
            routeId: NavigationRouteId.MainPanel,
            sceneConfigType: "Fade"
        }]);
    }

    render() {
        return (
            <RX.Navigator
                ref={ this._onNavigatorRef }
                renderScene={ this._renderScene }
                cardStyle={ styles.navCardStyle }
            />
        );
    }

    _onNavigatorRef(navigator) {
        this._navigator = navigator;
    }

    _renderScene(navigatorRoute) {
        switch (navigatorRoute.routeId) {
            case NavigationRouteId.MainPanel:
                return <MainPanel onPressNavigate={ this._onPressNavigate }/>;

            case NavigationRouteId.SecondPanel:
                return <SecondPanel onNavigateBack={ this._onPressBack }/>;
        }

        return null;
    }

    _onPressNavigate() {
        this._navigator.push({
            routeId: NavigationRouteId.SecondPanel,
            sceneConfigType: "FloatFromRight",
            customSceneConfig: {
                hideShadow: true
            }
        });
    }

    _onPressBack() {
        this._navigator.pop();
    }
};
