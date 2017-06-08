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

const _styles = {
    listContainer: RX.Styles.createViewStyle({
        padding: 0,
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'stretch'
    })
};

class TodoListPanel extends RX.Component<SecondPanelProps, null> {
    render() {
        return (
            <RX.View style={ TodoStyles.styles.container }>
                <RX.View style={ [TodoStyles.styles.header, RX.StatusBar.isOverlay() && TodoStyles.styles.headerWithStatusBar] }>
                    <RX.Button style={ TodoStyles.styles.submitButton } onPress={ this._onPressCreateNewTodo }>
                        <RX.Text style={ TodoStyles.styles.buttonText }>
                            Add reminder
                        </RX.Text>
                    </RX.Button>
                </RX.View>

                <RX.View style={ _styles.listContainer }>
                    <TodoList />
                </RX.View>
            </RX.View>
        );
    }

    private _onPressCreateNewTodo = () => {
        this.props.onShowTodoPanel();
    }
}

export = TodoListPanel;
