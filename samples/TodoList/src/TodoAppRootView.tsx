/*
* Top-level UI for sample to-do app.
*/

import Navigator, { Types } from 'reactxp-navigation';
import RX = require('reactxp');

import EditTodoPanel = require('./EditTodoPanel');
import TodoListPanel = require('./TodoListPanel');
import TotoStyles = require('./TodoStyles');

enum NavigationRouteId {
    TodoListPanel,
    EditTodoPanel
}

const styles = {
    // Standard navigator style should be an object. So we have to disable caching here.
    navCardStyle: RX.Styles.createViewStyle({
        backgroundColor: TotoStyles.controlColors.contentBackground,
    }, false)
};

class TodoAppRootView extends RX.Component<{}, null> {
    private _navigator: Navigator;

    componentDidMount() {
        this._navigator.immediatelyResetRouteStack([{
            routeId: NavigationRouteId.TodoListPanel,
            sceneConfigType: Types.NavigatorSceneConfigType.Fade
        }]);
    }

    render() {
        return (
            <Navigator
                ref={ this._onNavigatorRef }
                renderScene={ this._renderScene }
                cardStyle={ styles.navCardStyle }
            />
        );
    }

    private _onNavigatorRef = (navigator: Navigator) => {
        this._navigator = navigator;
    }

    private _renderScene = (navigatorRoute: Types.NavigatorRoute) => {
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

    private _onShowTodoPanel = () => {
        this._navigator.push({
            routeId: NavigationRouteId.EditTodoPanel,
            sceneConfigType: Types.NavigatorSceneConfigType.FloatFromRight            
        });
    }

    private _onPressBack = () => {
        this._navigator.pop();
    }
}

export = TodoAppRootView;
