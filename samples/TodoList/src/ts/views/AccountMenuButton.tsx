/*
* AccountMenuButton.tsx
* Copyright: Microsoft 2018
*
* Button that displays the currently-signed-in user and provides
* a popup menu that allows the user to sign out, adjust account
* settings, etc.
*/

import * as RX from 'reactxp';
import { ComponentBase } from 'resub';

import CurrentUserStore from '../stores/CurrentUserStore';
import SimpleMenu, { MenuItem } from '../controls/SimpleMenu';
import { Colors, Fonts, FontSizes } from '../app/Styles';

interface AccountMenuButtonState {
    currentUserName: string;
    isHovering: boolean;
}

const _menuPopupId = 'accountMenu';

const _styles = {
    buttonContainer: RX.Styles.createButtonStyle({
        paddingHorizontal: 4,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center'
    }),
    nameText: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.menuItem,
        marginHorizontal: 8,
        color: Colors.menuText
    }),
    nameTextHover: RX.Styles.createTextStyle({
        color: Colors.menuTextHover
    }),
    circleGlyph: RX.Styles.createViewStyle({
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.menuText,
        backgroundColor: Colors.logoColor
    }),
    circleGlyphHover: RX.Styles.createViewStyle({
        borderColor: Colors.menuTextHover
    })
};

export default class AccountMenuButton extends ComponentBase<RX.CommonProps, AccountMenuButtonState> {
    private _mountedButton: any;

    protected _buildState(props: RX.CommonProps, initState: boolean): Partial<AccountMenuButtonState> | undefined {
        let partialState: Partial<AccountMenuButtonState> = {
            currentUserName: CurrentUserStore.getFullName()
        };

        return partialState;
    }

    render(): JSX.Element | null {
        return (
            <RX.Button
                ref={ this._onMountButton }
                style={ _styles.buttonContainer }
                onPress={ this._onPress }
                onHoverStart={ () => this.setState({ isHovering: true }) }
                onHoverEnd={ () => this.setState({ isHovering: false }) }
            >
                <RX.View style={ [_styles.circleGlyph, this.state.isHovering ? _styles.circleGlyphHover : undefined] }/>
                <RX.Text
                    style={ [_styles.nameText, this.state.isHovering ? _styles.nameTextHover : undefined] }
                >
                    { this.state.currentUserName }
                </RX.Text>
            </RX.Button>
        );
    }

    private _onMountButton = (elem: any) => {
        this._mountedButton = elem;
    }

    private _onPress = (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation();

        RX.Popup.show({
            getAnchor: () => {
                return this._mountedButton;
            },
            getElementTriggeringPopup: () => {
                return this._mountedButton;
            },
            renderPopup: (anchorPosition: RX.Types.PopupPosition, anchorOffset: number, popupWidth: number, popupHeight: number) => {
                let items: MenuItem[] = [{
                    command: 'settings',
                    text: 'Account Settings'
                }, {
                    command: '',
                    text: '-'
                }, {
                    command: 'signout',
                    text: 'Sign Out'
                }];

                return (
                    <SimpleMenu
                        menuItems={ items }
                        onSelectItem={ this._onSelectMenuItem }
                    />
                );
            },
            dismissIfShown: true
        }, _menuPopupId);
    }

    private _onSelectMenuItem = (command: string) => {
        RX.Popup.dismiss(_menuPopupId);

        // TODO - need to implement
    }
}
