/*
* This file demonstrates a basic ReactXP app.
*/

import RX = require('reactxp');

import TodoListPanel = require('./TodoListPanel');
import EditTodoPanel = require('./EditTodoPanel');


enum NavigationRouteId {
    TodoListPanel,
    EditTodoPanel
}

const styles = {
    navCardStyle: RX.Styles.createViewStyle({
        backgroundColor: '#f5fcff'
    })
};

class App extends RX.Component<null, null> {
    private _navigator: RX.Navigator;

    componentDidMount() {
        this._navigator.immediatelyResetRouteStack([{
            routeId: NavigationRouteId.TodoListPanel,
            sceneConfigType: RX.Types.NavigatorSceneConfigType.Fade
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

    private _onNavigatorRef = (navigator: RX.Navigator) => {
        this._navigator = navigator;
    }

    private _renderScene = (navigatorRoute: RX.Types.NavigatorRoute) => {
        switch (navigatorRoute.routeId) {
            case NavigationRouteId.TodoListPanel:
                return (
                    <TodoListPanel
                        onNavigateBack={ this._onPressBack }
                        onShowTodoPanel={ this._onShowTodoPanel }
                    />
                );

            case NavigationRouteId.EditTodoPanel:
                return (
                    <EditTodoPanel 
                        onNavigateBack={ this._onPressBack }
                        onCancelTodo={ this._onPressBack }
                        onDeleteTodo={ this._onPressBack }
                        onSaveTodo={ this._onPressBack }
                    />
                );
        }

        return null;
    }

    private _onPressNavigate = () => {
        this._navigator.push({
            routeId: NavigationRouteId.TodoListPanel,
            sceneConfigType: RX.Types.NavigatorSceneConfigType.FloatFromRight,
            customSceneConfig: {
                hideShadow: true
            }
        });
    }

    private _onShowTodoPanel = () => {
        this._navigator.push({
            routeId: NavigationRouteId.EditTodoPanel,
            sceneConfigType: RX.Types.NavigatorSceneConfigType.FloatFromRight,
            customSceneConfig: {
                hideShadow: true
            }
        });
    }

    private _onPressBack = () => {
        this._navigator.pop();
    }
}

export = App;
