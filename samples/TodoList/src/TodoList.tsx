/**
* TodoList.tsx
* Copyright: Microsoft 2017
*
* Display the todo items.
*/

import { ComponentBase } from 'resub';
import RX = require('reactxp');
import TodosStore = require('./TodosStore');
import TodoStyles = require('./TodoStyles');

interface TodoListState {
    todos?: string[];
}

class TodoList extends ComponentBase<{}, TodoListState> {
    protected _buildState(props: {}, initialBuild: boolean): TodoListState {
        return {
            todos: TodosStore.getTodos()
        }
    }

    render() {
        return (
            <RX.ScrollView style={ TodoStyles.styles.todoListScroll} >
                { this.state.todos.map(x =>
                    <RX.View key={x} style={ TodoStyles.styles.todoListItemCell }>
                        <RX.Text key={x} style={ TodoStyles.styles.todoListItemText }>
                            { x }
                        </RX.Text>
                    </RX.View>
                ) }
            </RX.ScrollView>
        );
    }
}

export = TodoList;
