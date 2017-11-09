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

const _itemHeight = 32;

const _styles = {
    listScroll: RX.Styles.createViewStyle({
        flexDirection: 'column',
        alignSelf: 'stretch',
        backgroundColor: TodoStyles.controlColors.contentBackground
    }),
    itemCell: RX.Styles.createViewStyle({
        flex : 1,
        height: _itemHeight,
        justifyContent: 'center'
    }),
    itemText: RX.Styles.createTextStyle({
        fontSize: TodoStyles.fontSizes.size20,
        marginHorizontal: 8,
        alignSelf: 'stretch',
        color: '#666'
    })
};

class TodoList extends ComponentBase<{}, TodoListState> {
    protected _buildState(props: {}, initialBuild: boolean): TodoListState {
        return {
            todos: TodosStore.getTodos().map((todo, i) => {
                return {
                    key: i.toString(),
                    height: _itemHeight,
                    template: 'todo',
                    text: todo.text
                };
            })
        }
    }

    render() {
        return (
            <VirtualListView
                itemList={ this.state.todos }
                renderItem={ this._renderItem }
                style={ _styles.listScroll }
            />
        );
    }

    private _renderItem = (item: TodoListViewItemInfo, hasFocus?: boolean) => {
        return (
            <RX.View style={ _styles.itemCell }>
                <RX.Text style={ _styles.itemText } numberOfLines={ 1 }>
                    { item.text }
                </RX.Text>
            </RX.View>
        );
    }
}

export = TodoList;
