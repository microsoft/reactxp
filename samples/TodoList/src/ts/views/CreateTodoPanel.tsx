/**
* CreateTodoPanel.tsx
* Copyright: Microsoft 2017
*
* The Todo item edit view.
*/

import * as RX from 'reactxp';

import NavContextStore from '../stores/NavContextStore';
import SimpleButton from '../controls/SimpleButton';
import { FontSizes, Styles } from '../app/Styles';
import TodosStore from '../stores/TodosStore';

interface CreateTodoPanelProps extends RX.CommonProps {
}

interface CreateTodoPanelState {
    todoText?: string;
}

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        padding: 16
    }),
    editTodoItem: RX.Styles.createTextInputStyle({
        margin: 8,
        height: 32,
        paddingHorizontal: 4,
        fontSize: FontSizes.size16,
        alignSelf: 'stretch'
    }),
    buttonContainer: RX.Styles.createViewStyle({
        margin: 8,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    })
};

export default class CreateTodoPanel extends RX.Component<CreateTodoPanelProps, CreateTodoPanelState> {
    render() {
        return (
            <RX.View useSafeInsets={ true } style={ [_styles.container, Styles.statusBarTopMargin] }>
                <RX.TextInput
                    style={ _styles.editTodoItem }
                    value={ this.state ? this.state.todoText : '' }
                    placeholder={ 'Enter todo' }
                    onChangeText={ this._onChangeText }
                    onSubmitEditing={ this._onSubmitText }
                    accessibilityId={ 'EditTodoPanelTextInput' }
                />

                <RX.View style={ _styles.buttonContainer }>
                    <SimpleButton text={ 'Save' } onPress={ this._onPressSave } disabled={ !!this.state && !this.state.todoText }/>
                </RX.View>
            </RX.View>
        );
    }

    private _onChangeText = (newText: string) => {
        this.setState({ todoText: newText });
    }

    private _onSubmitText = () => {
        this._saveTodo();
    }

    private _onPressSave = () => {
        this._saveTodo();
    }

    private _saveTodo() {
        if (!!this.state && this.state.todoText) {
            let newTodo = TodosStore.addTodo(this.state.todoText);

            this.setState({ todoText: '' });

            NavContextStore.navigateToTodoList(NavContextStore.isUsingStackNav() ? undefined : newTodo.id);
        }
    }
}
