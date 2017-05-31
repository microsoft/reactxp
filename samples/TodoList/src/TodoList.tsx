/**
* TodoList.tsx
*
* Display the todo items.
*/

import RX = require('reactxp');
import { ComponentBase } from 'resub';
import { VirtualListView, VirtualListViewItemInfo } from 'reactxp-virtuallistview';

import TodosStore = require('./TodosStore');
import TodoStyles = require('./TodoStyles');

interface TodoListViewItemInfo extends VirtualListViewItemInfo {
    text: string;
}

interface TodoListState {
    todos?: TodoListViewItemInfo[];
}

class TodoList extends ComponentBase<{}, TodoListState> {
    protected _buildState(props: {}, initialBuild: boolean): TodoListState {
        return {
            todos: TodosStore.getTodos().map((todoString, i) => {
                return {
                    key: i.toString(),
                    height: 28,
                    template: 'todo',
                    text: todoString
                };
            })
        }
    }

    render() {
        return (
            <VirtualListView
                itemList={ this.state.todos }
                renderItem={ this._renderItem }
                style={ TodoStyles.styles.todoListScroll }
            />
        );
    }

    private _renderItem = (item: TodoListViewItemInfo, hasFocus?: boolean) => {
        return (
            <RX.View style={ TodoStyles.styles.todoListItemCell }>
                <RX.Text style={ TodoStyles.styles.todoListItemText }>
                    { item.text }
                </RX.Text>
            </RX.View>
        );
    }
}

export = TodoList;
