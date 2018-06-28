/**
* TodoListPanel.tsx
* Copyright: Microsoft 2018
*
* Display first screen of the Todo application.
*/

import * as _ from 'lodash';
import * as RX from 'reactxp';
import { VirtualListView, VirtualListViewItemInfo } from 'reactxp-virtuallistview';
import { ComponentBase } from 'resub';

import AppConfig from '../app/AppConfig';
import HoverButton from '../controls/HoverButton';
import { Colors, Fonts, FontSizes } from '../app/Styles';
import TodoListItem from './TodoListItem';
import { Todo } from '../models/TodoModels';
import TodosStore from '../stores/TodosStore';

interface TodoListItemInfo extends VirtualListViewItemInfo {
    todo: Todo;
}

export interface TodoListPanelProps extends RX.CommonProps {
    selectedTodoId?: string;
    onSelect: (selectedId: string) => void;
    onCreateNew: () => void;
}

interface TodoListPanelState {
    todos: TodoListItemInfo[];
    filteredTodoList: TodoListItemInfo[];
    searchString: string;
}

const _listItemHeight = 48;

const _styles = {
    listScroll: RX.Styles.createViewStyle({
        flexDirection: 'column',
        alignSelf: 'stretch',
        backgroundColor: Colors.contentBackground
    }),
    todoListHeader: RX.Styles.createViewStyle({
        height: 60,
        borderBottomWidth: 1,
        borderColor: Colors.borderSeparator,
        flexDirection: 'row',
        alignItems: 'center'
    }),
    searchBox: RX.Styles.createTextInputStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.size14,
        borderWidth: 1,
        borderColor: Colors.borderSeparator,
        flex: 1,
        padding: 4,
        marginLeft: 12
    }),
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: Colors.contentBackground
    }),
    addTodoButton: RX.Styles.createViewStyle({
        margin: 8,
        paddingHorizontal: 8,
        paddingVertical: 4
    }),
    buttonText: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.size32,
        lineHeight: 32,
        color: Colors.buttonTextColor
    }),
    buttonTextHover: RX.Styles.createTextStyle({
        color: Colors.buttonTextHover
    })
};

export default class TodoListPanel extends ComponentBase<TodoListPanelProps, TodoListPanelState> {
    protected _buildState(props: TodoListPanelProps, initState: boolean): Partial<TodoListPanelState> | undefined {
        let partialState: Partial<TodoListPanelState> = {
        };

        partialState.todos = TodosStore.getTodos().map((todo, i) => {
            return {
                key: i.toString(),
                height: _listItemHeight,
                template: 'todo',
                todo
            };
        });

        if (initState) {
            partialState.searchString = '';
            partialState.filteredTodoList = partialState.todos;
        } else {
            let filter = _.trim(partialState.searchString);
            if (filter) {
                partialState.filteredTodoList = this._filterTodoList(partialState.todos, filter);
            } else {
                partialState.filteredTodoList = partialState.todos;
            }
        }

        return partialState;
    }

    render() {
        return (
            <RX.View useSafeInsets={ true } style={ _styles.container }>
                <RX.View style={ _styles.todoListHeader }>
                    <RX.TextInput
                        style={ _styles.searchBox }
                        value={ this.state.searchString }
                        autoFocus={ !AppConfig.isTouchInterface() }
                        placeholder={ 'Search' }
                        onChangeText={ this._onChangeTextSearch }
                        autoCapitalize={ 'none' }
                    />
                    <HoverButton
                        onPress={ this._onPressCreateNewTodo }
                        onRenderChild={ this._onRenderAddTodoButton }
                    />
                </RX.View>

                <VirtualListView
                    itemList={ this.state.filteredTodoList }
                    renderItem={ this._renderItem }
                    style={ _styles.listScroll }
                />
            </RX.View>
        );
    }

    private _onRenderAddTodoButton = (isHovering: boolean) => {
        return (
            <RX.View style={ _styles.addTodoButton }>
                <RX.Text style={ [_styles.buttonText, isHovering ? _styles.buttonTextHover : undefined] }>
                    { '+' }
                </RX.Text>
            </RX.View>
        );
    }

    private _onChangeTextSearch = (newValue: string) => {
        let filteredTodoList = this._filterTodoList(this.state.todos, newValue.trim());
        this.setState({
            filteredTodoList,
            searchString: newValue
        });
    }

    private _filterTodoList(sortedTodos: TodoListItemInfo[], searchString: string): TodoListItemInfo[] {
        let lowerSearchString = searchString.toLowerCase();

        return _.filter(sortedTodos, item => {
            let todoLower = item.todo.text.toLowerCase();
            return todoLower.search(lowerSearchString) >= 0;
        });
    }

    private _renderItem = (item: TodoListItemInfo, hasFocus?: boolean) => {
        return (
            <TodoListItem
                todo={ item.todo }
                height={ _listItemHeight }
                isSelected={ item.todo.id === this.props.selectedTodoId }
                searchString={ this.state.searchString }
                onPress={ this._onPressTodo }
            />
        );
    };

    private _onPressTodo = (todo: Todo) => {
        this.props.onSelect(todo.id);
        this.setState({
            searchString: '',
            filteredTodoList: this.state.todos
        });
    };

    private _onPressCreateNewTodo = () => {
        this.props.onCreateNew();
        this.setState({
            searchString: '',
            filteredTodoList: this.state.todos
        });
    };
}
