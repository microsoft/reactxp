/**
* TodoListPanel.tsx
*
* Display first screen of the Todo application.
*/

import RX = require('reactxp');

import TodoStyles = require('./TodoStyles');
import TodoList = require('./TodoList')

interface SecondPanelProps {
    onNavigateBack: () => void;
    onShowTodoPanel: () => void;
}

class TodoListPanel extends RX.Component<SecondPanelProps, null> {
    render() {
        return (
            <RX.View style={ TodoStyles.styles.container }>
                <RX.View style={ [TodoStyles.styles.header, RX.StatusBar.isOverlay() && TodoStyles.styles.headerWithStatusBar] }>
                    <RX.Button style={ TodoStyles.styles.saveRoundButton } onPress={ this._onPressCreateNewTodo }>
                        <RX.Text style={ TodoStyles.styles.buttonText }>
                            Create new todo item
                        </RX.Text>
                    </RX.Button>
                </RX.View>

                <RX.View style={ TodoStyles.styles.todoListcontainer }>
                    <TodoList />
                </RX.View>

            </RX.View>
        );
    }

    private _onPressBack = () => {
        this.props.onNavigateBack();
    }

    private _onPressCreateNewTodo = () => {
        this.props.onShowTodoPanel();
    }
}

export = TodoListPanel;
