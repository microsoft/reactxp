/*
* TodoListItem.tsx
* Copyright: Microsoft 2018
*
* Renders a list item that represents a todo item.
*/

import ImageSource from 'modules/images';
import * as RX from 'reactxp';
import { ComponentBase } from 'resub';

import HoverButton from '../controls/HoverButton';
import { Colors, Fonts, FontSizes } from '../app/Styles';
import { Todo } from '../models/TodoModels';

interface TodoListItemProps extends RX.CommonProps {
    height: number;
    todo: Todo;
    isSelected: boolean;
    searchString?: string;
    onPress: (todo: Todo) => void;
}

interface TodoListItemState {
    heightStyle: RX.Types.ViewStyleRuleSet;
}

const _itemBorderWidth = 1;

const _styles = {
    container: RX.Styles.createButtonStyle({
        alignSelf: 'stretch',
        borderBottomWidth: _itemBorderWidth,
        borderColor: Colors.borderSeparatorLight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: Colors.white
    }),
    todoNameText: RX.Styles.createTextStyle({
        flex: -1,
        fontSize: FontSizes.size16,
        font: Fonts.displayRegular,
        color: Colors.menuText,
        margin: 8
    }),
    todoNameTextSelected: RX.Styles.createTextStyle({
        font: Fonts.displaySemibold,
        color: Colors.menuTextSelected
    }),
    todoImage: RX.Styles.createImageStyle({
        marginLeft: 16,
        marginRight: 4,
        height: 20,
        width: 24
    }),
    hovering: RX.Styles.createButtonStyle({
        backgroundColor: Colors.listItemHover
    }),
    selected: RX.Styles.createButtonStyle({
        backgroundColor: Colors.listItemSelected
    })
};

export default class TodoManagementView extends ComponentBase<TodoListItemProps, TodoListItemState> {
    protected _buildState(props: TodoListItemProps, initState: boolean): Partial<TodoListItemState> | undefined {
        let partialState: Partial<TodoListItemState> = {
            heightStyle: RX.Styles.createViewStyle({
                height: props.height
            }, false)
        };
        return partialState;
    }

    render(): JSX.Element | null {
        return (
            <HoverButton onPress={ this._onPress } onRenderChild={ this._onRenderItem } />
        );
    }

    private _onPress = (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation();

        this.props.onPress(this.props.todo);
    }

    private _onRenderItem = (isHovering: boolean) => {
        let buttonStyles = [_styles.container, this.state.heightStyle];
        if (this.props.isSelected) {
            buttonStyles.push(_styles.selected);
        } else if (isHovering) {
            buttonStyles.push(_styles.hovering);
        }

        let nameText: JSX.Element;
        let searchString = this.props.searchString ? this.props.searchString.trim().toLowerCase() : '';
        let searchSubstrIndex = -1;
        if (searchString) {
            searchSubstrIndex = this.props.todo.text.toLowerCase().indexOf(searchString);
        }

        if (searchSubstrIndex >= 0) {
            nameText = (
                <RX.Text style={ _styles.todoNameText } numberOfLines={ 1 }>
                    <RX.Text numberOfLines={ 1 }>
                        { this.props.todo.text.substr(0, searchSubstrIndex) }
                    </RX.Text>
                    <RX.Text style={ _styles.todoNameTextSelected } numberOfLines={ 1 }>
                        { this.props.todo.text.substr(searchSubstrIndex, searchString.length) }
                    </RX.Text>
                    <RX.Text numberOfLines={ 1 }>
                        { this.props.todo.text.substr(searchSubstrIndex + searchString.length) }
                    </RX.Text>
                </RX.Text>
            );
        } else {
            nameText = (
                <RX.Text style={ _styles.todoNameText } numberOfLines={ 1 }>
                    { this.props.todo.text }
                </RX.Text>
            );
        }

        return (
            <RX.View style={ buttonStyles }>
                <RX.Image
                    style={ _styles.todoImage }
                    source={ ImageSource.todoSmall }
                />
                { nameText }
            </RX.View>
        );
    }
}
