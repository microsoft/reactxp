/*
* TopBarComposite.tsx
* Copyright: Microsoft 2018
*
* Horizontal bar that appears on the top of every view within the app
* when it's using composite layout (as opposed to stack-based layout).
*/

import ImageSource from 'modules/images';
import * as RX from 'reactxp';
import { ComponentBase } from 'resub';

import AccountMenuButton from './AccountMenuButton';
import HoverButton from '../controls/HoverButton';
import NavContextStore from '../stores/NavContextStore';
import { Colors, Fonts, FontSizes } from '../app/Styles';
import VerticalSeparator from '../controls/VerticalSeparator';

const _styles = {
    background: RX.Styles.createViewStyle({
        alignSelf: 'stretch',
        height: 50,
        borderBottomWidth: 1,
        borderColor: Colors.gray66,
        flexDirection: 'row',
        paddingHorizontal: 16
    }),
    logoContainer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        alignItems: 'center'
    }),
    barControlsContainer: RX.Styles.createViewStyle({
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row'
    }),
    logoImage: RX.Styles.createImageStyle({
        height: 24,
        width: 26
    }),
    logoText: RX.Styles.createTextStyle({
        font: Fonts.displaySemibold,
        fontSize: FontSizes.size20,
        marginHorizontal: 4,
        color: Colors.logoColor
    }),
    linkText: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.menuItem,
        marginHorizontal: 8,
        color: Colors.menuText
    }),
    linkTextHover: RX.Styles.createTextStyle({
        color: Colors.menuTextHover
    }),
    backButtonContainer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        alignItems: 'center'
    }),
    backText: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.size16,
        color: Colors.menuText
    })
};

export interface TopBarCompositeProps extends RX.CommonProps {
    showBackButton: boolean;
    onBack?: () => void;
}

export default class TopBarComposite extends ComponentBase<TopBarCompositeProps, RX.Stateless> {
    render(): JSX.Element | null {
        let leftContents: JSX.Element | undefined;

        if (this.props.showBackButton) {
            leftContents = (
                <HoverButton onPress={ this._onPressBack } onRenderChild={ this._renderBackButton }/>
            );
        } else {
            leftContents = (
                <RX.Button onPress={ this._onPressLogo }>
                    <RX.View style={ _styles.logoContainer }>
                        <RX.Image source={ ImageSource.todoLogo } style={ _styles.logoImage }/>
                        <RX.Text style={ _styles.logoText }>
                            { 'Todo List' }
                        </RX.Text>
                    </RX.View>
                </RX.Button>
            );
        }
        return (
            <RX.View style={ _styles.background }>
                { leftContents }
                <RX.View style={ _styles.barControlsContainer }>
                    <VerticalSeparator />
                    <HoverButton onPress={ this._onPressHelp } onRenderChild={ this._onRenderHelpButton } />
                    <VerticalSeparator />
                    <AccountMenuButton />
                </RX.View>
            </RX.View>
        );
    }

    private _onPressBack = (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation();

        if (this.props.onBack) {
            this.props.onBack();
        }
    }

    private _renderBackButton = (isHovering: boolean) => {
        return (
            <RX.View style={ _styles.backButtonContainer }>
                <RX.Text style={ [_styles.backText, isHovering ? _styles.linkTextHover : undefined] }>
                    { 'Back' }
                </RX.Text>
            </RX.View>
        );
    }

    private _onPressLogo = (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation();

        NavContextStore.navigateToTodoList('', false);
    }

    private _onPressHelp = (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation();

        RX.Linking.openUrl('https://www.bing.com/search?q=help');
    };

    private _onRenderHelpButton = (isHovering: boolean) => {
        let textStyles = [_styles.linkText];
        if (isHovering) {
            textStyles.push(_styles.linkTextHover);
        }

        return (
            <RX.Text style={ textStyles }>
                { 'Help' }
            </RX.Text>
        );
    };
}
