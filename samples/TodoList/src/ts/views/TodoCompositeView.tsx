/*
* TodoCompositeView.tsx
* Copyright: Microsoft 2018
*
* Main view that provides a composite view of todos on the left and
* details of the selected todo on the right.
*/

import * as RX from 'reactxp';
import { ComponentBase } from 'resub';

import CreateTodoPanel from './CreateTodoPanel';
import NavContextStore from '../stores/NavContextStore';
import * as NavModels from '../models/NavModels';
import { Colors } from '../app/Styles';
import TodoListPanel from './TodoListPanel';
import ViewTodoPanel from './ViewTodoPanel';

export interface TodoCompositeViewProps extends RX.CommonProps {
    navContext: NavModels.TodoRootNavContext;
}

interface TodoCompositeViewState {
}

const _styles = {
    viewContainer: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row'
    }),
    leftPanelContainer: RX.Styles.createViewStyle({
        width: 400,
        flexDirection: 'column'
    }),
    rightPanelContainer: RX.Styles.createViewStyle({
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.grayF8
    })
};

export default class TodoCompositeView extends ComponentBase<TodoCompositeViewProps, TodoCompositeViewState> {
    protected _buildState(props: TodoCompositeViewProps, initState: boolean): Partial<TodoCompositeViewState> | undefined {
        return undefined;
    }

    render(): JSX.Element | null {
        return (
            <RX.View style={ _styles.viewContainer }>
                <RX.View style={ _styles.leftPanelContainer }>
                    <TodoListPanel
                        selectedTodoId={ this.props.navContext.todoList.selectedTodoId || '' }
                        onSelect={ this._onSelectTodo }
                        onCreateNew={ this._onCreateNewTodo }
                    />
                </RX.View>
                <RX.View style={ _styles.rightPanelContainer }>
                    { this._renderRightPanel() }
                </RX.View>
            </RX.View>
        );
    }

    private _renderRightPanel() {
        if (this.props.navContext.showNewTodoPanel) {
            return (
                <CreateTodoPanel />
            );
        } else if (this.props.navContext.todoList.selectedTodoId) {
            return (
                <ViewTodoPanel todoId={ this.props.navContext.todoList.selectedTodoId } />
            );
        } else {
            return null;
        }
    }

    private _onSelectTodo = (todoId: string) => {
        NavContextStore.navigateToTodoList(todoId, false);
    }

    private _onCreateNewTodo = () => {
        NavContextStore.navigateToTodoList('', true);
    }
}
