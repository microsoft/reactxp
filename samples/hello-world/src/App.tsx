/*
* This file demonstrates a basic ReactXP app.
*/

// This example uses ExperimentalNavigation on iOS and Android
import Navigator, { Types, NavigatorDelegateSelector as DelegateSelector } from 'reactxp-navigation';
import RX = require('reactxp');

import MainPanel = require('./MainPanel');
import SecondPanel = require('./SecondPanel');

enum NavigationRouteId {
    MainPanel,
    SecondPanel
}

const styles = {
    // Standard navigator style should be an object. So we have to disable caching here.
    navCardStyle: RX.Styles.createViewStyle({
        backgroundColor: '#f5fcff'
    }, false)
};

class App extends RX.Component<RX.CommonProps, RX.Stateless> {
    private _navigator: Navigator | undefined;

    componentDidMount() {
        if (this._navigator) {
            this._navigator.immediatelyResetRouteStack([{
                routeId: NavigationRouteId.MainPanel,
                sceneConfigType: Types.NavigatorSceneConfigType.Fade
            }]);
        }
    }

    render() {
        return (
            <Navigator
                ref={ this._onNavigatorRef }
                renderScene={ this._renderScene }
                cardStyle={ styles.navCardStyle }
                delegateSelector={ DelegateSelector }
            />
        );
    }

    private _onNavigatorRef = (navigator: any) => {
        this._navigator = navigator;
    }

    private _renderScene = (navigatorRoute: Types.NavigatorRoute) => {
        switch (navigatorRoute.routeId) {
            case NavigationRouteId.MainPanel:
                return (
                    <MainPanel
                        onPressNavigate={ this._onPressNavigate }
                    />
                );

            case NavigationRouteId.SecondPanel:
                return (
                    <SecondPanel
                        onNavigateBack={ this._onPressBack }
                    />
                );
        }

        return null;
    }

    private _onPressNavigate = () => {
        if (this._navigator) {
            this._navigator.push({
                routeId: NavigationRouteId.SecondPanel,
                sceneConfigType: Types.NavigatorSceneConfigType.FloatFromRight
            });
        }
    }

    private _onPressBack = () => {
        if (this._navigator) {
            this._navigator.pop();
        }
    }
}

export = App;
