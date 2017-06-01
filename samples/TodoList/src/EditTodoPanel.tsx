/**
* TodoList.tsx
* Copyright: Microsoft 2017
*
* The Todo item edit view.
*/

import RX = require('reactxp');
import TodoStyles = require('./TodoStyles');
import TodosStore = require('./TodosStore')

interface TodoPanelProps {
    onNavigateBack: () => void;
    onSaveTodo: () => void;
    onCancelTodo: () => void;
    onDeleteTodo: () => void;
}

interface TodoPanelState {
    todoText?: string;
}

const _styles = {
    editTodoItem: RX.Styles.createTextStyle({
        margin: 8,
        height: 32,
        fontSize: TodoStyles.fontSizes.size20,
        alignSelf: 'stretch',
        backgroundColor: 'transparent'
    })
};

class EditTodoPanel extends RX.Component<TodoPanelProps, TodoPanelState> {
    constructor() {
        super();

        this.state = {};
    }

    render() {
        return (
            <RX.View style={ TodoStyles.styles.container }>
                <RX.View style={ [TodoStyles.styles.header, RX.StatusBar.isOverlay() && TodoStyles.styles.headerWithStatusBar] }>
                    <RX.Button style={ TodoStyles.styles.cancelButton } onPress={ this._onPressBack }>
                        <RX.Text style={ TodoStyles.styles.buttonText }>
                            Cancel
                        </RX.Text>
                    </RX.Button>

                    <RX.Button
                        style={ TodoStyles.styles.submitButton }
                        onPress={ this._onPressSave }
                        disabled={ !this.state.todoText }
                    >
                        <RX.Text style={ TodoStyles.styles.buttonText }>
                            Save
                        </RX.Text>
                    </RX.Button>
                </RX.View>

                <RX.TextInput
                    style={ _styles.editTodoItem }
                    value={ this.state.todoText }
                    placeholder={ 'Enter reminder' }
                    placeholderTextColor={ TodoStyles.controlColors.placeholderText }
                    onChangeText={ this._onChangeText }
                    autoFocus={ true }
                    textAlign={ 'left' }
                />
            </RX.View>
        );
    }

    private _onPressBack = () => {
        this.setState({ todoText: '' });
        this.props.onNavigateBack();
    }

    private _onChangeText = (newText: string) => {
        this.setState({ todoText: newText });
    }

    private _onPressSave = () => {
        if (this.state.todoText) {
            TodosStore.addTodo(this.state.todoText)
    
            this.setState({ todoText: '' });
            this.props.onNavigateBack();
        }
    }
}

export = EditTodoPanel;
