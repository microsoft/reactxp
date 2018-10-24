import * as RX from 'reactxp';
import React from 'react';
import { Navigator } from 'reactxp-navigation';

import { MainPanel } from './MainPanel';
import { SecondPanel } from './SecondPanel';

const NavigationRouteId = {
    MainPanel: 'MainPanel',
    SecondPanel: 'SecondPanel'
};

const styles = {
    // Standard navigator style should be an object. So we have to disable caching here.
    navCardStyle: RX.Styles.createViewStyle({
        backgroundColor: '#f5fcff'
    }, false)
};

export class RootView extends RX.Component {
    _navigator;

    componentDidMount() {
        this._navigator.immediatelyResetRouteStack([{
            routeId: NavigationRouteId.MainPanel,
            sceneConfigType: 'Fade'
        }]);
    }

    render() {
        return (
            <Navigator
                cardStyle={ styles.navCardStyle }
                renderScene={ this._renderScene }
                ref={ this._onNavigatorRef }
            />
        );
    }

    _onNavigatorRef = (navigator) => {
        this._navigator = navigator;
    }

    _renderScene = (navigatorRoute) => {
        switch (navigatorRoute.routeId) {
            case NavigationRouteId.MainPanel:
                return (
                    <MainPanel onPressNavigate={ this._onPressNavigate }/>
                );

            case NavigationRouteId.SecondPanel:
                return (
                    <SecondPanel onNavigateBack={ this._onPressBack }/>
                );
        }

        return null;
    }

    _onPressNavigate = () => {
        this._navigator.push({
            routeId: NavigationRouteId.SecondPanel,
            sceneConfigType: 'FloatFromRight'
        });
    }

    _onPressBack = () => {
        this._navigator.pop();
    }
}
