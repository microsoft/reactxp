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

class EditTodoPanel extends RX.Component<TodoPanelProps, null> {

    private newItem?: string;

    render() {
        return (
            <RX.View style={ TodoStyles.styles.container }>
                <RX.View style={ TodoStyles.styles.header }>
                    <RX.Button style={ TodoStyles.styles.defaultRoundButton } onPress={ this._onPressBack }>
                        <RX.Text style={ TodoStyles.styles.buttonText }>
                            Cancel
                        </RX.Text>
                    </RX.Button>

                    <RX.Button style={ TodoStyles.styles.saveRoundButton } onPress={ this._onPressSave }>
                        <RX.Text style={ TodoStyles.styles.buttonText }>
                            Save
                        </RX.Text>
                    </RX.Button>
                </RX.View>

                <RX.TextInput style={ TodoStyles.styles.editTodoItem }
                    placeholder={ "Enter your new todo item" }
                    placeholderTextColor={ TodoStyles.color.gray }
                    onChangeText={ this._onChangeText }
                    autoFocus={ true }
                    multiline={ true }
                    textAlign={ 'left' }
                />
            </RX.View>
        );
    }

    private _onPressBack = () => {
        this.props.onNavigateBack();
    }

    private _onChangeText = (newText: string) => {
        this.newItem = newText
    }

    private _onPressSave = () => {
        if (this.newItem && this.newItem.length > 0) {
            TodosStore.addTodo(this.newItem)
        }
        this.props.onNavigateBack();
    }
}

export = EditTodoPanel;
