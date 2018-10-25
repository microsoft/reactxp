import * as React from 'react';
import * as RX from 'reactxp';
import Navigator, { NavigatorDelegateSelector as DelegateSelector, Types } from 'reactxp-navigation';

import { MainPanel } from './MainPanel';
import { SecondPanel } from './SecondPanel';

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

export class RootView extends RX.Component<RX.CommonProps, RX.Stateless> {
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
                delegateSelector={ DelegateSelector }
                cardStyle={ styles.navCardStyle }
                renderScene={ this._renderScene }
                ref={ this._onNavigatorRef }
            />
        );
    }

    private _onNavigatorRef = (navigator: Navigator) => {
        this._navigator = navigator;
    }

    private _renderScene = (navigatorRoute: Types.NavigatorRoute) => {
        switch (navigatorRoute.routeId) {
            case NavigationRouteId.MainPanel:
                return (
                    <MainPanel onPressNavigate={ this._onPressNavigate } />
                );

            case NavigationRouteId.SecondPanel:
                return (
                    <SecondPanel onNavigateBack={ this._onPressBack } />
                );
        }

        return null;
    }

    private _onPressNavigate = () => {
        if (this._navigator) {
            this._navigator.push({
                sceneConfigType: Types.NavigatorSceneConfigType.FloatFromRight,
                routeId: NavigationRouteId.SecondPanel
            });
        }
    }

    private _onPressBack = () => {
        if (this._navigator) {
            this._navigator.pop();
        }
    }
}
